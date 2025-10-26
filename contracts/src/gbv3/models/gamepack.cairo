use starknet::ContractAddress;
use super::enums::GamePackState;
use crate::gbv3::constants::{INITIAL_GAME_ID, INITIAL_MOONROCKS};

#[derive(Drop, Serde, Copy, Introspect, DojoStore)]
pub struct GamePackData {
    pub current_game_id: u32,
    pub accumulated_moonrocks: u32,
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct GamePack {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    pub state: GamePackState,
    pub data: GamePackData,
}

pub fn new_gamepack_data() -> GamePackData {
    GamePackData { current_game_id: INITIAL_GAME_ID, accumulated_moonrocks: INITIAL_MOONROCKS }
}
