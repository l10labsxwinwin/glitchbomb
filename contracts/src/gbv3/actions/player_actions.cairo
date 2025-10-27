use starknet::ContractAddress;

#[starknet::interface]
pub trait IPlayerActions<T> {
    fn claim_free_usdc(ref self: T);
    fn buy_gamepack(ref self: T);
    fn open_gamepack(ref self: T, gamepack_id: u32);
    fn start_game(ref self: T, gamepack_id: u32);
    fn pull_orb(ref self: T, gamepack_id: u32);
    fn confirm_five_or_die(ref self: T, gamepack_id: u32, confirmed: bool);
    fn cash_out(ref self: T, gamepack_id: u32);
    fn enter_shop(ref self: T, gamepack_id: u32);
    fn buy_orb(ref self: T, gamepack_id: u32, orb_id: u32);
    fn next_level(ref self: T, gamepack_id: u32);
    fn next_game(ref self: T, gamepack_id: u32);
}

#[dojo::contract]
pub mod player_actions {
    use super::IPlayerActions;
    use starknet::get_caller_address;
    use dojo::model::{ModelStorage};
    use dojo::world::{WorldStorage};

    use crate::gbv3::models::player::Player;
    use crate::gbv3::models::gamepack::GamePack;
    use crate::gbv3::models::game::{Game, OrbsInGame};
    use crate::gbv3::models::enums::GameState;
    use crate::gbv3::constants::{GAMEPACK_PRICE, level_cost_in_moonrocks, MAX_GAMES_PER_PACK};

    use crate::gbv3::systems::player_system::PlayerSystemTrait;
    use crate::gbv3::systems::currency_system::CurrencySystemTrait;
    use crate::gbv3::systems::gamepack_system::GamePackSystemTrait;
    use crate::gbv3::systems::game_system::GameSystemTrait;
    use crate::gbv3::systems::orb_inventory_system::OrbInventorySystemTrait;
    use crate::gbv3::systems::pull_system::PullSystemTrait;
    use crate::gbv3::systems::points_system::PointsSystemTrait;
    use crate::gbv3::systems::shop_system::ShopSystemTrait;

    #[abi(embed_v0)]
    impl PlayerActionsImpl of IPlayerActions<ContractState> {
        fn claim_free_usdc(ref self: ContractState) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut player = PlayerSystemTrait::get_or_create_player(ref world, player_address);

            match CurrencySystemTrait::claim_free_usdc(ref player) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            PlayerSystemTrait::save_player(ref world, @player);
        }

        fn buy_gamepack(ref self: ContractState) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut player = PlayerSystemTrait::get_or_create_player(ref world, player_address);

            match CurrencySystemTrait::spend_usdc(ref player, GAMEPACK_PRICE) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            player.data.gamepacks_bought += 1;

            let _gamepack = GamePackSystemTrait::create_gamepack(
                ref world, player_address, player.data.gamepacks_bought,
            );

