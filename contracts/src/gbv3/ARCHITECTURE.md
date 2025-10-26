# GlitchBomb v3 - System Architecture Diagram

## Layer Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER / FRONTEND                          │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  ACTIONS LAYER (Coordination)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            player_actions.cairo                       │   │
│  │  - claim_free_usdc()                                 │   │
│  │  - buy_gamepack()                                    │   │
│  │  - open_gamepack()                                   │   │
│  │  - start_game()                                      │   │
│  │  - pull_orb()                                        │   │
│  │  - confirm_five_or_die()                             │   │
│  │  - cash_out()                                        │   │
│  │  - enter_shop()                                      │   │
│  │  - buy_orb()                                         │   │
│  │  - next_level()                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   SYSTEMS LAYER (Logic)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Player     │  │  GamePack    │  │    Game      │      │
│  │   System     │  │   System     │  │   System     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Currency    │  │   Points     │  │   Health     │      │
│  │   System     │  │   System     │  │   System     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Multiplier   │  │     Shop     │  │  Orb Inv.    │      │
│  │   System     │  │   System     │  │   System     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Orb Effects  │  │    Pull      │                         │
│  │   System     │  │   System     │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  MODELS LAYER (Data / ECS)                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Player    │  │   GamePack   │  │     Game     │      │
│  │   (Entity)   │  │   (Entity)   │  │   (Entity)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ OrbsInGame   │  │     Orb      │                         │
│  │  (Entity)    │  │   (Struct)   │                         │
│  └──────────────┘  └──────────────┘                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Enums (Components)                     │     │
│  │  - PlayerState                                      │     │
│  │  - GamePackState                                    │     │
│  │  - GameState                                        │     │
│  │  - OrbEffect                                        │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DOJO WORLD CONTRACT                       │
│                   (Storage & Permissions)                    │
└─────────────────────────────────────────────────────────────┘
```

## System Dependencies

### Core Systems (Independent)
```
PlayerSystem ──► No dependencies
HealthSystem ──► No dependencies
MultiplierSystem ──► No dependencies
```

### Resource Systems (Dependent on Models)
```
CurrencySystem ──► Player, GameData
PointsSystem ──► GameData
```

### Entity Management Systems
```
GamePackSystem ──► GamePack
GameSystem ──► Game
OrbInventorySystem ──► OrbsInGame, Orb
```

### Shop System
```
ShopSystem ──► OrbsInGame, Orb
```

### Complex Systems (Multiple Dependencies)
```
OrbEffectsSystem ──► HealthSystem
                 ──► PointsSystem
                 ──► MultiplierSystem
                 ──► CurrencySystem

PullSystem ──► OrbEffectsSystem
           ──► HealthSystem
           ──► PointsSystem
```

## Action Flow Example: `pull_orb()`

```
┌─────────────────────────────────────────────────────────────┐
│ USER CALLS: player_actions.pull_orb(gamepack_id)            │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ ACTION: Read GamePack and Game from World                   │
│    world.read_model((player, gamepack_id))                  │
│    world.read_model((player, gamepack_id, game_id))         │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ SYSTEM: PullSystem::pull_orb(ref game.data)                │
│  ├─► Shuffle pullable_orbs                                  │
│  ├─► Pop front orb                                          │
│  ├─► Increment pull_number                                  │
│  ├─► OrbEffectsSystem::apply_orb_effect()                  │
│  │    ├─► Match on OrbEffect                               │
│  │    ├─► PointsSystem::add_points()      (if Point)       │
│  │    ├─► HealthSystem::apply_damage()    (if Bomb)        │
│  │    ├─► CurrencySystem::earn_moonrocks() (if Moonrocks)  │
│  │    └─► etc...                                            │
│  └─► Determine new GameState                                │
│       ├─► Check HealthSystem::is_dead()                     │
│       ├─► Check PointsSystem::check_milestone_reached()     │
│       └─► Check pullable_orbs.is_empty()                    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ ACTION: Handle Game Over (if applicable)                    │
│  IF new_state == GameOver:                                  │
│    ├─► Update temp_moonrocks                                │
│    └─► Save GamePack                                        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ ACTION: Save Game to World                                  │
│    world.write_model(@game)                                 │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ RETURN: Transaction complete                                │
└─────────────────────────────────────────────────────────────┘
```

## System Interaction Matrix

| System | Reads From | Writes To | Calls Systems |
|--------|------------|-----------|---------------|
| PlayerSystem | Player | Player | - |
| CurrencySystem | Player, GameData | Player, GameData | - |
| GamePackSystem | GamePack | GamePack | - |
| GameSystem | Game | Game | - |
| HealthSystem | GameData | GameData | - |
| PointsSystem | GameData | GameData | - |
| MultiplierSystem | GameData | GameData | - |
| OrbInventorySystem | OrbsInGame | OrbsInGame | - |
| ShopSystem | OrbsInGame | OrbsInGame | - |
| OrbEffectsSystem | GameData | GameData | Health, Points, Multiplier, Currency |
| PullSystem | GameData | GameData | OrbEffects, Health, Points |

## Data Flow: Player Journey

```
NEW PLAYER
    │
    ├─► claim_free_usdc()
    │   └─► CurrencySystem → Player.usdc = 5
    │
    ├─► buy_gamepack()
    │   ├─► CurrencySystem → Player.usdc -= 1
    │   └─► GamePackSystem → Create GamePack
    │
    ├─► open_gamepack(1)
    │   ├─► GamePackSystem → GamePack.state = InProgress
    │   └─► GameSystem → Create Game
    │
    └─► start_game(1)
        ├─► CurrencySystem → Game.moonrocks_spent += 10
        ├─► OrbInventorySystem → Initialize orb pools
        └─► GameSystem → Game.state = Level

