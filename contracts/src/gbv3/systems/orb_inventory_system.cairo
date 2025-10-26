use starknet::ContractAddress;
use dojo::model::{ModelStorage};
use dojo::world::{WorldStorage};
use crate::gbv3::models::game::OrbsInGame;
use crate::gbv3::models::orb::{Orb, get_non_buyable_orbs, get_common_orbs, get_rare_orbs, get_cosmic_orbs};
use crate::gbv3::models::enums::OrbEffect;
use crate::gbv3::types::shuffle;

#[generate_trait]
pub impl OrbInventorySystemImpl of OrbInventorySystemTrait {
    fn initialize_orb_pool(
        ref world: WorldStorage, player: ContractAddress, gamepack_id: u32, game_id: u32,
    ) -> OrbsInGame {
        let orbs_in_game = OrbsInGame {
            player,
            gamepack_id,
            game_id,
            non_buyable: get_non_buyable_orbs(),
            common: get_common_orbs(),
            rare: get_rare_orbs(),
            cosmic: get_cosmic_orbs(),
        };
        world.write_model(@orbs_in_game);
        orbs_in_game
    }

    fn orbs_to_effects(orb_arrays: Array<Array<Orb>>) -> Array<OrbEffect> {
        let mut effects = ArrayTrait::new();

        for orb_array in orb_arrays {
            for orb in orb_array {
                let mut i: u32 = 0;
                while i < orb.count {
                    effects.append(orb.effect);
                    i += 1;
                }
            }
        }

        effects
    }

    fn shuffle_orbs(orbs: Array<OrbEffect>) -> Array<OrbEffect> {
        shuffle(orbs)
    }

    fn save_orbs_in_game(ref world: WorldStorage, orbs_in_game: @OrbsInGame) {
        world.write_model(orbs_in_game);
    }
}
