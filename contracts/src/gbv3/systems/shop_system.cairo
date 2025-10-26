use crate::gbv3::models::game::OrbsInGame;
use crate::gbv3::models::orb::Orb;
use crate::gbv3::types::{GameError, shuffle};
use crate::gbv3::constants::PRICE_INCREASE_PERCENTAGE;

#[generate_trait]
pub impl ShopSystemImpl of ShopSystemTrait {
    fn refresh_shop(ref orbs_in_game: OrbsInGame) {
        orbs_in_game.common = shuffle(orbs_in_game.common);
        orbs_in_game.rare = shuffle(orbs_in_game.rare);
        orbs_in_game.cosmic = shuffle(orbs_in_game.cosmic);
    }

    fn get_orb_price(
        common: @Array<Orb>, rare: @Array<Orb>, cosmic: @Array<Orb>, orb_id: u32,
    ) -> Result<u32, GameError> {
        let price = match orb_id {
            0 => *common.at(0).current_price,
            1 => *common.at(1).current_price,
            2 => *common.at(2).current_price,
            3 => *rare.at(0).current_price,
            4 => *rare.at(1).current_price,
            5 => *cosmic.at(0).current_price,
            _ => { return Result::Err(GameError::InvalidOrbId); },
        };
        Result::Ok(price)
    }

    fn purchase_orb(ref orbs_in_game: OrbsInGame, orb_id: u32) -> Result<(), GameError> {
        if orb_id > 5 {
            return Result::Err(GameError::InvalidOrbId);
        }

        let mut updated = false;

        if orb_id <= 2 {
            orbs_in_game.common = Self::buy_orb_at_index(orbs_in_game.common, orb_id);
            updated = true;
        } else if orb_id <= 4 {
            let rare_index = orb_id - 3;
            orbs_in_game.rare = Self::buy_orb_at_index(orbs_in_game.rare, rare_index);
            updated = true;
        } else if orb_id == 5 {
            orbs_in_game.cosmic = Self::buy_orb_at_index(orbs_in_game.cosmic, 0);
            updated = true;
        }

        if updated {
            Result::Ok(())
        } else {
            Result::Err(GameError::InvalidOrbId)
        }
    }

    fn buy_orb_at_index(orbs: Array<Orb>, index: u32) -> Array<Orb> {
        let mut new_orbs = ArrayTrait::new();
        let mut current_index = 0;

        for orb in orbs {
            if current_index == index {
                let mut updated_orb = orb;
                updated_orb.count += 1;

                let price_increase = (updated_orb.current_price * PRICE_INCREASE_PERCENTAGE + 99)
                    / 100;
                updated_orb.current_price += price_increase;

                new_orbs.append(updated_orb);
            } else {
                new_orbs.append(orb);
            }
            current_index += 1;
        }

        new_orbs
    }
}
