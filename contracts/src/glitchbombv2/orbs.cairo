use super::game::{Orb, OrbEffect};
use super::shared::UpdateError;

const COMMON_1: u32 = 0;
const COMMON_2: u32 = 1;
const COMMON_3: u32 = 2;
const RARE_1: u32 = 0;
const RARE_2: u32 = 1;
const COSMIC_1: u32 = 0;

const PRICE_INCREASE_PERCENTAGE: u32 = 20;

fn non_buyable_one_damage_bomb() -> Orb {
    Orb { effect: OrbEffect::Bomb(1), count: 2, base_price: 0, current_price: 0 }
}

fn non_buyable_two_damage_bomb() -> Orb {
    Orb { effect: OrbEffect::Bomb(2), count: 1, base_price: 0, current_price: 0 }
}

fn non_buyable_three_damage_bomb() -> Orb {
    Orb { effect: OrbEffect::Bomb(3), count: 1, base_price: 0, current_price: 0 }
}

fn non_buyable_point_per_orb_remaining() -> Orb {
    Orb { effect: OrbEffect::PointPerOrbRemaining(1), count: 1, base_price: 0, current_price: 0 }
}

fn common_five_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(5), count: 3, base_price: 5, current_price: 5 }
}

fn common_glitch_chips_orb() -> Orb {
    Orb { effect: OrbEffect::GlitchChips(15), count: 0, base_price: 5, current_price: 5 }
}

fn common_point_per_bomb_pulled_orb() -> Orb {
    Orb { effect: OrbEffect::PointPerBombPulled(4), count: 1, base_price: 6, current_price: 6 }
}

fn common_seven_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(7), count: 0, base_price: 8, current_price: 8 }
}

fn common_moonrocks_orb() -> Orb {
    Orb { effect: OrbEffect::Moonrocks(15), count: 0, base_price: 8, current_price: 8 }
}

fn common_point_rewind_orb() -> Orb {
    Orb { effect: OrbEffect::PointRewind, count: 0, base_price: 8, current_price: 8 }
}

fn common_half_multiplier_orb() -> Orb {
    Orb { effect: OrbEffect::Multiplier(50), count: 0, base_price: 9, current_price: 9 }
}

fn common_health_orb() -> Orb {
    Orb { effect: OrbEffect::Health(1), count: 1, base_price: 9, current_price: 9 }
}

fn rare_eight_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(8), count: 0, base_price: 11, current_price: 11 }
}

fn rare_nine_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(9), count: 0, base_price: 13, current_price: 13 }
}

fn rare_one_multiplier_orb() -> Orb {
    Orb { effect: OrbEffect::Multiplier(100), count: 1, base_price: 14, current_price: 14 }
}

fn rare_two_point_per_orb_remaining() -> Orb {
    Orb { effect: OrbEffect::PointPerOrbRemaining(2), count: 0, base_price: 15, current_price: 15 }
}

fn rare_one_and_half_multiplier_orb() -> Orb {
    Orb { effect: OrbEffect::Multiplier(150), count: 0, base_price: 16, current_price: 16 }
}

fn cosmic_three_health_orb() -> Orb {
    Orb { effect: OrbEffect::Health(3), count: 0, base_price: 21, current_price: 21 }
}

fn cosmic_forty_moonrocks_orb() -> Orb {
    Orb { effect: OrbEffect::Moonrocks(40), count: 0, base_price: 23, current_price: 23 }
}

fn cosmic_bomb_immunity_orb() -> Orb {
    Orb { effect: OrbEffect::BombImmunity(3), count: 0, base_price: 24, current_price: 24 }
}

pub fn get_non_buyable_orbs() -> Array<Orb> {
    array![
        non_buyable_point_per_orb_remaining(), non_buyable_one_damage_bomb(),
        non_buyable_two_damage_bomb(), non_buyable_three_damage_bomb(),
    ]
}

