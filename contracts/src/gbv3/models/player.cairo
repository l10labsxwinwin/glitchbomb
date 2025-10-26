use starknet::ContractAddress;
use super::enums::PlayerState;

#[derive(Drop, Serde, Copy, Introspect, DojoStore)]
pub struct PlayerData {
    pub usdc: u32,
    pub gamepacks_bought: u32,
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player: ContractAddress,
    pub state: PlayerState,
    pub data: PlayerData,
}

pub fn new_player_data() -> PlayerData {
    PlayerData { usdc: 0, gamepacks_bought: 0 }
}
