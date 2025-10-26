# GlitchBomb v3 - Modular ECS Architecture

## Overview

GlitchBomb v3 is a complete rewrite of the GlitchBomb game using Dojo's ECS (Entity Component System) patterns with a focus on modularity, composability, and maintainability.

## Architecture

### Core Principles

1. **Single Responsibility** - Each system handles one specific concern
2. **Composition over Inheritance** - Complex behaviors built from simple systems
3. **Stateless Systems** - All state stored in models, accessed through world
4. **Clear Boundaries** - Models = Data, Systems = Logic, Actions = Coordination

## Directory Structure

```
gbv3/
├── constants.cairo          # Game constants and helper functions
├── types.cairo              # Error types and utility functions
├── models/                  # ECS Models (Data)
│   ├── enums.cairo         # Game state enums
│   ├── player.cairo        # Player entity model
│   ├── gamepack.cairo      # GamePack entity model
│   ├── game.cairo          # Game entity and data model
│   └── orb.cairo           # Orb definitions
├── systems/                 # ECS Systems (Logic)
│   ├── player_system.cairo
│   ├── currency_system.cairo
│   ├── gamepack_system.cairo
│   ├── game_system.cairo
│   ├── orb_inventory_system.cairo
│   ├── health_system.cairo
│   ├── points_system.cairo
│   ├── multiplier_system.cairo
│   ├── shop_system.cairo
│   ├── orb_effects_system.cairo
│   └── pull_system.cairo
└── actions/                 # High-level Coordinators
    └── player_actions.cairo # Composes systems into game actions
```

## Models (Data Layer)

### Enums
- `PlayerState` - Broke | Stacked
- `GamePackState` - Unopened | InProgress | EndedEarly | Completed
- `GameState` - New | Level | LevelComplete | FiveOrDiePhase | Shop | GameOver
- `OrbEffect` - All orb effect types

### Entity Models
- **Player** - Player account and USDC balance
  - Keys: `player: ContractAddress`
  - Data: `usdc`, `gamepacks_bought`

- **GamePack** - Container for multiple games
  - Keys: `player: ContractAddress`, `gamepack_id: u32`
  - Data: `current_game_id`, `accumulated_moonrocks`

- **Game** - Individual game session
  - Keys: `player: ContractAddress`, `gamepack_id: u32`, `game_id: u32`
  - Data: level, hp, points, moonrocks, pullable_orbs, etc.

- **OrbsInGame** - Orb pools for a game
  - Keys: `player: ContractAddress`, `gamepack_id: u32`, `game_id: u32`
  - Data: `non_buyable`, `common`, `rare`, `cosmic` orb arrays

## Systems (Logic Layer)

### Core Entity Systems

#### PlayerSystem
- `get_or_create_player()` - Get existing or create new player
- `save_player()` - Persist player to world

#### GamePackSystem
- `create_gamepack()` - Create new gamepack
- `open_gamepack()` - Transition to InProgress
- `complete_gamepack()` - Mark as Completed
- `save_gamepack()` - Persist to world

#### GameSystem
- `create_game()` - Initialize new game
- `start_game()` - Begin gameplay (deduct entry fee)
- `end_game()` - Transition to GameOver
- `transition_to_level_complete()` - Mark level complete
- `transition_to_shop()` - Enter shop phase
- `transition_to_five_or_die()` - Enter FiveOrDie phase
- `advance_to_next_level()` - Progress to next level
- `save_game()` - Persist to world

### Resource Management Systems

#### CurrencySystem
- `add_usdc()` - Add USDC to player
- `spend_usdc()` - Deduct USDC
- `claim_free_usdc()` - Claim free starting USDC
- `earn_moonrocks()` - Add moonrocks
- `spend_moonrocks()` - Deduct moonrocks
- `earn_glitch_chips()` - Add glitch chips
- `spend_glitch_chips()` - Deduct glitch chips