            PlayerSystemTrait::save_player(ref world, @player);
        }

        fn open_gamepack(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_address, gamepack_id));

            match GamePackSystemTrait::open_gamepack(ref gamepack) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            let _game = GameSystemTrait::create_game(
                ref world,
                player_address,
                gamepack_id,
                1,
                gamepack.data.accumulated_moonrocks,
            );

            GamePackSystemTrait::save_gamepack(ref world, @gamepack);
        }

        fn start_game(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            match GameSystemTrait::start_game(ref game) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            let orbs_in_game = OrbInventorySystemTrait::initialize_orb_pool(
                ref world, player_address, gamepack_id, gamepack.data.current_game_id,
            );

            let orb_arrays = array![
                orbs_in_game.non_buyable,
                orbs_in_game.common,
                orbs_in_game.rare,
                orbs_in_game.cosmic,
            ];
            let pullable_orbs = OrbInventorySystemTrait::orbs_to_effects(orb_arrays);
            game.data.pullable_orbs = pullable_orbs;

            GameSystemTrait::save_game(ref world, @game);
        }

        fn pull_orb(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            let (pulled_orb, new_state) = match PullSystemTrait::pull_orb(ref game.data) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            game.state = new_state;

            if new_state == GameState::GameOver {
                game.data.temp_moonrocks += game.data.moonrocks_earned;
                game.data.temp_moonrocks -= game.data.moonrocks_spent;
                gamepack.data.accumulated_moonrocks = game.data.temp_moonrocks;
                GamePackSystemTrait::save_gamepack(ref world, @gamepack);
            }

            GameSystemTrait::save_game(ref world, @game);
        }

        fn confirm_five_or_die(ref self: ContractState, gamepack_id: u32, confirmed: bool) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            if confirmed {
                let new_state = match PullSystemTrait::execute_five_or_die(ref game.data) {
                    Result::Ok(state) => state,
                    Result::Err(err) => panic!("{:?}", err),
                };
                game.state = new_state;

                if new_state == GameState::GameOver {
                    game.data.temp_moonrocks += game.data.moonrocks_earned;
                    game.data.temp_moonrocks -= game.data.moonrocks_spent;
                    gamepack.data.accumulated_moonrocks = game.data.temp_moonrocks;
                    GamePackSystemTrait::save_gamepack(ref world, @gamepack);
                }
            } else {
                game.state = GameState::Level;
            }

            GameSystemTrait::save_game(ref world, @game);
        }

        fn cash_out(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            match PointsSystemTrait::cash_out_points(ref game.data) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            gamepack.data.accumulated_moonrocks = game.data.temp_moonrocks;
            game.state = GameState::GameOver;

            GamePackSystemTrait::save_gamepack(ref world, @gamepack);
            GameSystemTrait::save_game(ref world, @game);
        }

        fn enter_shop(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            let shop_cost = level_cost_in_moonrocks(game.data.level + 1);
            match CurrencySystemTrait::spend_moonrocks(ref game.data, shop_cost) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            PointsSystemTrait::convert_points_to_glitch_chips(ref game.data);

            match GameSystemTrait::transition_to_shop(ref game) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            ShopSystemTrait::refresh_shop(ref orbs_in_game);

            GameSystemTrait::save_game(ref world, @game);
            OrbInventorySystemTrait::save_orbs_in_game(ref world, @orbs_in_game);
        }

        fn buy_orb(ref self: ContractState, gamepack_id: u32, orb_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            if orb_id > 5 {
                panic!("Invalid orb_id: must be between 0 and 5");
            }

            let gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));
            let mut orbs_in_game: OrbsInGame = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            let orb_price = match ShopSystemTrait::get_orb_price(
                @orbs_in_game.common, @orbs_in_game.rare, @orbs_in_game.cosmic, orb_id,
            ) {
                Result::Ok(price) => price,
                Result::Err(err) => panic!("{:?}", err),
            };

            match CurrencySystemTrait::spend_glitch_chips(ref game.data, orb_price) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            match ShopSystemTrait::purchase_orb(ref orbs_in_game, orb_id) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            GameSystemTrait::save_game(ref world, @game);
            OrbInventorySystemTrait::save_orbs_in_game(ref world, @orbs_in_game);
        }

        fn next_level(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let mut game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));
            let orbs_in_game: OrbsInGame = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            let glitch_chips = game.data.glitch_chips;
            match GameSystemTrait::advance_to_next_level(ref game, glitch_chips) {
                Result::Ok(_) => {},
                Result::Err(err) => panic!("{:?}", err),
            };

            let orb_arrays = array![
                orbs_in_game.non_buyable,
                orbs_in_game.common,
                orbs_in_game.rare,
                orbs_in_game.cosmic,
            ];
            let pullable_orbs = OrbInventorySystemTrait::orbs_to_effects(orb_arrays);
            game.data.pullable_orbs = pullable_orbs;

            GameSystemTrait::save_game(ref world, @game);
        }

        fn next_game(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_address = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_address, gamepack_id));
            let current_game: Game = world
                .read_model((player_address, gamepack_id, gamepack.data.current_game_id));

            if current_game.state != GameState::GameOver {
                panic!("Current game must be in GameOver state");
            }

            let next_game_id = gamepack.data.current_game_id + 1;

            if next_game_id > MAX_GAMES_PER_PACK {
                match GamePackSystemTrait::complete_gamepack(ref gamepack) {
                    Result::Ok(_) => {},
                    Result::Err(err) => panic!("{:?}", err),
                };
                GamePackSystemTrait::save_gamepack(ref world, @gamepack);
                panic!("GamePack completed - maximum games reached");
            }

            gamepack.data.current_game_id = next_game_id;

            let _new_game = GameSystemTrait::create_game(
                ref world, player_address, gamepack_id, next_game_id, gamepack.data.accumulated_moonrocks,
            );

            GamePackSystemTrait::save_gamepack(ref world, @gamepack);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(@"glitchbomb")
        }
    }
}
