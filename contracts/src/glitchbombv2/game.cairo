use starknet::ContractAddress;
use super::shared::{UpdateError, shuffle};
use super::constants::{MAX_HP, level_cost_in_moonrocks, milestones};

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GameState {
    #[default]
    Empty,
    New,
    Level,
    LevelComplete,
    FiveOrDiePhase,
    Shop,
    GameOver,
}

#[derive(Drop, Serde, Debug, Clone, Introspect, DojoStore)]
pub struct GameData {
    pub level: u32,
    pub pull_number: u32,
    pub points: u32,
    pub milestone: u32,
    pub hp: u32,
    pub multiplier: u32,
    pub glitch_chips: u32,
    pub moonrocks_spent: u32,
    pub moonrocks_earned: u32,
    pub temp_moonrocks: u32,
    pub bomb_immunity_turns: u32,
    pub bombs_pulled_in_level: u32,
    pub pullable_orbs: Array<OrbEffect>,
    pub consumed_orbs: Array<OrbEffect>,
}

pub fn new_game_data() -> GameData {
    GameData {
        level: 1,
        pull_number: 0,
        points: 0,
        milestone: milestones(1),
        hp: MAX_HP,
        multiplier: 1,
        glitch_chips: 0,
        temp_moonrocks: 0,
        moonrocks_spent: 0,
        moonrocks_earned: 0,
        bomb_immunity_turns: 0,
        bombs_pulled_in_level: 0,
        pullable_orbs: ArrayTrait::new(),
        consumed_orbs: ArrayTrait::new(),
    }
}

#[derive(Copy, Drop, Serde, Debug, Introspect, DojoStore, PartialEq, Default)]
pub enum OrbEffect {
    #[default]
    Empty,
    PointRewind,
    FiveOrDie,
    Point: u32,
    PointPerOrbRemaining: u32,
    PointPerBombPulled: u32,
    GlitchChips: u32,
    Moonrocks: u32,
    Health: u32,
    Bomb: u32,
    Multiplier: u32,
    BombImmunity: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct Orb {
    pub effect: OrbEffect,
    pub count: u32,
    pub base_price: u32,
    pub current_price: u32,
}

#[derive(Drop, Serde, Debug, Copy)]
pub enum GameAction {
    StartGame,
    PullOrb,
    EnterShop,
    ConfirmFiveOrDie: bool,
    BuyOrb: u32,
    GoToNextLevel,
    CashOut,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,

