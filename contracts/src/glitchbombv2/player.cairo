use starknet::ContractAddress;
use super::constants::{FREE_USDC_AMOUNT, GAMEPACK_PRICE};
use super::shared::UpdateError;

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum PlayerState {
    #[default]
    Broke,
    Stacked,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct PlayerData {
    pub usdc: u32,
    pub gamepacks_bought: u32,
}

pub fn new_player_data() -> PlayerData {
    PlayerData { usdc: 0, gamepacks_bought: 0 }
}

#[derive(Drop, Serde, Debug, Copy)]
pub enum PlayerAction {
    ClaimFreeUsdc,
    BuyGamePack,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: ContractAddress,
    pub state: PlayerState,
    pub data: PlayerData,
}

pub fn update_player(
    state: PlayerState, data: PlayerData, action: PlayerAction,
) -> Result<(PlayerState, PlayerData), UpdateError> {
    match (state, action) {
        (
            PlayerState::Broke, PlayerAction::ClaimFreeUsdc,
        ) => {
            match data.usdc {
                0 => Ok(
                    (
                        PlayerState::Stacked,
                        PlayerData {
                            usdc: FREE_USDC_AMOUNT, gamepacks_bought: data.gamepacks_bought,
                        },
                    ),
                ),
                _ => Err(UpdateError::InvalidData),
            }
        },
        (
            PlayerState::Stacked, PlayerAction::BuyGamePack,
        ) => {
            match data.usdc {
                0 => Err(UpdateError::InvalidData),
                _ => {
                    if data.usdc < GAMEPACK_PRICE {
                        Err(UpdateError::InvalidData)
                    } else {
                        let new_usdc = data.usdc - GAMEPACK_PRICE;
                        let new_state = if new_usdc == 0 {
                            PlayerState::Broke
                        } else {
                            PlayerState::Stacked
                        };
                        Ok(
                            (
                                new_state,
                                PlayerData {
                                    usdc: new_usdc, gamepacks_bought: data.gamepacks_bought + 1,
                                },
                            ),
                        )
                    }
                },
            }
        },
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