GAMEPLAY LOOP
    │
    ├─► pull_orb(1) [x N times]
    │   ├─► PullSystem → Pull orb
    │   ├─► OrbEffectsSystem → Apply effect
    │   ├─► HealthSystem → Update HP
    │   ├─► PointsSystem → Update points
    │   └─► GameSystem → Check state transition
    │
    ├─► enter_shop(1)
    │   ├─► CurrencySystem → Spend moonrocks
    │   ├─► PointsSystem → Convert points to chips
    │   ├─► ShopSystem → Refresh inventory
    │   └─► GameSystem → Game.state = Shop
    │
    ├─► buy_orb(1, 3) [x M times]
    │   ├─► ShopSystem → Get price
    │   ├─► CurrencySystem → Spend chips
    │   └─► ShopSystem → Update orb count/price
    │
    └─► next_level(1)
        ├─► GameSystem → Reset for next level
        └─► OrbInventorySystem → Rebuild orb pool

ENDGAME
    │
    └─► cash_out(1)
        ├─► PointsSystem → Points → Moonrocks
        ├─► GameSystem → Game.state = GameOver
        └─► GamePackSystem → Update accumulated_moonrocks
```

## Permission Model

```
World
 └─► Namespace: "glitchbomb"
      ├─► Model: Player
      │    └─► Writers: [player_actions]
      ├─► Model: GamePack
      │    └─► Writers: [player_actions]
      ├─► Model: Game
      │    └─► Writers: [player_actions]
      └─► Model: OrbsInGame
           └─► Writers: [player_actions]
```

## Key Benefits of This Architecture

### 1. **Horizontal Scalability**
Add new systems without modifying existing ones:
```
NEW: LeaderboardSystem
├─► Reads: Game (final scores)
├─► Writes: Leaderboard (new model)
└─► Independent from all other systems
```

### 2. **Vertical Composability**
Build complex actions from simple systems:
```
enter_shop() = 
    CurrencySystem.spend_moonrocks() +
    PointsSystem.convert_to_chips() +
    GameSystem.transition_state() +
    ShopSystem.refresh()
```

### 3. **Clear Boundaries**
Each layer has a specific job:
- **Models**: Define WHAT data exists
- **Systems**: Define HOW data changes
- **Actions**: Define WHEN systems run

### 4. **Testability**
Mock at any layer:
```cairo
// Unit test HealthSystem
let mut game_data = test_game_data();
HealthSystem::apply_damage(ref game_data, 3);
assert(game_data.hp == 2);

// Integration test PullSystem
mock_pull_system_with_fixed_orb(OrbEffect::Point(5));
```

### 5. **Maintainability**
Change one system without ripple effects:
```
// Update shop pricing algorithm
impl ShopSystemV2 {
    fn get_orb_price() { /* new logic */ }
}
// No other systems need changes!
```

---

**This architecture follows Dojo's ECS best practices for building scalable, maintainable on-chain games.**
