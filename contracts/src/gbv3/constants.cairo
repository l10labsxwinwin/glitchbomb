pub const MAX_HP: u32 = 5;

pub const FREE_USDC_AMOUNT: u32 = 5;
pub const GAMEPACK_PRICE: u32 = 1;

pub const INITIAL_GAME_ID: u32 = 1;
pub const INITIAL_MOONROCKS: u32 = 100;
pub const MAX_GAMES_PER_PACK: u32 = 10;

pub const PRICE_INCREASE_PERCENTAGE: u32 = 20;

pub fn milestones(level: u32) -> u32 {
    match level {
        0 => 9999,
        1 => 12,
        2 => 18,
        3 => 28,
        4 => 44,
        5 => 70,
        6 => 100,
        7 => 150,
        _ => 9999,
    }
}

pub fn level_cost_in_moonrocks(level: u32) -> u32 {
    match level {
        0 => 9999,
        1 => 10,
        2 => 1,
        3 => 2,
        4 => 4,
        5 => 6,
        6 => 9,
        7 => 13,
        _ => 9999,
    }
}
