use starknet::ContractAddress;
use super::shared::UpdateError;

// ============================================================================
// Player State
// ============================================================================

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum PlayerState {
    #[default]
    Broke,
    Stacked,
}

// ============================================================================
// Player Data
// ============================================================================

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct PlayerData {
    pub usdc: u32,
    pub gamepacks_bought: u32,
}

pub fn new_player_data() -> PlayerData {
    PlayerData {
        usdc: 0,
        gamepacks_bought: 0,
    }
}

// ============================================================================
// Player Actions
// ============================================================================

#[derive(Drop, Serde, Debug, Copy)]
pub enum PlayerAction {
    ClaimFreeUsdc,
    BuyGamePack,
}

// ============================================================================
// Player Model
// ============================================================================

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: ContractAddress,

    pub state: PlayerState,
    pub data: PlayerData,
}

// ============================================================================
// Player Update Handler
// ============================================================================

pub fn update_player(
    state: PlayerState,
    data: PlayerData,
    action: PlayerAction
) -> Result<(PlayerState, PlayerData), UpdateError> {
    match (state, action) {
        (PlayerState::Broke, PlayerAction::ClaimFreeUsdc) => {
            match data.usdc {
                0 => Ok((
                    PlayerState::Stacked,
                    PlayerData { usdc: 5, gamepacks_bought: data.gamepacks_bought }
                )),
                _ => Err(UpdateError::InvalidData),
            }
        },
        (PlayerState::Stacked, PlayerAction::BuyGamePack) => {
            match data.usdc {
                0 => Err(UpdateError::InvalidData),
                1 => Ok((
                    PlayerState::Broke,
                    PlayerData { usdc: 0, gamepacks_bought: data.gamepacks_bought + 1 }
                )),
                _ => Ok((
                    PlayerState::Stacked,
                    PlayerData { usdc: data.usdc - 1, gamepacks_bought: data.gamepacks_bought + 1 }
                )),
            }
        },
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
