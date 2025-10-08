
#[starknet::interface]
pub trait PlayerActions<T> {
    fn claim_free_usdc(ref self: T);
    fn buy_gamepack(ref self: T);
    fn start_game(ref self: T, gamepack_id: u32);
}

#[dojo::contract]
pub mod gb_contract {
    use crate::glitchbomb::models::{ Player, GamePack, GamePackState, Game, GameState };
    use crate::glitchbomb::internal_functions::{GamePackTrait, GameTrait};
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use super::{PlayerActions};
    use starknet::{ContractAddress, get_caller_address};

	#[abi(embed_v0)]
	impl PlayerActionsImpl of PlayerActions<ContractState> {
	    fn claim_free_usdc(ref self: ContractState) {
	        let mut world = self.world_default();
            let p_addr = get_caller_address();
            let mut gb_player: Player = world.read_model(p_addr);

            assert(gb_player.usdc == 0, 'already claimed free usdc');
            gb_player.usdc = 100;
            world.write_model(@gb_player);
	    }

	    fn buy_gamepack(ref self: ContractState) {
	        let mut world = self.world_default();
	        let p_addr = get_caller_address();
	        let mut gb_player: Player = world.read_model(p_addr);

	        assert(gb_player.usdc >= GamePackTrait::PRICE, 'insufficient funds');

	        let gamepack_id = gb_player.gamepack_id_tracker;

	        let new_gamepack = GamePack {
	            player_id: p_addr,
	            gamepack_id,
	            gamepack_state: GamePackState::Unopened,
	            current_game_id: 0,
	            accumulated_moonrocks: 0,
	        };

	        gb_player.usdc -= GamePackTrait::PRICE;
	        gb_player.gamepack_id_tracker += 1;

	        world.write_model(@gb_player);
	        world.write_model(@new_gamepack);
	    }

	    fn start_game(ref self: ContractState, gamepack_id: u32) {
	        let mut world = self.world_default();
	        let p_addr = get_caller_address();
	        let mut gamepack: GamePack = world.read_model((p_addr, gamepack_id));

	        let is_valid_gamepack = match @gamepack.gamepack_state {
	            GamePackState::Unopened | GamePackState::InProgress => true,
	            _ => false,
	        };
	        assert(is_valid_gamepack, 'gamepack is already played');

	        let game_id = gamepack.current_game_id;
	        let mut game: Game = world.read_model((p_addr, gamepack_id, game_id));
	        assert(game.game_state == GameState::New, 'already started a game');

	        gamepack.gamepack_state = GamePackState::InProgress;
	        game = GameTrait::new(p_addr, gamepack_id, game_id);

	        world.write_model(@gamepack);
	        world.write_model(@game);
	    }
	}

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"glitchbomb")
        }
    }
}
