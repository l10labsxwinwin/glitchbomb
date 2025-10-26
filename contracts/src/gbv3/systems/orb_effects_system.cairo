use crate::gbv3::models::game::GameData;
use crate::gbv3::models::enums::OrbEffect;
use crate::gbv3::types::GameError;
use crate::gbv3::systems::health_system::HealthSystemTrait;
use crate::gbv3::systems::points_system::PointsSystemTrait;
use crate::gbv3::systems::multiplier_system::MultiplierSystemTrait;
use crate::gbv3::systems::currency_system::CurrencySystemTrait;

#[generate_trait]
pub impl OrbEffectsSystemImpl of OrbEffectsSystemTrait {
    fn apply_orb_effect(
        ref game_data: GameData, effect: @OrbEffect,
    ) -> Result<(), GameError> {
        match effect {
            OrbEffect::Empty => { return Result::Err(GameError::InvalidData); },
            OrbEffect::Point(points) => {
                PointsSystemTrait::add_points(ref game_data, *points);
            },
            OrbEffect::PointPerOrbRemaining(point_per_orb) => {
                let num_orbs_remaining = game_data.pullable_orbs.len();
                let total_points = num_orbs_remaining * *point_per_orb;
                PointsSystemTrait::add_points(ref game_data, total_points);
            },
            OrbEffect::PointPerBombPulled(point_per_bomb) => {
                let total_points = game_data.bombs_pulled_in_level * *point_per_bomb;
                PointsSystemTrait::add_points(ref game_data, total_points);
            },
            OrbEffect::GlitchChips(chips) => {
                CurrencySystemTrait::earn_glitch_chips(ref game_data, *chips);
            },
            OrbEffect::Moonrocks(moonrocks) => {
                CurrencySystemTrait::earn_moonrocks(ref game_data, *moonrocks);
            },
            OrbEffect::Health(health) => {
                HealthSystemTrait::heal(ref game_data, *health);
            },
            OrbEffect::Bomb(damage) => {
                if HealthSystemTrait::has_bomb_immunity(@game_data) {
                    game_data.pullable_orbs.append(*effect);
                } else {
                    HealthSystemTrait::apply_damage(ref game_data, *damage);
                    game_data.bombs_pulled_in_level += 1;
                    game_data.consumed_orbs.append(*effect);
                }
            },
            OrbEffect::Multiplier(multiplier) => {
                MultiplierSystemTrait::add_multiplier(ref game_data, *multiplier);
            },
            OrbEffect::BombImmunity(turns) => {
                HealthSystemTrait::add_bomb_immunity(ref game_data, *turns);
            },
            OrbEffect::PointRewind => {
                Self::apply_point_rewind_effect(ref game_data)?;
            },
            OrbEffect::FiveOrDie => {},
        }

        match effect {
            OrbEffect::Bomb(_) => {},
            _ => game_data.consumed_orbs.append(*effect),
        }

        HealthSystemTrait::decrement_bomb_immunity(ref game_data);

        Result::Ok(())
    }

    fn apply_point_rewind_effect(ref game_data: GameData) -> Result<(), GameError> {
        let mut lowest_point_orb: Option<OrbEffect> = Option::None;
        let mut lowest_point_value: u32 = 9999;

        for effect in game_data.consumed_orbs.span() {
            if let OrbEffect::Point(points) = *effect {
                if points < lowest_point_value {
                    lowest_point_value = points;
                    lowest_point_orb = Option::Some(*effect);
                }
            }
        }

        if let Option::Some(orb_to_return) = lowest_point_orb {
            let mut new_consumed = ArrayTrait::new();
            let mut removed_one = false;

            for effect in game_data.consumed_orbs.span() {
                if !removed_one && *effect == orb_to_return {
                    removed_one = true;
                } else {
                    new_consumed.append(*effect);
                }
            }

            game_data.consumed_orbs = new_consumed;
            game_data.pullable_orbs.append(orb_to_return);
        }

        Result::Ok(())
    }
}
