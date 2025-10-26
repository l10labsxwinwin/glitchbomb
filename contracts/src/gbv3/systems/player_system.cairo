use starknet::ContractAddress;
use dojo::model::{ModelStorage};
use dojo::world::{WorldStorage};
use crate::gbv3::models::player::{Player, PlayerData, new_player_data};
use crate::gbv3::models::enums::PlayerState;
use crate::gbv3::types::GameError;

#[generate_trait]
pub impl PlayerSystemImpl of PlayerSystemTrait {
    fn get_or_create_player(ref world: WorldStorage, player_address: ContractAddress) -> Player {
        let player: Player = world.read_model(player_address);
        
        if player.data.usdc == 0 && player.data.gamepacks_bought == 0 {
            Player {
                player: player_address,
                state: PlayerState::Broke,
                data: new_player_data(),
            }
        } else {
            player
        }
    }

    fn save_player(ref world: WorldStorage, player: @Player) {
        world.write_model(player);
    }
}