#### PointsSystem
- `add_points()` - Award points with multiplier
- `check_milestone_reached()` - Check if level complete
- `cash_out_points()` - Convert points to moonrocks
- `reset_points()` - Clear points
- `convert_points_to_glitch_chips()` - Points → chips

### Gameplay Systems

#### HealthSystem
- `apply_damage()` - Reduce HP
- `heal()` - Restore HP (capped at MAX_HP)
- `is_dead()` - Check if HP = 0
- `add_bomb_immunity()` - Add immunity turns
- `decrement_bomb_immunity()` - Reduce immunity counter
- `has_bomb_immunity()` - Check if immune

#### MultiplierSystem
- `add_multiplier()` - Stack multipliers
- `apply_multiplier()` - Calculate with multiplier
- `reset_multiplier()` - Reset to 100

#### OrbInventorySystem
- `initialize_orb_pool()` - Create game's orb collection
- `orbs_to_effects()` - Convert Orb[] to OrbEffect[]
- `shuffle_orbs()` - Randomize orb order
- `save_orbs_in_game()` - Persist to world

#### ShopSystem
- `refresh_shop()` - Shuffle shop inventory
- `get_orb_price()` - Get current orb price
- `purchase_orb()` - Buy orb and update price
- `buy_orb_at_index()` - Internal: update orb count/price

#### OrbEffectsSystem
- `apply_orb_effect()` - Execute orb behavior
  - Handles all 12 orb effect types
  - Integrates with Health, Points, Multiplier, Currency systems
- `apply_point_rewind_effect()` - Special logic for PointRewind

#### PullSystem
- `pull_orb()` - Execute single orb pull
  - Shuffle orbs
  - Pop from pullable array
  - Apply orb effect
  - Determine new game state
- `execute_five_or_die()` - Auto-pull 5 orbs with 2x multiplier
- `determine_state_after_pull()` - Calculate state transition

## Actions (Coordination Layer)

### PlayerActions Contract

High-level game actions that compose multiple systems:

#### `claim_free_usdc()`
**Systems Used:**
- PlayerSystem → get/create player
- CurrencySystem → claim_free_usdc
- PlayerSystem → save

#### `buy_gamepack()`
**Systems Used:**
- PlayerSystem → get/create player
- CurrencySystem → spend_usdc
- GamePackSystem → create_gamepack
- PlayerSystem → save

#### `open_gamepack(gamepack_id)`
**Systems Used:**
- GamePackSystem → open_gamepack (state transition)
- GameSystem → create_game
- GamePackSystem → save

#### `start_game(gamepack_id)`
**Systems Used:**
- GameSystem → start_game (deduct moonrocks)
- OrbInventorySystem → initialize_orb_pool
- OrbInventorySystem → orbs_to_effects
- GameSystem → save

#### `pull_orb(gamepack_id)`
**Systems Used:**
- PullSystem → pull_orb
  - Internally: OrbEffectsSystem, HealthSystem, PointsSystem
- GameSystem → save
- GamePackSystem → save (if game over)

#### `confirm_five_or_die(gamepack_id, confirmed)`
**Systems Used:**
- PullSystem → execute_five_or_die (if confirmed)
  - Internally: MultiplierSystem, OrbEffectsSystem
- GameSystem → state transition
- GamePackSystem → save (if game over)

#### `cash_out(gamepack_id)`
**Systems Used:**
- PointsSystem → cash_out_points
- GameSystem → end_game
- GamePackSystem → save

#### `enter_shop(gamepack_id)`
**Systems Used:**
- CurrencySystem → spend_moonrocks
- PointsSystem → convert_points_to_glitch_chips
- GameSystem → transition_to_shop
- ShopSystem → refresh_shop
- GameSystem → save
- OrbInventorySystem → save

#### `buy_orb(gamepack_id, orb_id)`
**Systems Used:**
- ShopSystem → get_orb_price
- CurrencySystem → spend_glitch_chips
- ShopSystem → purchase_orb
- GameSystem → save
- OrbInventorySystem → save

