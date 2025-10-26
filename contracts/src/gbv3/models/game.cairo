use starknet::ContractAddress;
use super::enums::{GameState, OrbEffect};
use super::orb::Orb;
use crate::gbv3::constants::{MAX_HP, milestones};

#[derive(Drop, Serde, Debug, Clone, Introspect, DojoStore)]
pub struct GameData {
    pub level: u32,
    pub pull_number: u32,
    pub points: u32,
    pub milestone: u32,
    pub hp: u32,
    pub multiplier: u32,
    pub glitch_chips: u32,
    pub moonrocks_spent: u32,
    pub moonrocks_earned: u32,
    pub temp_moonrocks: u32,
    pub bomb_immunity_turns: u32,
    pub bombs_pulled_in_level: u32,
    pub pullable_orbs: Array<OrbEffect>,
    pub consumed_orbs: Array<OrbEffect>,
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,
    pub state: GameState,
    pub data: GameData,
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct OrbsInGame {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,
    pub non_buyable: Array<Orb>,
    pub common: Array<Orb>,
    pub rare: Array<Orb>,
    pub cosmic: Array<Orb>,
}

pub fn new_game_data() -> GameData {
    GameData {
        level: 1,
        pull_number: 0,
        points: 0,
        milestone: milestones(1),
        hp: MAX_HP,
        multiplier: 100,
        glitch_chips: 0,
        temp_moonrocks: 0,
        moonrocks_spent: 0,
        moonrocks_earned: 0,
        bomb_immunity_turns: 0,
        bombs_pulled_in_level: 0,
        pullable_orbs: ArrayTrait::new(),
        consumed_orbs: ArrayTrait::new(),
    }
}