    pub state: GameState,
    pub data: GameData,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct OrbsInGame {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,

    pub non_buyable: Array<Orb>,
    pub common: Array<Orb>,
    pub rare: Array<Orb>,
    pub cosmic: Array<Orb>,
}

fn non_buyable_one_damage_bomb() -> Orb {
    Orb {
        effect: OrbEffect::Bomb(1),
        count: 2,
        base_price: 0,
        current_price: 0,
    }
}

fn non_buyable_two_damage_bomb() -> Orb {
    Orb {
        effect: OrbEffect::Bomb(2),
        count: 1,
        base_price: 0,
        current_price: 0,
    }
}

fn non_buyable_three_damage_bomb() -> Orb {
    Orb {
        effect: OrbEffect::Bomb(3),
        count: 1,
        base_price: 0,
        current_price: 0,
    }
}

fn non_buyable_point_per_orb_remaining() -> Orb {
    Orb {
        effect: OrbEffect::PointPerOrbRemaining(1),
        count: 1,
        base_price: 0,
        current_price: 0,
    }
}

fn common_five_point_orb() -> Orb {
    Orb {
        effect: OrbEffect::Point(5),
        count: 3,
        base_price: 5,
        current_price: 5,
    }
}

fn common_glitch_chips_orb() -> Orb {
    Orb {
        effect: OrbEffect::GlitchChips(15),
        count: 0,
        base_price: 5,
        current_price: 5,
    }
}

fn common_five_or_die_orb() -> Orb {
    Orb {
        effect: OrbEffect::FiveOrDie,
        count: 0,
        base_price: 5,
        current_price: 5,
    }
}

fn common_point_per_bomb_pulled_orb() -> Orb {
    Orb {
        effect: OrbEffect::PointPerBombPulled(4),
        count: 1,
        base_price: 6,
        current_price: 6,
    }
}

fn common_seven_point_orb() -> Orb {
    Orb {
        effect: OrbEffect::Point(7),
        count: 0,
        base_price: 8,
        current_price: 8,
    }
}

fn common_moonrocks_orb() -> Orb {
    Orb {
        effect: OrbEffect::Moonrocks(15),
        count: 0,
        base_price: 8,
        current_price: 8,
    }
}

fn common_point_rewind_orb() -> Orb {
    Orb {
        effect: OrbEffect::PointRewind,
        count: 0,
        base_price: 8,
        current_price: 8,
    }
}

fn common_half_multiplier_orb() -> Orb {
    Orb {
        effect: OrbEffect::Multiplier(50),
        count: 0,
        base_price: 9,
        current_price: 9,
    }
}

fn common_health_orb() -> Orb {
    Orb {
        effect: OrbEffect::Health(1),
        count: 1,
        base_price: 9,
        current_price: 9,
    }
}

fn rare_eight_point_orb() -> Orb {
    Orb {
        effect: OrbEffect::Point(8),
        count: 0,
        base_price: 11,
        current_price: 11,
    }
}

fn rare_nine_point_orb() -> Orb {
    Orb {
        effect: OrbEffect::Point(9),
        count: 0,
        base_price: 13,
        current_price: 13,
    }
}

fn rare_one_multiplier_orb() -> Orb {
    Orb {
        effect: OrbEffect::Multiplier(100),
        count: 1,
        base_price: 14,
        current_price: 14,
    }
}

fn rare_two_point_per_orb_remaining() -> Orb {
    Orb {
        effect: OrbEffect::PointPerOrbRemaining(2),
        count: 0,
        base_price: 15,
        current_price: 15,
    }
}

fn rare_one_and_half_multiplier_orb() -> Orb {
    Orb {
        effect: OrbEffect::Multiplier(150),
        count: 0,
        base_price: 16,
        current_price: 16,
    }
}

fn cosmic_three_health_orb() -> Orb {
    Orb {
        effect: OrbEffect::Health(3),
        count: 0,
        base_price: 21,
        current_price: 21,
    }
}

fn cosmic_forty_moonrocks_orb() -> Orb {
    Orb {
        effect: OrbEffect::Moonrocks(40),
        count: 0,
        base_price: 23,
        current_price: 23,
    }
}

fn cosmic_bomb_immunity_orb() -> Orb {
    Orb {
        effect: OrbEffect::BombImmunity(3),
        count: 0,
        base_price: 24,
        current_price: 24,
    }
}

pub fn get_non_buyable_orbs() -> Array<Orb> {
    array![
        non_buyable_one_damage_bomb(),
        non_buyable_two_damage_bomb(),
        non_buyable_three_damage_bomb(),
        non_buyable_point_per_orb_remaining(),
    ]
}

pub fn get_common_orbs() -> Array<Orb> {
    array![
        common_five_point_orb(),
        common_glitch_chips_orb(),
        common_five_or_die_orb(),
        common_point_per_bomb_pulled_orb(),
        common_seven_point_orb(),
        common_moonrocks_orb(),
        common_point_rewind_orb(),
        common_half_multiplier_orb(),
        common_health_orb(),
    ]
}

pub fn get_rare_orbs() -> Array<Orb> {
    array![
        rare_eight_point_orb(),
        rare_nine_point_orb(),
        rare_one_multiplier_orb(),
        rare_two_point_per_orb_remaining(),
        rare_one_and_half_multiplier_orb(),
    ]
}

pub fn get_cosmic_orbs() -> Array<Orb> {
    array![
        cosmic_three_health_orb(),
        cosmic_forty_moonrocks_orb(),
        cosmic_bomb_immunity_orb(),
    ]
}

pub fn orbs_to_effects(orb_arrays: Array<Array<Orb>>) -> Array<OrbEffect> {
    let mut effects = ArrayTrait::new();

    for orb_array in orb_arrays {
        for orb in orb_array {
            let mut i: u32 = 0;
            while i < orb.count {
                effects.append(orb.effect);
                i += 1;
            }
        }
    };

    effects
}

fn apply_orb_effect_to_data(
    effect: @OrbEffect,
    data: GameData
) -> Result<GameData, UpdateError> {
    let mut new_data = data.clone();

    match effect {
        OrbEffect::Empty => {
            return Err(UpdateError::InvalidData);
        },
        OrbEffect::Point(points) => {
            let total_points = *points * new_data.multiplier / 100;
            new_data.points += total_points;
        },
        OrbEffect::PointPerOrbRemaining(point_per_orb) => {
            let num_orbs_remaining = new_data.pullable_orbs.len();
            let total_points = num_orbs_remaining * *point_per_orb * new_data.multiplier / 100;
            new_data.points += total_points;
        },
        OrbEffect::PointPerBombPulled(point_per_bomb) => {
            let total_points = new_data.bombs_pulled_in_level * *point_per_bomb * new_data.multiplier / 100;
            new_data.points += total_points;
        },
        OrbEffect::GlitchChips(chips) => {
            new_data.glitch_chips += *chips;
        },
        OrbEffect::Moonrocks(moonrocks) => {
            new_data.moonrocks_earned += *moonrocks;
        },
        OrbEffect::Health(health) => {
            new_data.hp = match new_data.hp + *health > MAX_HP {
                true => MAX_HP,
                false => new_data.hp + *health,
            };
        },
        OrbEffect::Bomb(damage) => {
            match new_data.bomb_immunity_turns > 0 {
                true => {
                    new_data.pullable_orbs.append(*effect);
                },
                false => {
                    new_data.hp = match *damage >= new_data.hp {
                        true => 0,
                        false => new_data.hp - *damage,
                    };
                    new_data.bombs_pulled_in_level += 1;
                    new_data.consumed_orbs.append(*effect);
                }
            }
        },
        OrbEffect::Multiplier(multiplier) => {
            new_data.multiplier += *multiplier;
        },
        OrbEffect::BombImmunity(turns) => {
            new_data.bomb_immunity_turns += *turns + 1;
        },
        OrbEffect::PointRewind => {
            // Find the lowest Point orb in consumed_orbs
            let mut lowest_point_orb: Option<OrbEffect> = Option::None;
            let mut lowest_point_value: u32 = 9999;

            for effect in new_data.consumed_orbs.span() {
                if let OrbEffect::Point(points) = *effect {
                    if points < lowest_point_value {
                        lowest_point_value = points;
                        lowest_point_orb = Option::Some(*effect);
                    }
                }
            }

            // If found, rebuild consumed_orbs without it and add back to pullable
            if let Option::Some(orb_to_return) = lowest_point_orb {
                let mut new_consumed = ArrayTrait::new();
                let mut removed_one = false;

                for effect in new_data.consumed_orbs.span() {
                    if !removed_one && *effect == orb_to_return {
                        removed_one = true;
                    } else {
                        new_consumed.append(*effect);
                    }
                }

                new_data.consumed_orbs = new_consumed;
                new_data.pullable_orbs.append(orb_to_return);
            }
        },
        OrbEffect::FiveOrDie => {
            // No data changes for FiveOrDie, only state transition
        },
    }

    match effect {
        OrbEffect::Bomb(_) => {},
        _ => new_data.consumed_orbs.append(*effect),
    }

    if new_data.bomb_immunity_turns > 0 {
        new_data.bomb_immunity_turns -= 1;
    }

    Ok(new_data)
}

fn apply_data_for_state(effect: @OrbEffect, data: @GameData) -> GameState {
    if *data.hp == 0 {
        GameState::GameOver
    } else if *data.points >= *data.milestone {
        GameState::LevelComplete
    } else if *effect == OrbEffect::FiveOrDie {
        GameState::FiveOrDiePhase
    } else if data.pullable_orbs.len() == 0 {
        GameState::GameOver
    } else {
        GameState::Level
    }
}

fn handle_cash_out(data: GameData) -> Result<(GameState, GameData), UpdateError> {
    match data.points {
        0 => Err(UpdateError::ZeroPointsToCashOut),
        _ => {
            let mut new_data = data.clone();
            new_data.moonrocks_earned += data.points;
            // update temp moonrocks ONLY when we cash out (for now)
            new_data.temp_moonrocks += new_data.moonrocks_earned;
            new_data.temp_moonrocks -= new_data.moonrocks_spent;
            Ok((GameState::GameOver, new_data))
        }
    }
}

fn handle_five_or_die_data(data: GameData) -> Result<GameData, UpdateError> {
    let mut current_data = data;
    current_data.multiplier += 100;

    let pullable_span = current_data.pullable_orbs.span();
    let mut new_pullable: Array<OrbEffect> = ArrayTrait::new();
    let mut orbs_pulled: u32 = 0;

    for orb_effect in pullable_span {
        if orbs_pulled >= 5 || current_data.hp == 0 {
            new_pullable.append(*orb_effect);
        } else {
            match orb_effect {
                OrbEffect::FiveOrDie => {
                    new_pullable.append(*orb_effect);
                },
                _ => {
                    // TODO: a way to track which orbs were pulled during five or die to display to user
                    let temp_data = (@current_data).clone();
                    current_data = apply_orb_effect_to_data(orb_effect, temp_data)?;
                    orbs_pulled += 1;
                }
            }
        }
    };

    current_data.pullable_orbs = new_pullable;
    current_data.multiplier -= 100;

    Ok(current_data)
}

fn handle_enter_shop(data: GameData) -> Result<(GameState, GameData), UpdateError> {
    let shop_cost = level_cost_in_moonrocks(data.level + 1);
    let total_spent = data.moonrocks_spent + shop_cost;
    let moonrocks = data.temp_moonrocks + data.moonrocks_earned;

    match moonrocks >= total_spent {
        true => {
            let mut new_data = data.clone();
            new_data.moonrocks_spent += shop_cost;
            new_data.glitch_chips += data.points;
            Ok((GameState::Shop, new_data))
        },
        false => Err(UpdateError::InsufficientMoonrocks),
    }
}

pub fn update_game(
    state: GameState,
    data: GameData,
    action: GameAction
) -> Result<(GameState, GameData), UpdateError> {
    match (state, action) {
        (GameState::New, GameAction::StartGame) => {
            let game_cost = level_cost_in_moonrocks(data.level);
            match data.temp_moonrocks >= game_cost {
                true => {
                    let mut new_data = data.clone();
                    new_data.temp_moonrocks = data.temp_moonrocks - game_cost;
                    new_data.moonrocks_spent = data.moonrocks_spent + game_cost;

                    Ok((GameState::Level, new_data))
                },
                false => Err(UpdateError::InsufficientMoonrocks),
            }
        },
        (GameState::Level, GameAction::PullOrb) => {
            let mut new_data = data.clone();

            new_data.pullable_orbs = shuffle(new_data.pullable_orbs);

            let pulled_orb = match new_data.pullable_orbs.pop_front() {
                Option::Some(orb) => orb,
                Option::None => {
                    return Ok((GameState::GameOver, data));
                },
            };

            new_data.pull_number += 1;

            new_data = apply_orb_effect_to_data(@pulled_orb, new_data)?;
            let new_state = apply_data_for_state(@pulled_orb, @new_data);

            Ok((new_state, new_data))
        },
        (GameState::Level, GameAction::CashOut) => handle_cash_out(data),
        (GameState::LevelComplete, GameAction::CashOut) => handle_cash_out(data),
        (GameState::LevelComplete, GameAction::EnterShop) => handle_enter_shop(data),
        (GameState::FiveOrDiePhase, GameAction::ConfirmFiveOrDie(confirmed)) => {
            match confirmed {
                true => {
                    let new_data = handle_five_or_die_data(data)?;
                    let new_state = apply_data_for_state(@OrbEffect::Empty, @new_data);
                    Ok((new_state, new_data))
                },
                false => Ok((GameState::Level, data)),
            }
        },
        (GameState::Shop, GameAction::BuyOrb(orb_price)) => {
            match data.glitch_chips >= orb_price {
                true => {
                    let mut new_data = data.clone();
                    new_data.glitch_chips -= orb_price;
                    Ok((state, new_data))
                },
                false => Err(UpdateError::InsufficientGlitchChips),
            }
        },
        (GameState::Shop, GameAction::GoToNextLevel) => {
            let next_level = data.level + 1;

            let mut new_data = new_game_data();

            new_data.level = next_level;
            new_data.milestone = milestones(next_level);
            new_data.glitch_chips = data.glitch_chips;
            new_data.moonrocks_spent = data.moonrocks_spent;
            new_data.moonrocks_earned = data.moonrocks_earned;
            new_data.temp_moonrocks = data.temp_moonrocks;

            Ok((GameState::Level, new_data))
        },
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
