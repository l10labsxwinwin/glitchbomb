use starknet::ContractAddress;
use super::shared::UpdateError;

// ============================================================================
// GamePack State
// ============================================================================

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GamePackState {
    #[default]
    Empty,
    Unopened,
    InProgress,
    EndedEarly,
    Completed,
}

// ============================================================================
// GamePack Data
// ============================================================================

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

// ============================================================================
// GamePack Actions
// ============================================================================

#[derive(Drop, Serde, Debug, Copy)]
pub enum GamePackAction {
    OpenPack,
    SubmitScore,
}

// ============================================================================
// GamePack Model
// ============================================================================

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct GamePack {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,

    pub state: GamePackState,
    pub data: GamePackData,
}

// ============================================================================
// GamePack Update Handler
// ============================================================================

pub fn update_gamepack(
    state: GamePackState,
    data: GamePackData,
    action: GamePackAction
) -> Result<(GamePackState, GamePackData), UpdateError> {
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
