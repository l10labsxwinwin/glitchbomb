use super::game::Orb;
use super::shared::UpdateError;

const COMMON_1: u32 = 0;
const COMMON_2: u32 = 1;
const COMMON_3: u32 = 2;
const RARE_1: u32 = 0;
const RARE_2: u32 = 1;
const COSMIC_1: u32 = 0;

const PRICE_INCREASE_PERCENTAGE: u32 = 20;

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
