use starknet::ContractAddress;
use super::states::{PlayerState, GamePackState, GameState};

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: ContractAddress,

    pub state: PlayerState,
    pub usdc: u32,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct GamePack {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,

    pub state: GamePackState,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,

    pub state: GameState,
}
