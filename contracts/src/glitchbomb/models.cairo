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
    // all_orbs: [Orb; 21],
    // sale_orbs_indices: Vec<usize>,
    // pullable_orb_effects: Vec<OrbEffect>,
    // pulled_orbs_effects: Vec<OrbEffect>,
    bomb_immunity_turns: u32,
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
enum Orb {
	#[default]
	DummyOrb,
}
