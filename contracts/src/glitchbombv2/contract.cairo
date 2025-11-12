#[starknet::interface]
pub trait PlayerActionsV2<T> {
    fn buy_gamepack(ref self: T);
    fn open_gamepack(ref self: T, gamepack_id: u32);
    fn start_game(ref self: T, gamepack_id: u32);
    fn pull_orb(ref self: T, gamepack_id: u32);
    fn cash_out(ref self: T, gamepack_id: u32);
    fn enter_shop(ref self: T, gamepack_id: u32);
    fn buy_common(ref self: T, gamepack_id: u32, index: u32);
    fn buy_rare(ref self: T, gamepack_id: u32, index: u32);
    fn buy_cosmic(ref self: T, gamepack_id: u32, index: u32);
    fn next_level(ref self: T, gamepack_id: u32);
    fn next_game(ref self: T, gamepack_id: u32);
}

pub fn NAME() -> ByteArray {
    "gb_contract_v2"
}

#[dojo::contract]
pub mod gb_contract_v2 {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo::world::{IWorldDispatcherTrait, WorldStorage, WorldStorageTrait};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address};
    use crate::constants::{CONFIG_ID, DEFAULT_ENTRY_PRICE, NAMESPACE};
    use crate::events::index::GameEvent;
    use crate::glitchbombv2::game::{
        Game, GameAction, GameState, GameTrait, OrbsInGame, OrbsInGameTrait, new_game_data,
        orbs_to_effects, update_game,
    };
    use crate::glitchbombv2::gamepack::{
        GamePack, GamePackAction, GamePackState, GamePackTrait, new_gamepack_data, update_gamepack,
    };
    use crate::glitchbombv2::orbs::{update_common_orbs, update_cosmic_orbs, update_rare_orbs};
    use crate::glitchbombv2::shared::shuffle;
    use crate::interfaces::vrf::IVrfProviderDispatcher;
    use crate::models::config::{Config, ConfigTrait};
    use crate::systems::collection::{
        ICollectionDispatcher, ICollectionDispatcherTrait, NAME as COLLECTION_NAME,
    };
    use crate::systems::token::NAME as TOKEN_NAME;
    use crate::systems::vrf::NAME as VRF_NAME;
    use crate::types::random::RandomTrait;
    use super::PlayerActionsV2;

    // Constructor

    fn dojo_init(
        ref self: ContractState,
        collection_address: Option<ContractAddress>,
        token_address: Option<ContractAddress>,
        vrf_address: Option<ContractAddress>,
    ) {
        // [Setup] World and Store
        let mut world = self.world_default();
        // [Effect] Create config
        let collection_address = if let Option::Some(collection_address) = collection_address {
            collection_address
        } else {
            world.dns_address(@COLLECTION_NAME()).expect('Collection not found!')
        };
        let token_address = if let Option::Some(token_address) = token_address {
            token_address
        } else {
            world.dns_address(@TOKEN_NAME()).expect('Token not found!')
        };
        let vrf_address = if let Option::Some(vrf_address) = vrf_address {
            vrf_address
        } else {
            world.dns_address(@VRF_NAME()).expect('VRF not found!')
        };
        let config = ConfigTrait::new(CONFIG_ID, collection_address, token_address, vrf_address);
        world.write_model(@config);
    }

    #[abi(embed_v0)]
    impl PlayerActionsV2Impl of PlayerActionsV2<ContractState> {
        fn buy_gamepack(ref self: ContractState) {
            // [Setup] World
            let mut world = self.world_default();

            // [Interaction] Pay
            let config: Config = world.read_model(CONFIG_ID);
            let player = get_caller_address();
            let token = IERC20Dispatcher { contract_address: config.token };
            let contract_address = starknet::get_contract_address();
            token.transfer_from(player, contract_address, DEFAULT_ENTRY_PRICE);

            // [Effect] Store new GamePack
            let gamepack_id: u32 = world.dispatcher.uuid() + 1;
            let new_gamepack = GamePackTrait::create_for_player(gamepack_id);
            world.write_model(@new_gamepack);

            // [Interaction] Mint NFT
            let collection = ICollectionDispatcher { contract_address: config.collection };
            collection.mint(player, gamepack_id.into());
        }

        // NOTE: opening a gamepack starts the first game at game_id = 1, we need to increment this
        // when game ends so player can "start_game" to play the next game.
        // we need to also set the next game state to New instead of Empty, need to think about how
        // we handle next game.
        fn open_gamepack(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Open gamepack
            let mut gamepack: GamePack = world.read_model(gamepack_id);

            let action = GamePackAction::OpenPack;
            let (new_gamepack_state, new_gamepack_data) =
                match update_gamepack(gamepack.state, gamepack.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            gamepack.state = new_gamepack_state;
            gamepack.data = new_gamepack_data;
            let new_game = GameTrait::create_first_for_gamepack(@gamepack);

            world.write_model(@gamepack);
            world.write_model(@new_game);
        }

        fn start_game(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Start game
            let gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));

            let mut random = RandomTrait::new();
            let game_action = GameAction::StartGame;
            let (new_game_state, mut new_game_data) =
                match update_game(game.state, game.data, game_action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let orbs_in_game = OrbsInGameTrait::create_for_game(
                gamepack_id, gamepack.data.current_game_id,
            );
            let pullable_orbs = orbs_in_game.to_pullable_orbs();
            new_game_data.pullable_orbs = pullable_orbs;
            game.state = new_game_state;
            game.data = new_game_data;

            world.write_model(@gamepack);
            world.write_model(@game);
            world.write_model(@orbs_in_game);
        }

        fn pull_orb(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Load Randomness
            let config: Config = world.read_model(CONFIG_ID);
            let mut random = RandomTrait::new_vrf(
                IVrfProviderDispatcher { contract_address: config.vrf },
            );

            // [Effect] Pull orb
            let mut gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::PullOrb;

            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            game.state = new_game_state;
            game.data = new_game_data;

            if new_game_state == GameState::GameOver {
                game.data.temp_moonrocks += game.data.moonrocks_earned;
                game.data.temp_moonrocks -= game.data.moonrocks_spent;
                gamepack.data.accumulated_moonrocks = game.data.temp_moonrocks;
                world.write_model(@gamepack);
            }

            world.write_model(@game);

            // [Event] Emit game event
            let event = GameEvent {
                gamepack_id,
                game_id: gamepack.data.current_game_id,
                tick: game.data.level * 100 + game.data.pull_number,
                state: new_game_state,
                data: game.data,
            };
            world.emit_event(@event);
        }


        fn cash_out(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Cash out
            let mut gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::CashOut;

            let mut random = RandomTrait::new();
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            game.state = new_game_state;
            game.data = new_game_data;
            gamepack.data.accumulated_moonrocks = game.data.temp_moonrocks;

            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn enter_shop(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Enter shop
            let gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::EnterShop;

            let config: Config = world.read_model(CONFIG_ID);
            let mut random = RandomTrait::new_vrf(
                IVrfProviderDispatcher { contract_address: config.vrf },
            );
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            game.state = new_game_state;
            game.data = new_game_data;

            orbs_in_game.common = shuffle(orbs_in_game.common, ref random);
            orbs_in_game.rare = shuffle(orbs_in_game.rare, ref random);
            orbs_in_game.cosmic = shuffle(orbs_in_game.cosmic, ref random);

            world.write_model(@game);
            world.write_model(@orbs_in_game);
        }

        fn buy_common(ref self: ContractState, gamepack_id: u32, index: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Buy common orb
            let gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((gamepack_id, gamepack.data.current_game_id));

            let orb_price = *orbs_in_game.common.at(index).current_price;

            let action = GameAction::BuyOrb(orb_price);

            let mut random = RandomTrait::new();
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let (new_common, new_rare, new_cosmic) = update_common_orbs(
                orbs_in_game.common, orbs_in_game.rare, orbs_in_game.cosmic, index,
            );

            game.state = new_game_state;
            game.data = new_game_data;
            orbs_in_game.common = new_common;
            orbs_in_game.rare = new_rare;
            orbs_in_game.cosmic = new_cosmic;

            world.write_model(@game);
            world.write_model(@orbs_in_game);
        }

        fn buy_rare(ref self: ContractState, gamepack_id: u32, index: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Buy rare orb
            let gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((gamepack_id, gamepack.data.current_game_id));

            let orb_price = *orbs_in_game.rare.at(index).current_price;

            let action = GameAction::BuyOrb(orb_price);

            let mut random = RandomTrait::new();
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let (new_common, new_rare, new_cosmic) = update_rare_orbs(
                orbs_in_game.common, orbs_in_game.rare, orbs_in_game.cosmic, index,
            );

            game.state = new_game_state;
            game.data = new_game_data;
            orbs_in_game.common = new_common;
            orbs_in_game.rare = new_rare;
            orbs_in_game.cosmic = new_cosmic;

            world.write_model(@game);
            world.write_model(@orbs_in_game);
        }

        fn buy_cosmic(ref self: ContractState, gamepack_id: u32, index: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Buy cosmic orb
            let gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((gamepack_id, gamepack.data.current_game_id));

            let orb_price = *orbs_in_game.cosmic.at(index).current_price;

            let action = GameAction::BuyOrb(orb_price);

            let mut random = RandomTrait::new();
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let (new_common, new_rare, new_cosmic) = update_cosmic_orbs(
                orbs_in_game.common, orbs_in_game.rare, orbs_in_game.cosmic, index,
            );

            game.state = new_game_state;
            game.data = new_game_data;
            orbs_in_game.common = new_common;
            orbs_in_game.rare = new_rare;
            orbs_in_game.cosmic = new_cosmic;

            world.write_model(@game);
            world.write_model(@orbs_in_game);
        }

        fn next_level(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Next level
            let gamepack: GamePack = world.read_model(gamepack_id);
            let mut game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));
            let orbs_in_game: OrbsInGame = world
                .read_model((gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::GoToNextLevel;

            let mut random = RandomTrait::new();
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, action, ref random) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let orb_arrays = array![
                orbs_in_game.non_buyable, orbs_in_game.common, orbs_in_game.rare,
                orbs_in_game.cosmic,
            ];
            let pullable_orbs = orbs_to_effects(orb_arrays);

            game.state = new_game_state;
            game.data = new_game_data;
            game.data.pullable_orbs = pullable_orbs;

            world.write_model(@game);
        }

        fn next_game(ref self: ContractState, gamepack_id: u32) {
            // [Setup] World
            let mut world = self.world_default();

            // [Check] Caller is the token owner
            self.assert_token_owner(ref world, gamepack_id);

            // [Effect] Next level
            let mut gamepack: GamePack = world.read_model(gamepack_id);
            let current_game: Game = world.read_model((gamepack_id, gamepack.data.current_game_id));

            // Verify current game is in GameOver state
            assert!(
                current_game.state == GameState::GameOver, "Current game must be in GameOver state",
            );

            let action = GamePackAction::NextGame;

            let (new_gamepack_state, new_gamepack_data) =
                match update_gamepack(gamepack.state, gamepack.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            gamepack.state = new_gamepack_state;
            gamepack.data = new_gamepack_data;

            // If gamepack completed, save and exit
            if new_gamepack_state == GamePackState::Completed {
                world.write_model(@gamepack);
                panic!("GamePack completed - maximum games reached");
            }

            // Create new game with incremented game_id
            let mut new_game = Game {
                gamepack_id: gamepack.gamepack_id,
                game_id: new_gamepack_data.current_game_id,
                state: GameState::New,
                data: new_game_data(),
            };
            new_game.data.temp_moonrocks = gamepack.data.accumulated_moonrocks;

            world.write_model(@gamepack);
            world.write_model(@new_game);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(@NAMESPACE())
        }

        fn assert_token_owner(self: @ContractState, ref world: WorldStorage, gamepack_id: u32) {
            let config: Config = world.read_model(CONFIG_ID);
            let collection = IERC721Dispatcher { contract_address: config.collection };
            let owner = collection.owner_of(gamepack_id.into());
            assert(owner == get_caller_address(), 'Caller is not the token owner');
        }
    }
}
