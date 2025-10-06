use starknet::ContractAddress;

// ============================================================================
// STATE MACHINES (Enums)
// ============================================================================

// Main game state machine
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug, DojoStore, Default)]
pub enum GameState {
    #[default]
    New,              // Initial state before StartGame
    Level,            // Playing a level, pulling orbs
    LevelComplete,    // Milestone reached, can enter shop or cash out
    FiveOrDiePhase,   // Triggered by FiveOrDie orb, player confirms decision
    Shop,             // Buying orbs with glitch chips
    GameOver,         // Game ended (cashed out or died)
}

// Orb effect types
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug, DojoStore, Default)]
pub enum OrbEffectType {
    #[default]
    Broken,                   // Invalid/uninitialized orb effect
    Point,                    // Basic points (value = points)
    PointPerOrbRemaining,     // Points per remaining orb (value = points_per_orb)
    PointPerBombPulled,       // Points per bomb in history (value = points_per_bomb)
    GlitchChips,              // Currency for shop (value = chips)
    Moonrocks,                // Direct moonrock earnings (value = moonrocks)
    Health,                   // Healing (value = hp)
    Bomb,                     // Damage (value = damage)
    Multiplier,               // Point multiplier (value = multiplier * 10, e.g. 15 = 1.5x)
    PointRewind,              // Return lowest point orb to pool (value unused)
    FiveOrDie,                // Pull 5 random orbs (value unused)
    BombImmunity,             // Immune to bombs for N turns (value = turns)
}

// Orb rarity levels
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug, DojoStore, Default)]
pub enum OrbRarity {
    #[default]
    Common,
    Rare,
    Cosmic,
}

// Buyable status for orbs
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug, DojoStore, Default)]
pub enum BuyableStatus {
    #[default]
    NotBuyable,
    Buyable,
}

// Player actions
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum ActionType {
    StartGame,
    PullOrb,
    CashOut,
    EnterShop,
    BuyOrb,                  // Pair with InShopSlot to specify which slot
    ConfirmFiveOrDie,        // Pair with bool to confirm/deny
    GoToNextLevel,
}

// Shop slot selector (0-5)
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum InShopSlot {
    One,     // 0
    Two,     // 1
    Three,   // 2
    Four,    // 3
    Five,    // 4
    Six,     // 5
}

// Action errors
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum ActionError {
    InvalidActionInNewGame,
    InvalidActionInLevel,
    InvalidActionInLevelComplete,
    InvalidActionInFiveOrDiePhase,
    MilestoneNotMetYet,
    NoPointsToCashOut,
    InvalidActionInShop,
    OrbTooExpensive,
    BrokenErrorNonBuyableInShop,
    GameOver,
}

// ============================================================================
// MODELS
// ============================================================================

// Main game session - replaces Rust Game enum + GameData struct
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct GameSession {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub game_id: u32,                      // Supports multiple concurrent games

    // State
    pub state: GameState,

    // Level progression
    pub level: u32,
    pub points: u32,
    pub milestone: u32,

    // Player stats
    pub hp: u32,
    pub max_hp: u32,

    // Multiplier using fixed-point arithmetic
    // Actual multiplier = multiplier_numerator / multiplier_denominator
    // Example: 1.5x = 15/10, 0.5x = 5/10
    pub multiplier_numerator: u32,
    pub multiplier_denominator: u32,

    // Economy
    pub glitch_chips: u32,
    pub moonrocks_spent: u32,
    pub moonrocks_earned: u32,

    // Effects
    pub bomb_immunity_turns: u32,

    // GameOver state data
    pub moonrocks_diff: i32,              // Final moonrock change when game ends

    // Collection counters (for sequential IDs)
    pub pullable_count: u32,              // Number of pullable effects
    pub pulled_count: u32,                // Number of pulled effects
}

// Static orb templates (21 total, IDs 0-20)
// These define the base properties of each orb type
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct OrbTemplate {
    #[key]
    pub orb_id: u8,                       // 0-20 (21 orb types)

    pub effect_type: OrbEffectType,
    pub effect_value: u32,                // Meaning depends on effect_type
    pub rarity: OrbRarity,
    pub base_count: u32,                  // Starting count at level 1
    pub buyable: BuyableStatus,
    pub base_price: u32,                  // Price in glitch chips (0 if not buyable)
}

// Player's orb counts for a specific game
// Tracks purchased orbs and their current prices
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PlayerOrbCount {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub game_id: u32,
    #[key]
    pub orb_id: u8,                       // Reference to OrbTemplate

    pub count: u32,                       // How many of this orb the player has
    pub current_price: u32,               // Current price (increases with purchases)
}

// Shop slots (6 per game, IDs 0-5)
// Populated when entering shop
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct ShopSlot {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub game_id: u32,
    #[key]
    pub slot: u8,                         // 0-5 (6 shop slots)

    pub orb_id: u8,                       // Which OrbTemplate is in this slot
}

// Pullable orb effects pool
// Replaces Rust Vec<OrbEffect>
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PullableOrbEffect {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub game_id: u32,
    #[key]
    pub effect_id: u32,                   // Sequential ID

    pub effect_type: OrbEffectType,
    pub effect_value: u32,
}

// Pulled orb effects history
// Replaces Rust Vec<OrbEffect>
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PulledOrbEffect {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub game_id: u32,
    #[key]
    pub effect_id: u32,                   // Sequential ID

    pub effect_type: OrbEffectType,
    pub effect_value: u32,
}

// ============================================================================
// TYPE CONVERSIONS
// ============================================================================

impl GameStateIntoFelt252 of Into<GameState, felt252> {
    fn into(self: GameState) -> felt252 {
        match self {
            GameState::New => 0,
            GameState::Level => 1,
            GameState::LevelComplete => 2,
            GameState::FiveOrDiePhase => 3,
            GameState::Shop => 4,
            GameState::GameOver => 5,
        }
    }
}

impl OrbEffectTypeIntoFelt252 of Into<OrbEffectType, felt252> {
    fn into(self: OrbEffectType) -> felt252 {
        match self {
            OrbEffectType::Broken => 0,
            OrbEffectType::Point => 1,
            OrbEffectType::PointPerOrbRemaining => 2,
            OrbEffectType::PointPerBombPulled => 3,
            OrbEffectType::GlitchChips => 4,
            OrbEffectType::Moonrocks => 5,
            OrbEffectType::Health => 6,
            OrbEffectType::Bomb => 7,
            OrbEffectType::Multiplier => 8,
            OrbEffectType::PointRewind => 9,
            OrbEffectType::FiveOrDie => 10,
            OrbEffectType::BombImmunity => 11,
        }
    }
}

impl OrbRarityIntoFelt252 of Into<OrbRarity, felt252> {
    fn into(self: OrbRarity) -> felt252 {
        match self {
            OrbRarity::Common => 0,
            OrbRarity::Rare => 1,
            OrbRarity::Cosmic => 2,
        }
    }
}

impl BuyableStatusIntoFelt252 of Into<BuyableStatus, felt252> {
    fn into(self: BuyableStatus) -> felt252 {
        match self {
            BuyableStatus::NotBuyable => 0,
            BuyableStatus::Buyable => 1,
        }
    }
}

impl InShopSlotIntoU8 of Into<InShopSlot, u8> {
    fn into(self: InShopSlot) -> u8 {
        match self {
            InShopSlot::One => 0,
            InShopSlot::Two => 1,
            InShopSlot::Three => 2,
            InShopSlot::Four => 3,
            InShopSlot::Five => 4,
            InShopSlot::Six => 5,
        }
    }
}
