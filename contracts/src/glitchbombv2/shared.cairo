use super::player::PlayerState;
use super::gamepack::GamePackState;
use super::game::GameState;

// ============================================================================
// Shared Update Error
// ============================================================================

#[derive(Drop, Debug)]
pub enum UpdateError {
    InvalidStateTransition,
    InvalidData,
}

// ============================================================================
// Legacy Cross-Cutting Validation
// ============================================================================

#[derive(Drop, Serde, Debug, Copy)]
pub enum Action {
    ClaimFreeUsdc,
    BuyGamepack,
    StartGame,
    CashOut,
    PullOrb,
    EnterShop,
    ConfirmFiveOrDie: bool,
    BuyOrb: u32,
    GoToNextLevel,
}

#[derive(Drop, Debug)]
pub enum ActionError {
    InvalidPlayerState,
    PlayerIsBroke,
    PlayerIsAlreadyStacked,
    InvalidGamePackState,
    GamePackDNE,
    GameDNE,
    InvalidGameState,
    InvalidActionInNewGame,
    InvalidActionInLevel,
    InvalidActionInLevelComplete,
    InvalidActionInFiveOrDiePhase,
    InvalidActionInShop,
    GameOver,
    UnhandledError,
}

pub fn validate_action(
    player_state: PlayerState,
    gamepack_state: GamePackState,
    game_state: GameState,
    action: Action
) -> Result<(), ActionError> {
    match (player_state, gamepack_state, game_state, action) {
        (PlayerState::Broke, _, _, Action::ClaimFreeUsdc) => Ok(()),
        (PlayerState::Stacked, _, _, Action::BuyGamepack) => Ok(()),
        (_, GamePackState::Unopened, GameState::New, Action::StartGame) => Ok(()),
        (_, GamePackState::InProgress, GameState::New, Action::StartGame) => Ok(()),
        (_, GamePackState::InProgress, GameState::Level, Action::PullOrb) => Ok(()),
        (_, GamePackState::InProgress, GameState::Level, Action::CashOut) => Ok(()),
        (_, GamePackState::InProgress, GameState::LevelComplete, Action::EnterShop) => Ok(()),
        (_, GamePackState::InProgress, GameState::LevelComplete, Action::CashOut) => Ok(()),
        (_, GamePackState::InProgress, GameState::FiveOrDiePhase, Action::ConfirmFiveOrDie(_)) => Ok(()),
        (_, GamePackState::InProgress, GameState::Shop, Action::BuyOrb(_)) => Ok(()),
        (_, GamePackState::InProgress, GameState::Shop, Action::GoToNextLevel) => Ok(()),

        (PlayerState::Broke, _, _, Action::BuyGamepack) => Err(ActionError::PlayerIsBroke),
        (PlayerState::Stacked, _, _, Action::ClaimFreeUsdc) => Err(ActionError::PlayerIsAlreadyStacked),
        (_, GamePackState::Empty, _, _) => Err(ActionError::GamePackDNE),
        (_, _, GameState::Empty, _) => Err(ActionError::GameDNE),
        (_, GamePackState::Unopened, _, _) => Err(ActionError::InvalidGamePackState),
        (_, GamePackState::EndedEarly, _, _) => Err(ActionError::InvalidGamePackState),
        (_, GamePackState::Completed, _, _) => Err(ActionError::InvalidGamePackState),
        (_, GamePackState::InProgress, GameState::New, _) => Err(ActionError::InvalidActionInNewGame),
        (_, GamePackState::InProgress, GameState::Level, _) => Err(ActionError::InvalidActionInLevel),
        (_, GamePackState::InProgress, GameState::LevelComplete, _) => Err(ActionError::InvalidActionInLevelComplete),
        (_, GamePackState::InProgress, GameState::FiveOrDiePhase, _) => Err(ActionError::InvalidActionInFiveOrDiePhase),
        (_, GamePackState::InProgress, GameState::Shop, _) => Err(ActionError::InvalidActionInShop),
        (_, GamePackState::InProgress, GameState::GameOver, _) => Err(ActionError::GameOver),
    }
}
