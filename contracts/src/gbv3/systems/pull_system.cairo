use crate::gbv3::models::game::GameData;
use crate::gbv3::models::enums::{GameState, OrbEffect};
use crate::gbv3::types::{GameError, shuffle};
use crate::gbv3::systems::orb_effects_system::OrbEffectsSystemTrait;
use crate::gbv3::systems::health_system::HealthSystemTrait;
use crate::gbv3::systems::points_system::PointsSystemTrait;
use crate::gbv3::systems::multiplier_system::MultiplierSystemTrait;

#[generate_trait]
pub impl PullSystemImpl of PullSystemTrait {
    fn pull_orb(ref game_data: GameData) -> Result<(OrbEffect, GameState), GameError> {
        game_data.pullable_orbs = shuffle(game_data.pullable_orbs);

        let pulled_orb = match game_data.pullable_orbs.pop_front() {
            Option::Some(orb) => orb,
            Option::None => { return Result::Err(GameError::InvalidData); },
        };

        game_data.pull_number += 1;

        OrbEffectsSystemTrait::apply_orb_effect(ref game_data, @pulled_orb)?;

        let new_state = Self::determine_state_after_pull(@game_data, @pulled_orb);

        Result::Ok((pulled_orb, new_state))
    }

    fn determine_state_after_pull(game_data: @GameData, effect: @OrbEffect) -> GameState {
        if HealthSystemTrait::is_dead(game_data) {
            GameState::GameOver
        } else if PointsSystemTrait::check_milestone_reached(game_data) {
            GameState::LevelComplete
        } else if *effect == OrbEffect::FiveOrDie {
            GameState::FiveOrDiePhase
        } else if game_data.pullable_orbs.is_empty() {
            GameState::GameOver
        } else {
            GameState::Level
        }
    }

    fn execute_five_or_die(ref game_data: GameData) -> Result<GameState, GameError> {
        MultiplierSystemTrait::add_multiplier(ref game_data, 100);

        let pullable_span = game_data.pullable_orbs.span();
        let mut new_pullable: Array<OrbEffect> = ArrayTrait::new();
        let mut orbs_pulled: u32 = 0;

        for orb_effect in pullable_span {
            if orbs_pulled >= 5 || HealthSystemTrait::is_dead(@game_data) {
                new_pullable.append(*orb_effect);
            } else {
                match orb_effect {
                    OrbEffect::FiveOrDie => { new_pullable.append(*orb_effect); },
                    _ => {
                        OrbEffectsSystemTrait::apply_orb_effect(ref game_data, orb_effect)?;
                        orbs_pulled += 1;
                    },
                }
            }
        }

        game_data.pullable_orbs = new_pullable;
        game_data.multiplier -= 100;

        let new_state = Self::determine_state_after_pull(@game_data, @OrbEffect::Empty);
        Result::Ok(new_state)
    }
}
