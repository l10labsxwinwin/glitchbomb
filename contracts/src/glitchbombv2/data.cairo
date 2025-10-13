const MAX_HP: u32 = 5;

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct PlayerData {
    pub usdc: u32,
    pub gamepacks_bought: u32,
}

pub fn new_player_data() -> PlayerData {
    PlayerData {
        usdc: 0,
        gamepacks_bought: 0,
    }
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct GamePackData {
    pub current_game_id: u32,
    pub accumulated_moonrocks: u32,
}

pub fn new_gamepack_data() -> GamePackData {
    GamePackData {
        current_game_id: 1,
        accumulated_moonrocks: 100,
    }
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct GameData {
    pub level: u32,
    pub pull_number: u32,
    pub points: u32,
    pub milestone: u32,
    pub hp: u32,
    // pub max_hp: u32, should be a global const
    pub multiplier: u32,
    pub glitch_chips: u32,
    pub moonrocks_spent: u32,
    pub moonrocks_earned: u32,
    pub bomb_immunity_turns: u32,
    pub bombs_pulled_in_level: u32,
}

pub fn new_game_data() -> GameData {
    GameData {
        level: 1,
        pull_number: 0,
        points: 0,
        milestone: 0,
        hp: MAX_HP,
        multiplier: 1,
        glitch_chips: 0,
        moonrocks_spent: 0,
        moonrocks_earned: 0,
        bomb_immunity_turns: 0,
        bombs_pulled_in_level: 0,
    }
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct Orb {
    pub effect: OrbEffect,
    pub count: u32,
    pub base_price: u32,
    pub current_price: u32,
}

pub struct OrbsInGame {
    non_buyable: Array<Orb>,
    common: Array<Orb>,
    rare: Array<Orb>,
    cosmic: Array<Orb>,
}

#[derive(Copy, Drop, Serde, Debug, Introspect, DojoStore, PartialEq, Default)]
pub enum OrbEffect {
	#[default]
	Empty,
    PointRewind,
    FiveOrDie,
    Point: u32,
    PointPerOrbRemaining: u32,
    PointPerBombPulled: u32,
    GlitchChips: u32,
    Moonrocks: u32,
    Health: u32,
    Bomb: u32,
    Multiplier: u32,
    BombImmunity: u32,
}
