use crate::gbv3::models::game::GameData;
use crate::gbv3::types::GameError;

#[generate_trait]
pub impl PointsSystemImpl of PointsSystemTrait {
    fn add_points(ref game_data: GameData, base_points: u32) {
        let total_points = base_points * game_data.multiplier / 100;
        game_data.points += total_points;
    }

    fn add_points_with_multiplier(ref game_data: GameData, points: u32, multiplier: u32) {
        let total_points = points * multiplier / 100;
        game_data.points += total_points;
    }

    fn check_milestone_reached(game_data: @GameData) -> bool {
        *game_data.points >= *game_data.milestone
    }

    fn cash_out_points(ref game_data: GameData) -> Result<u32, GameError> {
        if game_data.points == 0 {
            return Result::Err(GameError::ZeroPointsToCashOut);
        }
        let points_to_cash = game_data.points;
        game_data.moonrocks_earned += points_to_cash;
        game_data.temp_moonrocks += game_data.moonrocks_earned;
        game_data.temp_moonrocks -= game_data.moonrocks_spent;
        Result::Ok(points_to_cash)
    }

    fn reset_points(ref game_data: GameData) {
        game_data.points = 0;
    }

    fn convert_points_to_glitch_chips(ref game_data: GameData) {
        game_data.glitch_chips += game_data.points;
    }
}
