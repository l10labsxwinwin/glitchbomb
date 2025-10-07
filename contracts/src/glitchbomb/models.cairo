use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
	#[key]
	pub player_id: ContractAddress,

	pub usdc: u32,
	pub gamepack_id_tracker: u32,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct GamePack {
	#[key]
	pub player_id: ContractAddress,
	#[key]
	pub gamepack_id: u32,

	pub gamepack_state: GamePackState,
	pub current_game: u32,
	pub accumulated_moonrocks: u32,
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

	pub game_state: GameState,
	
    pub level: u32,
    pub points: u32,
    pub milestone: u32,
    pub hp: u32,
    pub max_hp: u32,
    pub multiplier: u32,
    pub glitch_chips: u32,
    pub moonrocks_spent: u32,
    pub moonrocks_earned: u32,
    pub orbs_for_sale_ids: [u32; 6],
    pub pullable_orb_effects: Array<OrbEffect>,
    pub pulled_orbs_effects: Array<OrbEffect>,
    pub bomb_immunity_turns: u32,
    pub bombs_pulled_in_level: u32,
}

#[derive(Drop, Serde, Debug, Introspect, DojoStore)]
#[dojo::model]
pub struct Orb {
	#[key]
	pub player_id: ContractAddress,
	#[key]
	pub gamepack_id: u32,
	#[key]
	pub game_id: u32,
	#[key]
	pub orb_id: u32, // range = unique orbs in game (0-20)

    pub effect: OrbEffect,
    pub rarity: OrbRarity,
    pub count: u32,
    pub is_buyable: bool,
    pub base_price: u32,
    pub current_price: u32,
}

#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
pub enum GamePackState {
	#[default]
	Unopened,
 	InProgress,
 	EndedEarly,
 	Completed,
}

#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
pub enum GameState {
	#[default]
    New,
    Level,
    LevelComplete,
    FiveOrDiePhase,
    Shop,
    GameOver,
}

#[derive(Copy, Drop, Serde, Debug, Default, Introspect, DojoStore, PartialEq)]
pub enum OrbEffect {
	#[default]
	Empty,
    Point: u32,
    PointPerOrbRemaining: u32,
    PointPerBombPulled: u32,
    GlitchChips: u32,
    Moonrocks: u32,
    Health: u32,
    Bomb: u32,
    Multiplier: u32,
    BombImmunity: u32,
    PointRewind,
    FiveOrDie,
}

#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
pub enum OrbRarity {
	#[default]
    Common,
    Rare,
    Cosmic,
}
