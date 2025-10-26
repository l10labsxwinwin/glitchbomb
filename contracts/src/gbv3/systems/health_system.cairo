use crate::gbv3::models::game::GameData;
use crate::gbv3::constants::MAX_HP;

#[generate_trait]
pub impl HealthSystemImpl of HealthSystemTrait {
    fn apply_damage(ref game_data: GameData, damage: u32) {
        if damage >= game_data.hp {
            game_data.hp = 0;
        } else {
            game_data.hp -= damage;
        }
    }

    fn heal(ref game_data: GameData, amount: u32) {
        if game_data.hp + amount > MAX_HP {
            game_data.hp = MAX_HP;
        } else {
            game_data.hp += amount;
        }
    }

    fn is_dead(game_data: @GameData) -> bool {
        *game_data.hp == 0
    }

    fn add_bomb_immunity(ref game_data: GameData, turns: u32) {
        game_data.bomb_immunity_turns += turns + 1;
    }

    fn decrement_bomb_immunity(ref game_data: GameData) {
        if game_data.bomb_immunity_turns > 0 {
            game_data.bomb_immunity_turns -= 1;
        }
    }

    fn has_bomb_immunity(game_data: @GameData) -> bool {
        *game_data.bomb_immunity_turns > 0
    }
}
