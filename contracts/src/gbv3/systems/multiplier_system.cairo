use crate::gbv3::models::game::GameData;

#[generate_trait]
pub impl MultiplierSystemImpl of MultiplierSystemTrait {
    fn add_multiplier(ref game_data: GameData, multiplier: u32) {
        game_data.multiplier += multiplier;
    }

    fn apply_multiplier(game_data: @GameData, base_value: u32) -> u32 {
        base_value * *game_data.multiplier / 100
    }

    fn reset_multiplier(ref game_data: GameData) {
        game_data.multiplier = 100;
    }
}
