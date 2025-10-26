pub mod glitchbombv2 {
    pub mod constants;
    pub mod contract;
    pub mod game;
    pub mod gamepack;
    pub mod orbs;
    pub mod player;
    pub mod shared;
}

pub mod gbv3 {
    pub mod constants;
    pub mod types;
    
    pub mod models {
        pub mod enums;
        pub mod player;
        pub mod gamepack;
        pub mod orb;
        pub mod game;
    }
    
    pub mod systems {
        pub mod player_system;
        pub mod currency_system;
        pub mod gamepack_system;
        pub mod game_system;
        pub mod orb_inventory_system;
        pub mod health_system;
        pub mod points_system;
        pub mod multiplier_system;
        pub mod shop_system;
        pub mod orb_effects_system;
        pub mod pull_system;
    }
    
    pub mod actions {
        pub mod player_actions;
    }
}
