use super::states::{PlayerState, GamePackState, GameState};
use super::data::{PlayerData, GamePackData, GameData};
use super::actions::{PlayerAction, GamePackAction, GameAction};

#[derive(Drop, Debug)]
pub enum UpdateError {
    InvalidStateTransition,
    InvalidData,
}

pub fn update_player(state: PlayerState, data: PlayerData, action: PlayerAction) -> Result<(PlayerState, PlayerData), UpdateError> {
    match (state, action) {
        (PlayerState::Broke, PlayerAction::ClaimFreeUsdc) => {
            match data.usdc {
                0 => Ok((PlayerState::Stacked, PlayerData { usdc: 5, gamepacks_bought: data.gamepacks_bought })),
                _ => Err(UpdateError::InvalidData),
            }
        },
        (PlayerState::Stacked, PlayerAction::BuyGamePack) => {
            match data.usdc {
                0 => Err(UpdateError::InvalidData),
                1 => Ok((PlayerState::Broke, PlayerData { usdc: 0, gamepacks_bought: data.gamepacks_bought + 1 })),
                _ => Ok((PlayerState::Stacked, PlayerData { usdc: data.usdc - 1, gamepacks_bought: data.gamepacks_bought + 1 })),
            }
        },
        _ => Err(UpdateError::InvalidStateTransition),
    }
}

pub fn update_gamepack(state: GamePackState, data: GamePackData, action: GamePackAction) -> Result<(GamePackState, GamePackData), UpdateError> {
    match (state, action) {
        (GamePackState::Unopened, GamePackAction::OpenPack) => {
            let new_data = GamePackData {
                current_game_id: 1,
                accumulated_moonrocks: 100,
            };
            Ok((GamePackState::InProgress, new_data))
        },
        (GamePackState::InProgress, GamePackAction::SubmitScore) => {
            match data.current_game_id == 10 {
                true => Ok((GamePackState::Completed, data)),
                false => Err(UpdateError::InvalidData),
            }
        },
        _ => Err(UpdateError::InvalidStateTransition),
    }
}

pub fn update_game(state: GameState, data: GameData, action: GameAction) -> Result<(GameState, GameData), UpdateError> {
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
