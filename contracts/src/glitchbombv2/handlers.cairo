use super::states::{PlayerState, GamePackState, GameState, Action};
use super::data::{PlayerData, GamePackData, GameData};

#[derive(Drop, Debug)]
pub enum UpdateError {
    InvalidStateTransition,
    InvalidData,
}

pub fn update_player(state: PlayerState, data: PlayerData, action: Action) -> Result<(PlayerState, PlayerData), UpdateError> {
    match (state, data.usdc, action) {
        (PlayerState::Broke, 0, Action::ClaimFreeUsdc) => {
            let new_data = PlayerData { usdc: data.usdc + 5 };
            Ok((PlayerState::Stacked, new_data))
        },
        (PlayerState::Stacked, 1, Action::BuyGamepack) => {
            let new_data = PlayerData { usdc: 0 };
            Ok((PlayerState::Broke, new_data))
        },
        (PlayerState::Stacked, _, Action::BuyGamepack) => {
            let new_data = PlayerData { usdc: data.usdc - 1 };
            Ok((PlayerState::Stacked, new_data))
        },
        _ => Err(UpdateError::InvalidStateTransition),
    }
}

pub fn update_gamepack(state: GamePackState, action: Action) -> Result<GamePackState, ()> {
    match (state, action) {
        (GamePackState::Empty, Action::ClaimFreeUsdc) => Ok(state),
        (GamePackState::Empty, Action::BuyGamepack) => Ok(state),
        (GamePackState::Empty, Action::StartGame) => Ok(state),
        (GamePackState::Empty, Action::CashOut) => Ok(state),
        (GamePackState::Empty, Action::PullOrb) => Ok(state),
        (GamePackState::Empty, Action::EnterShop) => Ok(state),
        (GamePackState::Empty, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GamePackState::Empty, Action::BuyOrb(_)) => Ok(state),
        (GamePackState::Empty, Action::GoToNextLevel) => Ok(state),
        (GamePackState::Unopened, Action::ClaimFreeUsdc) => Ok(state),
        (GamePackState::Unopened, Action::BuyGamepack) => Ok(state),
        (GamePackState::Unopened, Action::StartGame) => Ok(state),
        (GamePackState::Unopened, Action::CashOut) => Ok(state),
        (GamePackState::Unopened, Action::PullOrb) => Ok(state),
        (GamePackState::Unopened, Action::EnterShop) => Ok(state),
        (GamePackState::Unopened, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GamePackState::Unopened, Action::BuyOrb(_)) => Ok(state),
        (GamePackState::Unopened, Action::GoToNextLevel) => Ok(state),
        (GamePackState::InProgress, Action::ClaimFreeUsdc) => Ok(state),
        (GamePackState::InProgress, Action::BuyGamepack) => Ok(state),
        (GamePackState::InProgress, Action::StartGame) => Ok(state),
        (GamePackState::InProgress, Action::CashOut) => Ok(state),
        (GamePackState::InProgress, Action::PullOrb) => Ok(state),
        (GamePackState::InProgress, Action::EnterShop) => Ok(state),
        (GamePackState::InProgress, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GamePackState::InProgress, Action::BuyOrb(_)) => Ok(state),
        (GamePackState::InProgress, Action::GoToNextLevel) => Ok(state),
        (GamePackState::EndedEarly, Action::ClaimFreeUsdc) => Ok(state),
        (GamePackState::EndedEarly, Action::BuyGamepack) => Ok(state),
        (GamePackState::EndedEarly, Action::StartGame) => Ok(state),
        (GamePackState::EndedEarly, Action::CashOut) => Ok(state),
        (GamePackState::EndedEarly, Action::PullOrb) => Ok(state),
        (GamePackState::EndedEarly, Action::EnterShop) => Ok(state),
        (GamePackState::EndedEarly, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GamePackState::EndedEarly, Action::BuyOrb(_)) => Ok(state),
        (GamePackState::EndedEarly, Action::GoToNextLevel) => Ok(state),
        (GamePackState::Completed, Action::ClaimFreeUsdc) => Ok(state),
        (GamePackState::Completed, Action::BuyGamepack) => Ok(state),
        (GamePackState::Completed, Action::StartGame) => Ok(state),
        (GamePackState::Completed, Action::CashOut) => Ok(state),
        (GamePackState::Completed, Action::PullOrb) => Ok(state),
        (GamePackState::Completed, Action::EnterShop) => Ok(state),
        (GamePackState::Completed, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GamePackState::Completed, Action::BuyOrb(_)) => Ok(state),
        (GamePackState::Completed, Action::GoToNextLevel) => Ok(state),
    }
}

