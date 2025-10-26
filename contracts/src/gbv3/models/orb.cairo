use super::enums::OrbEffect;

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct Orb {
    pub effect: OrbEffect,
    pub count: u32,
    pub base_price: u32,
    pub current_price: u32,
}

pub fn non_buyable_one_damage_bomb() -> Orb {
    Orb { effect: OrbEffect::Bomb(1), count: 2, base_price: 0, current_price: 0 }
}

pub fn non_buyable_two_damage_bomb() -> Orb {
    Orb { effect: OrbEffect::Bomb(2), count: 1, base_price: 0, current_price: 0 }
}

pub fn non_buyable_three_damage_bomb() -> Orb {
    Orb { effect: OrbEffect::Bomb(3), count: 1, base_price: 0, current_price: 0 }
}

pub fn non_buyable_point_per_orb_remaining() -> Orb {
    Orb { effect: OrbEffect::PointPerOrbRemaining(1), count: 1, base_price: 0, current_price: 0 }
}

pub fn common_five_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(5), count: 3, base_price: 5, current_price: 5 }
}

pub fn common_glitch_chips_orb() -> Orb {
    Orb { effect: OrbEffect::GlitchChips(15), count: 0, base_price: 5, current_price: 5 }
}

pub fn common_five_or_die_orb() -> Orb {
    Orb { effect: OrbEffect::FiveOrDie, count: 0, base_price: 5, current_price: 5 }
}

pub fn common_point_per_bomb_pulled_orb() -> Orb {
    Orb { effect: OrbEffect::PointPerBombPulled(4), count: 1, base_price: 6, current_price: 6 }
}

pub fn common_seven_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(7), count: 0, base_price: 8, current_price: 8 }
}

pub fn common_moonrocks_orb() -> Orb {
    Orb { effect: OrbEffect::Moonrocks(15), count: 0, base_price: 8, current_price: 8 }
}

pub fn common_point_rewind_orb() -> Orb {
    Orb { effect: OrbEffect::PointRewind, count: 0, base_price: 8, current_price: 8 }
}

pub fn common_half_multiplier_orb() -> Orb {
    Orb { effect: OrbEffect::Multiplier(50), count: 0, base_price: 9, current_price: 9 }
}

pub fn common_health_orb() -> Orb {
    Orb { effect: OrbEffect::Health(1), count: 1, base_price: 9, current_price: 9 }
}

pub fn rare_eight_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(8), count: 0, base_price: 11, current_price: 11 }
}

pub fn rare_nine_point_orb() -> Orb {
    Orb { effect: OrbEffect::Point(9), count: 0, base_price: 13, current_price: 13 }
}

pub fn rare_one_multiplier_orb() -> Orb {
    Orb { effect: OrbEffect::Multiplier(100), count: 1, base_price: 14, current_price: 14 }
}

pub fn rare_two_point_per_orb_remaining() -> Orb {
    Orb { effect: OrbEffect::PointPerOrbRemaining(2), count: 0, base_price: 15, current_price: 15 }
}

pub fn rare_one_and_half_multiplier_orb() -> Orb {
    Orb { effect: OrbEffect::Multiplier(150), count: 0, base_price: 16, current_price: 16 }
}

pub fn cosmic_three_health_orb() -> Orb {
    Orb { effect: OrbEffect::Health(3), count: 0, base_price: 21, current_price: 21 }
}

pub fn cosmic_forty_moonrocks_orb() -> Orb {
    Orb { effect: OrbEffect::Moonrocks(40), count: 0, base_price: 23, current_price: 23 }
}

pub fn cosmic_bomb_immunity_orb() -> Orb {
    Orb { effect: OrbEffect::BombImmunity(3), count: 0, base_price: 24, current_price: 24 }
}

pub fn get_non_buyable_orbs() -> Array<Orb> {
    array![
        non_buyable_point_per_orb_remaining(),
        non_buyable_one_damage_bomb(),
        non_buyable_two_damage_bomb(),
        non_buyable_three_damage_bomb(),
    ]
}

pub fn get_common_orbs() -> Array<Orb> {
    array![
        common_five_point_orb(),
        common_seven_point_orb(),
        common_point_per_bomb_pulled_orb(),
        common_glitch_chips_orb(),
        common_five_or_die_orb(),
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
        rare_two_point_per_orb_remaining(),
        rare_one_multiplier_orb(),
        rare_one_and_half_multiplier_orb(),
    ]
}

pub fn get_cosmic_orbs() -> Array<Orb> {
    array![cosmic_three_health_orb(), cosmic_forty_moonrocks_orb(), cosmic_bomb_immunity_orb()]
}