pub fn get_common_orbs() -> Array<Orb> {
    array![
        common_five_point_orb(), common_seven_point_orb(), common_point_per_bomb_pulled_orb(),
        common_glitch_chips_orb(), common_moonrocks_orb(), common_point_rewind_orb(),
        common_half_multiplier_orb(), common_health_orb(),
    ]
}

pub fn get_rare_orbs() -> Array<Orb> {
    array![
        rare_eight_point_orb(), rare_nine_point_orb(), rare_two_point_per_orb_remaining(),
        rare_one_multiplier_orb(), rare_one_and_half_multiplier_orb(),
    ]
}

pub fn get_cosmic_orbs() -> Array<Orb> {
    array![cosmic_three_health_orb(), cosmic_forty_moonrocks_orb(), cosmic_bomb_immunity_orb()]
}

fn buy_orb_at_index(orbs: Array<Orb>, index: u32) -> Array<Orb> {
    let mut new_orbs = ArrayTrait::new();
    let mut current_index = 0;

    for orb in orbs {
        if current_index == index {
            let mut updated_orb = orb;
            updated_orb.count += 1;

            let price_increase = (updated_orb.current_price * PRICE_INCREASE_PERCENTAGE + 99) / 100;
            updated_orb.current_price += price_increase;

            new_orbs.append(updated_orb);
        } else {
            new_orbs.append(orb);
        }
        current_index += 1;
    }

    new_orbs
}

pub fn update_shop_orbs(
    common: Array<Orb>, rare: Array<Orb>, cosmic: Array<Orb>, orb_id: u32,
) -> Result<(Array<Orb>, Array<Orb>, Array<Orb>), UpdateError> {
    match orb_id {
        0 => {
            let new_common = buy_orb_at_index(common, COMMON_1);
            Ok((new_common, rare, cosmic))
        },
        1 => {
            let new_common = buy_orb_at_index(common, COMMON_2);
            Ok((new_common, rare, cosmic))
        },
        2 => {
            let new_common = buy_orb_at_index(common, COMMON_3);
            Ok((new_common, rare, cosmic))
        },
        3 => {
            let new_rare = buy_orb_at_index(rare, RARE_1);
            Ok((common, new_rare, cosmic))
        },
        4 => {
            let new_rare = buy_orb_at_index(rare, RARE_2);
            Ok((common, new_rare, cosmic))
        },
        5 => {
            let new_cosmic = buy_orb_at_index(cosmic, COSMIC_1);
            Ok((common, rare, new_cosmic))
        },
        _ => { Err(UpdateError::InvalidData) },
    }
}

pub fn update_common_orbs(common: Array<Orb>, rare: Array<Orb>, cosmic: Array<Orb>, index: u32) -> (Array<Orb>, Array<Orb>, Array<Orb>) {
    let new_common = buy_orb_at_index(common, index);
    (new_common, rare, cosmic)
}

pub fn update_rare_orbs(common: Array<Orb>, rare: Array<Orb>, cosmic: Array<Orb>, index: u32) -> (Array<Orb>, Array<Orb>, Array<Orb>) {
    let new_rare = buy_orb_at_index(rare, index);
    (common, new_rare, cosmic)
}

pub fn update_cosmic_orbs(common: Array<Orb>, rare: Array<Orb>, cosmic: Array<Orb>, index: u32) -> (Array<Orb>, Array<Orb>, Array<Orb>) {
    let new_cosmic = buy_orb_at_index(cosmic, index);
    (common, rare, new_cosmic)
}

pub fn get_orb_price(
    common: @Array<Orb>, rare: @Array<Orb>, cosmic: @Array<Orb>, orb_id: u32,
) -> u32 {
    match orb_id {
        0 => *common.at(0).current_price,
        1 => *common.at(1).current_price,
        2 => *common.at(2).current_price,
        3 => *rare.at(0).current_price,
        4 => *rare.at(1).current_price,
        5 => *cosmic.at(0).current_price,
        _ => 9999,
    }
}
