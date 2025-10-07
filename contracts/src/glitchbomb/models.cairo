use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
struct Player {
	#[key]
	player_id: ContractAddress,

	usdc: u32,
	gamepack_id_tracker: u32,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
struct GamePack {
	#[key]
	player_id: ContractAddress,
	#[key]
	gamepack_id: u32,

	gamepack_state: GamePackState,
	current_game: u32,
	accumulated_moonrocks: u32,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
struct Game {
	#[key]
	player_id: ContractAddress,
	#[key]
	gamepack_id: u32,
	#[key]
	game_id: u32,

	game_state: GameState,
	
    level: u32,
    points: u32,
    milestone: u32,
    hp: u32,
    max_hp: u32,
    multiplier: u32,
    glitch_chips: u32,
    moonrocks_spent: u32,
    moonrocks_earned: u32,
    orbs_for_sale_ids: [u32; 6],
    pullable_orb_effects: Array<OrbEffect>,
    pulled_orbs_effects: Array<OrbEffect>,
    bomb_immunity_turns: u32,
}

#[derive(Drop, Serde, Debug, Introspect, DojoStore)]
#[dojo::model]
struct Orb {
	#[key]
	player_id: ContractAddress,
	#[key]
	gamepack_id: u32,
	#[key]
	game_id: u32,
	#[key]
	orb_id: u32, // range = unique orbs in game (0-20)

    effect: OrbEffect,
    rarity: OrbRarity,
    count: u32,
    is_buyable: bool,
    base_price: u32,
    current_price: u32,
}

#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
enum GamePackState {
	#[default]
	Unopened,
 	InProgress,
 	EndedEarly,
 	Completed,
}

#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
enum GameState {
	#[default]
    New,
    Level,
    LevelComplete,
    FiveOrDiePhase,
    Shop,
    GameOver,
}

#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
enum OrbEffect {
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
enum OrbRarity {
	#[default]
    Common,
    Rare,
    Cosmic,
}
