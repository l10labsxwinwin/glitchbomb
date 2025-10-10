#[starknet::interface]
pub trait PlayerActions<T> {
    fn claim_free_usdc(ref self: T);
    fn buy_gamepack(ref self: T);
    fn start_game(ref self: T, gamepack_id: u32);
    fn pull_orb(ref self: T, gamepack_id: u32);
    fn confirm_five_or_die(ref self: T, gamepack_id: u32, confirmed: bool);
}

#[dojo::contract]
pub mod gb_contract {
    use crate::glitchbomb::models::{ Player, GamePack, GamePackState, Game, GameState };
    use crate::glitchbomb::internal_functions::{GamePackTrait, GameTrait, AllOrbTrait};
    use crate::glitchbomb::actions::Action;
    use dojo::model::ModelStorage;
    use super::{PlayerActions};
    use starknet::get_caller_address;

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
	        let new_gamepack = GamePackTrait::new(p_addr, gamepack_id);

	        gb_player.usdc -= GamePackTrait::PRICE;
	        gb_player.gamepack_id_tracker += 1;

	        world.write_model(@gb_player);
	        world.write_model(@new_gamepack);
	    }

	    fn start_game(ref self: ContractState, gamepack_id: u32) {
	        let mut world = self.world_default();
	        let p_addr = get_caller_address();
	        let mut gamepack: GamePack = world.read_model((p_addr, gamepack_id));

	        let game_id = gamepack.current_game_id;
	        let mut game: Game = world.read_model((p_addr, gamepack_id, game_id));

	        let is_valid_gamepack = match @gamepack.gamepack_state {
	            GamePackState::Unopened | GamePackState::InProgress => true,
	            _ => false,
	        };
	        let is_game_state_new = game.game_state == GameState::New;
	        let is_game_level_zero = game.level == 0;

	        assert(
	            is_valid_gamepack && is_game_state_new && is_game_level_zero,
	            'invalid start game conditions'
	        );

	        gamepack.gamepack_state = GamePackState::InProgress;
	        game = GameTrait::new(p_addr, gamepack_id, game_id);

	        let all_orbs = AllOrbTrait::all_orbs(p_addr, gamepack_id, game_id);
	        let all_orbs_span = all_orbs.span();
	        let mut orb_idx: u32 = 0;
	        while orb_idx < all_orbs_span.len() {
	            let orb = all_orbs_span.at(orb_idx);
	            let mut count_idx: u32 = 0;
	            while count_idx < *orb.count {
	                game.pullable_orb_effects.append(*orb.effect);
	                count_idx += 1;
	            };
	            orb_idx += 1;

	            world.write_model(orb);
	        };

	        world.write_model(@gamepack);
	        world.write_model(@game);
	    }

	    fn pull_orb(ref self: ContractState, gamepack_id: u32) {
	        let mut world = self.world_default();
	        let p_addr = get_caller_address();
	        let gamepack: GamePack = world.read_model((p_addr, gamepack_id));

	        let game_id = gamepack.current_game_id;
	        let mut game: Game = world.read_model((p_addr, gamepack_id, game_id));

	        let result = game.apply_action(Action::PullOrb);

	        match result {
	            Result::Ok(_) => {
	                world.write_model(@game);
	            },
	            Result::Err(err) => {
	                panic!("pull orb failed: {:?}", err);
	            }
	        }
	    }

	    fn confirm_five_or_die(ref self: ContractState, gamepack_id: u32, confirmed: bool) {
	        let mut world = self.world_default();
	        let p_addr = get_caller_address();
	        let gamepack: GamePack = world.read_model((p_addr, gamepack_id));

	        let game_id = gamepack.current_game_id;
	        let mut game: Game = world.read_model((p_addr, gamepack_id, game_id));

	        let result = game.apply_action(Action::ConfirmFiveOrDie(confirmed));

	        match result {
	            Result::Ok(five_or_die_data_option) => {
	                world.write_model(@game);

	                // If FiveOrDieData was returned, write it to the store
	                match five_or_die_data_option {
	                    Option::Some(five_or_die_data) => {
	                        world.write_model(@five_or_die_data);
	                    },
	                    Option::None => {}
	                }
	            },
	            Result::Err(err) => {
	                panic!("confirm five or die failed: {:?}", err);
	            }
	        }
	    }
	}

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"glitchbomb")
        }
    }
}
