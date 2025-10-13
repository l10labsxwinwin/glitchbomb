#[starknet::interface]
pub trait PlayerActionsV2<T> {
    fn claim_free_usdc(ref self: T);
    fn buy_gamepack(ref self: T);
    fn open_gamepack(ref self: T, gamepack_id: u32);
    fn start_game(ref self: T, gamepack_id: u32);
    fn cash_out(ref self: T, gamepack_id: u32, game_id: u32);
    fn pull_orb(ref self: T, gamepack_id: u32, game_id: u32);
    fn enter_shop(ref self: T, gamepack_id: u32, game_id: u32);
    fn confirm_five_or_die(ref self: T, gamepack_id: u32, game_id: u32, confirmed: bool);
    fn buy_orb(ref self: T, gamepack_id: u32, game_id: u32, orb_id: u32);
    fn go_to_next_level(ref self: T, gamepack_id: u32, game_id: u32);
}

#[dojo::contract]
pub mod gb_contract_v2 {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use super::PlayerActionsV2;
    use starknet::get_caller_address;
    use dojo_starter::glitchbombv2::models::{Player, GamePack, Game};
    use dojo_starter::glitchbombv2::actions::{PlayerAction, GamePackAction};
    use dojo_starter::glitchbombv2::handlers::{update_player, update_gamepack};
    use dojo_starter::glitchbombv2::states::{GameState, GamePackState};
    use dojo_starter::glitchbombv2::data::{new_gamepack_data, new_game_data};

    #[abi(embed_v0)]
    impl PlayerActionsV2Impl of PlayerActionsV2<ContractState> {
        fn claim_free_usdc(ref self: ContractState) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut player: Player = world.read_model(player_id);

            let action = PlayerAction::ClaimFreeUsdc;

            let (new_player_state, new_data) = match update_player(player.state, player.data, action) {
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

            let (new_player_state, new_data) = match update_player(player.state, player.data, action) {
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

        fn open_gamepack(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let mut gamepack: GamePack = world.read_model((player_id, gamepack_id));

            let action = GamePackAction::OpenPack;

            let (new_gamepack_state, new_gamepack_data) = match update_gamepack(gamepack.state, gamepack.data, action) {
                Result::Ok(result) => result,
                Result::Err(err) => panic!("{:?}", err),
            };

            gamepack.state = new_gamepack_state;
            gamepack.data = new_gamepack_data;

            let new_game = Game {
                player_id,
                gamepack_id: gamepack.gamepack_id,
                game_id: 1,
                state: GameState::New,
                data: new_game_data(),
            };

            world.write_model(@gamepack);
            world.write_model(@new_game);
        }

        fn start_game(ref self: ContractState, gamepack_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, 1_u32));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn cash_out(ref self: ContractState, gamepack_id: u32, game_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, game_id));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn pull_orb(ref self: ContractState, gamepack_id: u32, game_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, game_id));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn enter_shop(ref self: ContractState, gamepack_id: u32, game_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, game_id));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn confirm_five_or_die(ref self: ContractState, gamepack_id: u32, game_id: u32, confirmed: bool) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, game_id));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn buy_orb(ref self: ContractState, gamepack_id: u32, game_id: u32, orb_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, game_id));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }

        fn go_to_next_level(ref self: ContractState, gamepack_id: u32, game_id: u32) {
            let mut world = self.world_default();
            let player_id = get_caller_address();

            let player: Player = world.read_model(player_id);
            let gamepack: GamePack = world.read_model((player_id, gamepack_id));
            let game: Game = world.read_model((player_id, gamepack_id, game_id));

            world.write_model(@player);
            world.write_model(@gamepack);
            world.write_model(@game);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(@"glitchbomb")
        }
    }
}