#### `next_level(gamepack_id)`
**Systems Used:**
- GameSystem → advance_to_next_level
- OrbInventorySystem → orbs_to_effects
- GameSystem → save

## System Composition Benefits

### 1. Testability
Each system can be tested in isolation:
```cairo
// Test HealthSystem independently
let mut game_data = new_game_data();
HealthSystemTrait::apply_damage(ref game_data, 2);
assert(game_data.hp == 3, 'Damage not applied');
```

### 2. Reusability
Systems can be composed in different ways:
```cairo
// Same systems, different composition
PullSystemTrait::pull_orb(ref game_data);  // Single pull
PullSystemTrait::execute_five_or_die(ref game_data);  // 5 auto-pulls
```

### 3. Upgradeability
Individual systems can be replaced without touching others:
```cairo
// V2: New shop pricing algorithm
impl ShopSystemV2 {
    fn get_orb_price(...) -> u32 {
        // New pricing logic
    }
}
```

### 4. Clarity
Single responsibility makes code easy to understand:
- Need to know how damage works? → HealthSystem
- Need to know how points are awarded? → PointsSystem
- Need to know shop pricing? → ShopSystem

## Error Handling

All systems return `Result<T, GameError>` for operations that can fail:

```cairo
pub enum GameError {
    InvalidStateTransition,
    InvalidData,
    InsufficientUsdc,
    InsufficientMoonrocks,
    InsufficientGlitchChips,
    ZeroPointsToCashOut,
    InvalidOrbId,
    PlayerNotFound,
    GameNotFound,
    GamePackNotFound,
}
```

## Key Design Decisions

### 1. Systems as Traits
All systems implemented as traits, making them mockable and testable.

### 2. No Direct System-to-System Calls
Systems only interact through:
- Shared world state (models)
- Function composition in Actions layer

### 3. Stateless Systems
All mutable state in models, systems are pure logic.

### 4. Clear Ownership
- Models own data structure
- Systems own business logic
- Actions own coordination flow

## Future Enhancements

Potential additions that fit this architecture:

1. **LeaderboardSystem** - Track high scores
2. **AchievementSystem** - Unlock achievements
3. **EventSystem** - Emit detailed game events
4. **AnalyticsSystem** - Track player metrics
5. **MultiplayerSystem** - Competitive/cooperative modes
6. **PowerUpSystem** - Additional orb types
7. **SeasonSystem** - Time-based events

All can be added without modifying existing systems!

## Comparison with v2

| Aspect | v2 | v3 |
|--------|----|----|
| Architecture | Monolithic contract | Modular ECS systems |
| Testability | Hard to test isolated logic | Each system testable |
| Reusability | Duplicated code | Composable systems |
| Upgradability | Replace entire contract | Replace individual systems |
| Readability | Mixed concerns | Single responsibility |
| State Management | Scattered in contract | Centralized in models |

## Usage Example

```cairo
// Player starts their journey
player_actions.claim_free_usdc();           // CurrencySystem
player_actions.buy_gamepack();              // CurrencySystem + GamePackSystem
player_actions.open_gamepack(1);            // GamePackSystem + GameSystem
player_actions.start_game(1);               // GameSystem + OrbInventorySystem

// Gameplay loop
player_actions.pull_orb(1);                 // PullSystem + OrbEffectsSystem
player_actions.pull_orb(1);                 // ...player pulls until milestone
player_actions.enter_shop(1);               // CurrencySystem + ShopSystem
player_actions.buy_orb(1, 3);               // ShopSystem + CurrencySystem
player_actions.next_level(1);               // GameSystem + OrbInventorySystem

// Endgame
player_actions.cash_out(1);                 // PointsSystem + GameSystem
```

---

**Built with Dojo ECS principles for maximum modularity and composability.**
