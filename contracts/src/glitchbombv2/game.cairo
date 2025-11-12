use crate::types::random::Random;
use super::constants::{MAX_HP, level_cost_in_moonrocks, milestones};
use super::gamepack::GamePack;
use super::orbs::{get_common_orbs, get_cosmic_orbs, get_non_buyable_orbs, get_rare_orbs};
use super::shared::{UpdateError, shuffle};

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GameState {
    #[default]
    Empty,
    New,
    Level,
    LevelComplete,
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
        multiplier: 100,
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
    BuyOrb: u32,
    GoToNextLevel,
    CashOut,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,
    pub state: GameState,
    pub data: GameData,
}

#[generate_trait]
pub impl GameImpl of GameTrait {
    fn create_first_for_gamepack(gamepack: @GamePack) -> Game {
        let mut new_game = Game {
            gamepack_id: *gamepack.gamepack_id,
            game_id: 1,
            state: GameState::New,
            data: new_game_data(),
        };
        new_game.data.temp_moonrocks = *gamepack.data.accumulated_moonrocks;
        new_game
    }
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct OrbsInGame {
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,
    pub non_buyable: Array<Orb>,
    pub common: Array<Orb>,
    pub rare: Array<Orb>,
    pub cosmic: Array<Orb>,
}

#[generate_trait]
pub impl OrbsInGameImpl of OrbsInGameTrait {
    fn create_for_game(gamepack_id: u32, game_id: u32) -> OrbsInGame {
        OrbsInGame {
            gamepack_id,
            game_id,
            non_buyable: get_non_buyable_orbs(),
            common: get_common_orbs(),
            rare: get_rare_orbs(),
            cosmic: get_cosmic_orbs(),
        }
    }

    fn to_pullable_orbs(self: @OrbsInGame) -> Array<OrbEffect> {
        let orb_arrays = array![
            self.common.clone(), self.rare.clone(), self.cosmic.clone(), self.non_buyable.clone(),
        ];
        orbs_to_effects(orb_arrays)
    }
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
    }

    effects
}

fn handle_point_orb(mut data: GameData, points: u32) -> GameData {
    let total_points = points * data.multiplier / 100;
    data.points += total_points;
    data
}

fn handle_point_per_orb_remaining_orb(mut data: GameData, point_per_orb: u32) -> GameData {
    let num_orbs_remaining = data.pullable_orbs.len();
    let total_points = num_orbs_remaining * point_per_orb * data.multiplier / 100;
    data.points += total_points;
    data
}

fn handle_point_per_bomb_pulled_orb(mut data: GameData, point_per_bomb: u32) -> GameData {
    let total_points = data.bombs_pulled_in_level * point_per_bomb * data.multiplier / 100;
    data.points += total_points;
    data
}

fn handle_glitch_chips_orb(mut data: GameData, chips: u32) -> GameData {
    data.glitch_chips += chips;
    data
}

fn handle_moonrocks_orb(mut data: GameData, moonrocks: u32) -> GameData {
    data.moonrocks_earned += moonrocks;
    data
}

fn handle_health_orb(mut data: GameData, health: u32) -> GameData {
    data.hp = match data.hp + health > MAX_HP {
        true => MAX_HP,
        false => data.hp + health,
    };
    data
}

fn handle_bomb_orb(mut data: GameData, damage: u32, effect: OrbEffect) -> GameData {
    match data.bomb_immunity_turns > 0 {
        true => { data.pullable_orbs.append(effect); },
        false => {
            data.hp = match damage >= data.hp {
                true => 0,
                false => data.hp - damage,
            };
            data.bombs_pulled_in_level += 1;
            data.consumed_orbs.append(effect);
        },
    }
    data
}

fn handle_multiplier_orb(mut data: GameData, multiplier: u32) -> GameData {
    data.multiplier += multiplier;
    data
}

fn handle_bomb_immunity_orb(mut data: GameData, turns: u32) -> GameData {
    data.bomb_immunity_turns += turns + 1;
    data
}

fn handle_point_rewind_orb(mut data: GameData) -> GameData {
    let mut lowest_point_orb: Option<OrbEffect> = Option::None;
    let mut lowest_point_value: u32 = 9999;

    for effect in data.consumed_orbs.span() {
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

        for effect in data.consumed_orbs.span() {
            if !removed_one && *effect == orb_to_return {
                removed_one = true;
            } else {
                new_consumed.append(*effect);
            }
        }

        data.consumed_orbs = new_consumed;
        data.pullable_orbs.append(orb_to_return);
    }

    data
}

