#[starknet::interface]
pub trait PlayerActionsV2<T> {
    fn create_gamepack(ref self: T);
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

#[dojo::contract]
pub mod gb_contract_v2 {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use starknet::get_caller_address;
    use crate::glitchbombv2::game::{
        Game, GameAction, GameState, GameTrait, OrbsInGame, OrbsInGameTrait, new_game_data,
        orbs_to_effects, update_game,
    };
    use crate::glitchbombv2::gamepack::{
        GamePack, GamePackAction, GamePackState, GamePackTrait, new_gamepack_data, update_gamepack,
    };
    use crate::glitchbombv2::orbs::{update_common_orbs, update_cosmic_orbs, update_rare_orbs};
    use crate::glitchbombv2::player::Player;
    use crate::glitchbombv2::shared::shuffle;
    use super::PlayerActionsV2;

    #[abi(embed_v0)]
    impl PlayerActionsV2Impl of PlayerActionsV2<ContractState> {
        fn create_gamepack(ref self: ContractState) {
            let mut world = self.world_default();
            let player_id = get_caller_address();
            let mut player: Player = world.read_model(player_id);

            let new_gamepack = GamePackTrait::create_for_player(ref player, player_id);

            world.write_model(@player);
            world.write_model(@new_gamepack);
        }

        // NOTE: opening a gamepack starts the first game at game_id = 1, we need to increment this
        // when game ends so player can "start_game" to play the next game.
        // we need to also set the next game state to New instead of Empty, need to think about how
        // we handle next game.
        fn open_gamepack(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();
            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));

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
            let mut world = self.world_default();
            let player_id = get_caller_address();
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let game_action = GameAction::StartGame;
            let (new_game_state, mut new_game_data) =
                match update_game(game.state, game.data, game_action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let orbs_in_game = OrbsInGameTrait::create_for_game(
                player_id, gamepack_id, gamepack.data.current_game_id,
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
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::PullOrb;

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
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
        }


        fn cash_out(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::CashOut;

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
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
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::EnterShop;

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            game.state = new_game_state;
            game.data = new_game_data;

            orbs_in_game.common = shuffle(orbs_in_game.common);
            orbs_in_game.rare = shuffle(orbs_in_game.rare);
            orbs_in_game.cosmic = shuffle(orbs_in_game.cosmic);

            world.write_model(@game);
            world.write_model(@orbs_in_game);
        }

        fn buy_common(ref self: ContractState, gamepack_id: u32, index: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let orb_price = *orbs_in_game.common.at(index).current_price;

            let action = GameAction::BuyOrb(orb_price);

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
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
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let orb_price = *orbs_in_game.rare.at(index).current_price;

            let action = GameAction::BuyOrb(orb_price);

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
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
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let orb_price = *orbs_in_game.cosmic.at(index).current_price;

            let action = GameAction::BuyOrb(orb_price);

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
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
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));
            let orbs_in_game: OrbsInGame = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::GoToNextLevel;

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
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
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let current_game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

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
                player_id,
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
            self.world(@"glitchbomb")
        }
    }
}
