#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct PlayerData {
    pub usdc: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct GamePackData {
    pub current_game_id: u32,
    pub accumulated_moonrocks: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
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

#[derive(Copy, Drop, Serde, Debug, Default, Introspect, DojoStore, PartialEq)]
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