pub fn update_game(state: GameState, action: Action) -> Result<GameState, ()> {
    match (state, action) {
        (GameState::Empty, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::Empty, Action::BuyGamepack) => Ok(state),
        (GameState::Empty, Action::StartGame) => Ok(state),
        (GameState::Empty, Action::CashOut) => Ok(state),
        (GameState::Empty, Action::PullOrb) => Ok(state),
        (GameState::Empty, Action::EnterShop) => Ok(state),
        (GameState::Empty, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::Empty, Action::BuyOrb(_)) => Ok(state),
        (GameState::Empty, Action::GoToNextLevel) => Ok(state),
        (GameState::New, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::New, Action::BuyGamepack) => Ok(state),
        (GameState::New, Action::StartGame) => Ok(state),
        (GameState::New, Action::CashOut) => Ok(state),
        (GameState::New, Action::PullOrb) => Ok(state),
        (GameState::New, Action::EnterShop) => Ok(state),
        (GameState::New, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::New, Action::BuyOrb(_)) => Ok(state),
        (GameState::New, Action::GoToNextLevel) => Ok(state),
        (GameState::Level, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::Level, Action::BuyGamepack) => Ok(state),
        (GameState::Level, Action::StartGame) => Ok(state),
        (GameState::Level, Action::CashOut) => Ok(state),
        (GameState::Level, Action::PullOrb) => Ok(state),
        (GameState::Level, Action::EnterShop) => Ok(state),
        (GameState::Level, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::Level, Action::BuyOrb(_)) => Ok(state),
        (GameState::Level, Action::GoToNextLevel) => Ok(state),
        (GameState::LevelComplete, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::LevelComplete, Action::BuyGamepack) => Ok(state),
        (GameState::LevelComplete, Action::StartGame) => Ok(state),
        (GameState::LevelComplete, Action::CashOut) => Ok(state),
        (GameState::LevelComplete, Action::PullOrb) => Ok(state),
        (GameState::LevelComplete, Action::EnterShop) => Ok(state),
        (GameState::LevelComplete, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::LevelComplete, Action::BuyOrb(_)) => Ok(state),
        (GameState::LevelComplete, Action::GoToNextLevel) => Ok(state),
        (GameState::FiveOrDiePhase, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::FiveOrDiePhase, Action::BuyGamepack) => Ok(state),
        (GameState::FiveOrDiePhase, Action::StartGame) => Ok(state),
        (GameState::FiveOrDiePhase, Action::CashOut) => Ok(state),
        (GameState::FiveOrDiePhase, Action::PullOrb) => Ok(state),
        (GameState::FiveOrDiePhase, Action::EnterShop) => Ok(state),
        (GameState::FiveOrDiePhase, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::FiveOrDiePhase, Action::BuyOrb(_)) => Ok(state),
        (GameState::FiveOrDiePhase, Action::GoToNextLevel) => Ok(state),
        (GameState::Shop, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::Shop, Action::BuyGamepack) => Ok(state),
        (GameState::Shop, Action::StartGame) => Ok(state),
        (GameState::Shop, Action::CashOut) => Ok(state),
        (GameState::Shop, Action::PullOrb) => Ok(state),
        (GameState::Shop, Action::EnterShop) => Ok(state),
        (GameState::Shop, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::Shop, Action::BuyOrb(_)) => Ok(state),
        (GameState::Shop, Action::GoToNextLevel) => Ok(state),
        (GameState::GameOver, Action::ClaimFreeUsdc) => Ok(state),
        (GameState::GameOver, Action::BuyGamepack) => Ok(state),
        (GameState::GameOver, Action::StartGame) => Ok(state),
        (GameState::GameOver, Action::CashOut) => Ok(state),
        (GameState::GameOver, Action::PullOrb) => Ok(state),
        (GameState::GameOver, Action::EnterShop) => Ok(state),
        (GameState::GameOver, Action::ConfirmFiveOrDie(_)) => Ok(state),
        (GameState::GameOver, Action::BuyOrb(_)) => Ok(state),
        (GameState::GameOver, Action::GoToNextLevel) => Ok(state),
    }
}