fn apply_orb_effect_to_data(effect: @OrbEffect, data: GameData) -> Result<GameData, UpdateError> {
    let mut new_data = data.clone();

    match effect {
        OrbEffect::Empty => { return Err(UpdateError::InvalidData); },
        OrbEffect::Point(points) => { new_data = handle_point_orb(new_data, *points); },
        OrbEffect::PointPerOrbRemaining(point_per_orb) => {
            new_data = handle_point_per_orb_remaining_orb(new_data, *point_per_orb);
        },
        OrbEffect::PointPerBombPulled(point_per_bomb) => {
            new_data = handle_point_per_bomb_pulled_orb(new_data, *point_per_bomb);
        },
        OrbEffect::GlitchChips(chips) => { new_data = handle_glitch_chips_orb(new_data, *chips); },
        OrbEffect::Moonrocks(moonrocks) => {
            new_data = handle_moonrocks_orb(new_data, *moonrocks);
        },
        OrbEffect::Health(health) => { new_data = handle_health_orb(new_data, *health); },
        OrbEffect::Bomb(damage) => { new_data = handle_bomb_orb(new_data, *damage, *effect); },
        OrbEffect::Multiplier(multiplier) => {
            new_data = handle_multiplier_orb(new_data, *multiplier);
        },
        OrbEffect::BombImmunity(turns) => {
            new_data = handle_bomb_immunity_orb(new_data, *turns);
        },
        OrbEffect::PointRewind => { new_data = handle_point_rewind_orb(new_data); },
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
    } else if data.pullable_orbs.is_empty() {
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
        },
    }
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

fn handle_start_game(data: GameData) -> Result<(GameState, GameData), UpdateError> {
    let game_cost = level_cost_in_moonrocks(data.level);
    match data.temp_moonrocks >= game_cost {
        true => {
            let mut new_data = data.clone();
            new_data.moonrocks_spent = data.moonrocks_spent + game_cost;

            Ok((GameState::Level, new_data))
        },
        false => Err(UpdateError::InsufficientMoonrocks),
    }
}

fn handle_pull_orb(
    data: GameData, ref random: Random,
) -> Result<(GameState, GameData), UpdateError> {
    let mut new_data = data.clone();

    new_data.pullable_orbs = shuffle(new_data.pullable_orbs, ref random);

    let pulled_orb = match new_data.pullable_orbs.pop_front() {
        Option::Some(orb) => orb,
        Option::None => { return Ok((GameState::GameOver, data)); },
    };

    new_data.pull_number += 1;

    new_data = apply_orb_effect_to_data(@pulled_orb, new_data)?;
    let new_state = apply_data_for_state(@pulled_orb, @new_data);

    Ok((new_state, new_data))
}


fn handle_buy_orb(
    state: GameState, data: GameData, orb_price: u32,
) -> Result<(GameState, GameData), UpdateError> {
    match data.glitch_chips >= orb_price {
        true => {
            let mut new_data = data.clone();
            new_data.glitch_chips -= orb_price;
            Ok((state, new_data))
        },
        false => Err(UpdateError::InsufficientGlitchChips),
    }
}

fn handle_go_to_next_level(data: GameData) -> Result<(GameState, GameData), UpdateError> {
    let next_level = data.level + 1;

    let mut new_data = new_game_data();

    new_data.level = next_level;
    new_data.milestone = milestones(next_level);
    new_data.glitch_chips = data.glitch_chips;
    new_data.moonrocks_spent = data.moonrocks_spent;
    new_data.moonrocks_earned = data.moonrocks_earned;
    new_data.temp_moonrocks = data.temp_moonrocks;

    Ok((GameState::Level, new_data))
}

pub fn update_game(
    state: GameState, data: GameData, action: GameAction, ref random: Random,
) -> Result<(GameState, GameData), UpdateError> {
    match (state, action) {
        (GameState::New, GameAction::StartGame) => handle_start_game(data),
        (GameState::Level, GameAction::PullOrb) => handle_pull_orb(data, ref random),
        (GameState::Level, GameAction::CashOut) => handle_cash_out(data),
        (GameState::LevelComplete, GameAction::CashOut) => handle_cash_out(data),
        (GameState::LevelComplete, GameAction::EnterShop) => handle_enter_shop(data),
        (GameState::Shop, GameAction::BuyOrb(orb_price)) => handle_buy_orb(state, data, orb_price),
        (GameState::Shop, GameAction::GoToNextLevel) => handle_go_to_next_level(data),
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
