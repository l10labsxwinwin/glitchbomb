#[starknet::interface]
pub trait PlayerActionsV2<T> {
    fn claim_free_usdc(ref self: T);
    fn buy_gamepack(ref self: T);
    fn open_gamepack(ref self: T, gamepack_id: u32);
    fn start_game(ref self: T, gamepack_id: u32);
    fn pull_orb(ref self: T, gamepack_id: u32);
    fn pull_specific(ref self: T, gamepack_id: u32, orb_index: u32);
    fn confirm_five_or_die(ref self: T, gamepack_id: u32, confirmed: bool);
    fn cash_out(ref self: T, gamepack_id: u32);
    fn enter_shop(ref self: T, gamepack_id: u32);
    fn buy_orb(ref self: T, gamepack_id: u32, orb_id: u32);
    fn next_level(ref self: T, gamepack_id: u32);
    fn next_game(ref self: T, gamepack_id: u32);
}

#[dojo::contract]
pub mod gb_contract_v2 {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use starknet::get_caller_address;
    use crate::glitchbombv2::game::{
        Game, GameAction, GameState, OrbsInGame, get_common_orbs, get_cosmic_orbs,
        get_non_buyable_orbs, get_rare_orbs, new_game_data, orbs_to_effects, update_game,
    };
    use crate::glitchbombv2::gamepack::{
        GamePack, GamePackAction, GamePackState, new_gamepack_data, update_gamepack,
    };
    use crate::glitchbombv2::orbs::{get_orb_price, update_shop_orbs};
    use crate::glitchbombv2::player::{Player, PlayerAction, update_player};
    use crate::glitchbombv2::shared::shuffle;
    use super::PlayerActionsV2;

    #[abi(embed_v0)]
    impl PlayerActionsV2Impl of PlayerActionsV2<ContractState> {
        fn claim_free_usdc(ref self: ContractState) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut player: Player = world.read_model(player_id);

            let action = PlayerAction::ClaimFreeUsdc;

            let (new_player_state, new_data) =
                match update_player(player.state, player.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            player.state = new_player_state;
            player.data = new_data;

            world.write_model(@player);
        }

        fn buy_gamepack(ref self: ContractState) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut player: Player = world.read_model(player_id);

            let action = PlayerAction::BuyGamePack;

            let (new_player_state, new_data) =
                match update_player(player.state, player.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            player.state = new_player_state;
            player.data = new_data;

            let new_gamepack = GamePack {
                player_id,
                gamepack_id: new_data.gamepacks_bought,
                state: GamePackState::Unopened,
                data: new_gamepack_data(),
            };

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

            let mut new_game = Game {
                player_id,
                gamepack_id: gamepack.gamepack_id,
                game_id: 1,
                state: GameState::New,
                data: new_game_data(),
            };
            new_game.data.temp_moonrocks = new_gamepack_data.accumulated_moonrocks;

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
            let (new_game_state, new_game_data) =
                match update_game(game.state, game.data, game_action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let orbs_in_game = OrbsInGame {
                player_id,
                gamepack_id,
                game_id: gamepack.data.current_game_id,
                non_buyable: get_non_buyable_orbs(),
                common: get_common_orbs(),
                rare: get_rare_orbs(),
                cosmic: get_cosmic_orbs(),
            };

            let win_orb_arrays = array![
                orbs_in_game.common.clone(), orbs_in_game.rare.clone(), orbs_in_game.cosmic.clone(),
                orbs_in_game.non_buyable.clone(),
            ];
            let pullable_orbs = orbs_to_effects(win_orb_arrays);

            game.state = new_game_state;
            game.data = new_game_data;
            game.data.pullable_orbs = pullable_orbs;

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

        fn pull_specific(ref self: ContractState, gamepack_id: u32, orb_index: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            assert(orb_index < game.data.pullable_orbs.len(), 'Index out of bounds');

            let selected_orb = *game.data.pullable_orbs.at(orb_index);
            let mut new_pullable_orbs = array![selected_orb];
            let mut i = 0;
            while i < game.data.pullable_orbs.len() {
                if i != orb_index {
                    new_pullable_orbs.append(*game.data.pullable_orbs.at(i));
                }
                i += 1;
            };
            game.data.pullable_orbs = new_pullable_orbs;

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

        fn confirm_five_or_die(ref self: ContractState, gamepack_id: u32, confirmed: bool) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let action = GameAction::ConfirmFiveOrDie(confirmed);

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

        fn buy_orb(ref self: ContractState, gamepack_id: u32, orb_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            // early assert to save compute on incorrect contract call
            assert!(orb_id <= 5, "Invalid orb_id: must be between 0 and 5");

            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let mut game: Game = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_id, gamepack_id, gamepack.data.current_game_id));

            let orb_price = get_orb_price(
                @orbs_in_game.common, @orbs_in_game.rare, @orbs_in_game.cosmic, orb_id,
            );

            let action = GameAction::BuyOrb(orb_price);

            let (new_game_state, new_game_data) = match update_game(game.state, game.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            let (new_common, new_rare, new_cosmic) =
                match update_shop_orbs(
                    orbs_in_game.common, orbs_in_game.rare, orbs_in_game.cosmic, orb_id,
                ) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

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
            assert!(current_game.state == GameState::GameOver, "Current game must be in GameOver state");

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
