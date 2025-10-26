use dojo::world::{WorldStorage};
use crate::gbv3::models::player::{Player, PlayerData};
use crate::gbv3::models::enums::PlayerState;
use crate::gbv3::models::game::GameData;
use crate::gbv3::types::GameError;
use crate::gbv3::constants::FREE_USDC_AMOUNT;

#[generate_trait]
pub impl CurrencySystemImpl of CurrencySystemTrait {
    fn add_usdc(ref player: Player, amount: u32) {
        player.data.usdc += amount;
        player.state = if player.data.usdc > 0 {
            PlayerState::Stacked
        } else {
            PlayerState::Broke
        };
    }

    fn spend_usdc(ref player: Player, amount: u32) -> Result<(), GameError> {
        if player.data.usdc < amount {
            return Result::Err(GameError::InsufficientUsdc);
        }
        player.data.usdc -= amount;
        player.state = if player.data.usdc > 0 {
            PlayerState::Stacked
        } else {
            PlayerState::Broke
        };
        Result::Ok(())
    }

    fn claim_free_usdc(ref player: Player) -> Result<(), GameError> {
        if player.data.usdc > 0 {
            return Result::Err(GameError::InvalidData);
        }
        if player.state != PlayerState::Broke {
            return Result::Err(GameError::InvalidData);
        }
        Self::add_usdc(ref player, FREE_USDC_AMOUNT);
        Result::Ok(())
    }

    fn earn_moonrocks(ref game_data: GameData, amount: u32) {
        game_data.moonrocks_earned += amount;
    }

    fn spend_moonrocks(ref game_data: GameData, amount: u32) -> Result<(), GameError> {
        let available = game_data.temp_moonrocks + game_data.moonrocks_earned;
        let total_spent = game_data.moonrocks_spent + amount;
        
        if available < total_spent {
            return Result::Err(GameError::InsufficientMoonrocks);
        }
        game_data.moonrocks_spent += amount;
        Result::Ok(())
    }

    fn earn_glitch_chips(ref game_data: GameData, amount: u32) {
        game_data.glitch_chips += amount;
    }

    fn spend_glitch_chips(ref game_data: GameData, amount: u32) -> Result<(), GameError> {
        if game_data.glitch_chips < amount {
            return Result::Err(GameError::InsufficientGlitchChips);
        }
        game_data.glitch_chips -= amount;
        Result::Ok(())
    }
}
