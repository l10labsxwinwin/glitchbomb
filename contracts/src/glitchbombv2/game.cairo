use starknet::ContractAddress;
use super::shared::UpdateError;

// ============================================================================
// Game Constants
// ============================================================================

const MAX_HP: u32 = 5;

// ============================================================================
// Game State
// ============================================================================

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GameState {
    #[default]
    Empty,
    New,
    Level,
    LevelComplete,
    FiveOrDiePhase,
    Shop,
    GameOver,
}

// ============================================================================
// Game Data
// ============================================================================

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
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

// ============================================================================
// Orb Types
// ============================================================================

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

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct Orb {
    pub effect: OrbEffect,
    pub count: u32,
    pub base_price: u32,
    pub current_price: u32,
}

// ============================================================================
// Game Actions
// ============================================================================

#[derive(Drop, Serde, Debug, Copy)]
pub enum GameAction {
    PullOrb,
    EnterShop,
    ConfirmFiveOrDie: bool,
    BuyOrb: u32,
    GoToNextLevel,
    CashOut,
}

// ============================================================================
// Game Models
// ============================================================================

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
    pub data: GameData,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct OrbsInGame {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,

    pub non_buyable: Array<Orb>,
    pub common: Array<Orb>,
    pub rare: Array<Orb>,
    pub cosmic: Array<Orb>,
}

// ============================================================================
// Game Update Handler
// ============================================================================

pub fn update_game(
    state: GameState,
    data: GameData,
    action: GameAction
) -> Result<(GameState, GameData), UpdateError> {
    match (state, action) {
        (GameState::New, GameAction::PullOrb) => Ok((GameState::Level, data)),
        (GameState::Level, GameAction::PullOrb) => Ok((GameState::LevelComplete, data)),
        (GameState::Level, GameAction::CashOut) => Ok((GameState::GameOver, data)),
        (GameState::LevelComplete, GameAction::EnterShop) => Ok((GameState::Shop, data)),
        (GameState::LevelComplete, GameAction::CashOut) => Ok((GameState::GameOver, data)),
        (GameState::FiveOrDiePhase, GameAction::ConfirmFiveOrDie(confirmed)) => {
            if confirmed {
                Ok((GameState::Level, data))
            } else {
                Ok((GameState::GameOver, data))
            }
        },
        (GameState::Shop, GameAction::BuyOrb(_)) => Ok((state, data)),
        (GameState::Shop, GameAction::GoToNextLevel) => Ok((GameState::Level, data)),
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
