pub const MAX_HP: u32 = 5;

pub const INITIAL_GAME_ID: u32 = 1;
pub const INITIAL_MOONROCKS: u32 = 100;
pub const MAX_GAMES_PER_PACK: u32 = 3;

// Will not use to avoid out of bound indexing
// pub const MILESTONES: [u32; 7] = [12, 18, 28, 44, 70, 100, 150];
// pub const LEVEL_COST_IN_MOONROCKS: [u32; 7] = [10, 1, 2, 4, 6, 9, 13];

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
