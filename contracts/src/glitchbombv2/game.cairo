use starknet::ContractAddress;
use super::shared::UpdateError;
use super::constants::{MAX_HP, MOONROCKS_GAME_PRICE};

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
        milestone: 0,
        hp: MAX_HP,
        multiplier: 1,
        glitch_chips: 0,
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

pub fn update_game(
    state: GameState,
    data: GameData,
    action: GameAction
) -> Result<(GameState, GameData), UpdateError> {
    match (state, action) {
        (GameState::New, GameAction::StartGame) => {
            let orb_arrays = array![
                get_non_buyable_orbs(),
                get_common_orbs(),
                get_rare_orbs(),
                get_cosmic_orbs(),
            ];
            let pullable_orbs = orbs_to_effects(orb_arrays);

            let mut new_data = data.clone();
            new_data.pullable_orbs = pullable_orbs;
            new_data.moonrocks_spent = data.moonrocks_spent + MOONROCKS_GAME_PRICE;

            Ok((GameState::Level, new_data))
        },
        (GameState::Level, GameAction::PullOrb) => Ok((GameState::LevelComplete, data)),
        (GameState::Level, GameAction::CashOut) => Ok((GameState::GameOver, data)),
        (GameState::LevelComplete, GameAction::EnterShop) => Ok((GameState::Shop, data)),
        (GameState::LevelComplete, GameAction::CashOut) => Ok((GameState::GameOver, data)),
        (GameState::FiveOrDiePhase, GameAction::ConfirmFiveOrDie(confirmed)) => {
            if confirmed {
                Ok((GameState::Level, data))
            } else {
                Ok((GameState::GameOver, data))
            }
        },
        (GameState::Shop, GameAction::BuyOrb(_)) => Ok((state, data)),
        (GameState::Shop, GameAction::GoToNextLevel) => Ok((GameState::Level, data)),
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
