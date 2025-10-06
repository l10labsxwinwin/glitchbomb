use starknet::ContractAddress;

// State machine for Gamepack progression
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug, DojoStore, Default)]
pub enum GamepackState {
    #[default]
    NotOwned,   // Player hasn't purchased this gamepack yet
    Active,     // Gamepack is purchased and games can be played
    Completed,  // All 10 games have been played
}

// State machine for individual Game status
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug, DojoStore, Default)]
pub enum GameState {
    #[default]
    Unplayed,  // Game hasn't been played yet
    Played,    // Game has been consumed/played
}

// Main player model tracking currency and progression
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub address: ContractAddress,
    pub moonrocks: u128,              // Currency spent to buy gamepacks
    pub current_gamepack_id: u32,     // Tracks the latest gamepack (0-indexed)
}

// Gamepack model - holds reference to 10 game components
// No arrays: games are tracked via Game components with IDs 0-9
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Gamepack {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub gamepack_id: u32,             // Unique gamepack identifier per player
    pub state: GamepackState,          // State machine: NotOwned -> Active -> Completed
    pub games_played: u8,              // Counter: 0-10
}

// Individual game component - 10 of these per gamepack (IDs 0-9)
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub gamepack_id: u32,              // Which gamepack this game belongs to
    #[key]
    pub game_id: u8,                   // Game slot within gamepack (0-9)
    pub state: GameState,               // State machine: Unplayed -> Played
}

// Type conversion implementations for state machines
impl GamepackStateIntoFelt252 of Into<GamepackState, felt252> {
    fn into(self: GamepackState) -> felt252 {
        match self {
            GamepackState::NotOwned => 0,
            GamepackState::Active => 1,
            GamepackState::Completed => 2,
        }
    }
}

impl GameStateIntoFelt252 of Into<GameState, felt252> {
    fn into(self: GameState) -> felt252 {
        match self {
            GameState::Unplayed => 0,
            GameState::Played => 1,
        }
    }
}
