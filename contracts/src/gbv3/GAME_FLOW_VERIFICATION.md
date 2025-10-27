# Game Flow Verification - next_game() Function

## Overview

The `next_game()` function allows players to start a new game within the same gamepack after completing a game (reaching GameOver state).

## Function Signature

```cairo
fn next_game(ref self: ContractState, gamepack_id: u32)
```

## Complete Game Loop Flow

### Initial Setup
1. **claim_free_usdc()** - Player gets 5 USDC
2. **buy_gamepack()** - Player spends 1 USDC, gets gamepack_id = 1
3. **open_gamepack(1)** - Creates first game (game_id = 1) with state = New

### Game 1 Flow
4. **start_game(1)** - Game 1: New → Level (costs 10 moonrocks)
5. **pull_orb(1)** - Pull orbs, play the game
6. **enter_shop(1)** (optional) - If reached milestone
7. **buy_orb(1, orb_id)** (optional) - Purchase orbs
8. **next_level(1)** (optional) - Advance to next level
9. **cash_out(1)** or die - Game 1 ends: state = GameOver

### Starting Game 2 (NEW!)
10. **next_game(1)** - Creates game_id = 2 with state = New
    - Verifies game_id = 1 is in GameOver state
    - Increments current_game_id: 1 → 2
    - Creates new game with game_id = 2
    - Preserves accumulated_moonrocks from gamepack
    - Sets game state = New

### Game 2 Flow (Same as Game 1)
11. **start_game(1)** - Game 2: New → Level
12. **pull_orb(1)** - Play game 2
13. ... (same gameplay loop)
14. **cash_out(1)** or die - Game 2 ends: state = GameOver

### Continue Pattern
15. **next_game(1)** - Creates game_id = 3
16. ... repeat up to game_id = 10

### Gamepack Completion
After game_id = 10 reaches GameOver:
- **next_game(1)** will:
  - Check if next_game_id (11) > MAX_GAMES_PER_PACK (10)
  - Transition gamepack state to Completed
  - Panic with "GamePack completed - maximum games reached"

## State Transitions

### GamePack States
```
Unopened → InProgress (via open_gamepack)
InProgress → Completed (via next_game when max reached)
InProgress → EndedEarly (manual end, not implemented in actions)
```

### Game States
```
New → Level (via start_game)
Level → LevelComplete (via pull_orb when milestone reached)
Level → FiveOrDiePhase (via pull_orb when FiveOrDie orb pulled)
Level → GameOver (via pull_orb when HP = 0 or orbs empty)
LevelComplete → Shop (via enter_shop)
LevelComplete → GameOver (via cash_out)
FiveOrDiePhase → Level (via confirm_five_or_die with confirmed=false)
FiveOrDiePhase → LevelComplete (via confirm_five_or_die if milestone reached)
FiveOrDiePhase → GameOver (via confirm_five_or_die if HP = 0)
Shop → Level (via next_level)
```

## Validation Rules

### next_game() Requirements
1. ✅ Current game MUST be in GameOver state
2. ✅ Current game ID must be < MAX_GAMES_PER_PACK
3. ✅ GamePack must be in InProgress state (automatically true if game exists)

### next_game() Actions
1. ✅ Reads current game and validates state = GameOver
2. ✅ Calculates next_game_id = current_game_id + 1
3. ✅ Checks if next_game_id <= MAX_GAMES_PER_PACK
4. ✅ If max reached: completes gamepack and panics
5. ✅ If not max: increments gamepack.current_game_id
6. ✅ Creates new game with:
   - game_id = next_game_id
   - state = New
   - temp_moonrocks = gamepack.accumulated_moonrocks
7. ✅ Saves gamepack with updated current_game_id

## Data Persistence Between Games

### Carried Forward (via gamepack.accumulated_moonrocks)
- ✅ Moonrocks earned from previous games
- ✅ Moonrocks earned from cash-outs

### Reset for Each Game
- ✅ Level (starts at 1)
- ✅ HP (starts at MAX_HP = 5)
- ✅ Points (starts at 0)
- ✅ Multiplier (starts at 100)
- ✅ Glitch Chips (starts at 0)
- ✅ Pull number (starts at 0)
- ✅ Orb inventory (fresh orb pool)

## Error Scenarios

### Error 1: Calling next_game() when current game not GameOver
```cairo
// Game is still in Level state
next_game(1) → panic!("Current game must be in GameOver state")
```

### Error 2: Calling next_game() after max games reached
```cairo
// Already played 10 games
next_game(1) → panic!("GamePack completed - maximum games reached")
// + gamepack.state = Completed
```

### Error 3: Calling start_game() without calling next_game()
```cairo
// After game 1 ends (GameOver)
start_game(1) → panic!("InvalidStateTransition")
// Because game 1 is GameOver, not New
```

## Correct Usage Pattern

### Single Game Example
```cairo
buy_gamepack()           // gamepack_id = 1
open_gamepack(1)         // game_id = 1, state = New
start_game(1)            // game 1: New → Level
pull_orb(1)              // ... gameplay
cash_out(1)              // game 1: state = GameOver
```

### Multi-Game Example (NEW!)
```cairo
// Game 1
buy_gamepack()           // gamepack_id = 1
open_gamepack(1)         // game_id = 1, state = New
start_game(1)            // game 1: New → Level
pull_orb(1)              // ... gameplay
cash_out(1)              // game 1: state = GameOver

// Game 2
next_game(1)             // game_id = 2, state = New
start_game(1)            // game 2: New → Level
pull_orb(1)              // ... gameplay
cash_out(1)              // game 2: state = GameOver

// Game 3
next_game(1)             // game_id = 3, state = New
start_game(1)            // game 3: New → Level
// ... continue pattern up to 10 games
```

## Frontend Integration

### Updated Action List
All existing actions work the same, plus one new action:

```typescript
// Existing actions (work same as before)
claimFreeUsdc()
buyGamepack()
openGamepack(gamepackId)
startGame(gamepackId)
pullOrb(gamepackId)
confirmFiveOrDie(gamepackId, confirmed)
cashOut(gamepackId)
enterShop(gamepackId)
buyOrb(gamepackId, orbId)
nextLevel(gamepackId)

// NEW action
nextGame(gamepackId)  // Call after game reaches GameOver to start next game
```

### UI Flow
```
After game ends (GameOver state):
┌─────────────────────────────┐
│  GAME OVER                  │
│                             │
│  Final Score: 250 points    │
│  Moonrocks Earned: 50       │
│                             │
│  [Cash Out & End]           │ ← cash_out() + done
│  [Start Next Game]          │ ← next_game() + start_game()
└─────────────────────────────┘
```

## Testing Checklist

- [ ] next_game() works after cash_out
- [ ] next_game() works after dying (HP = 0)
- [ ] next_game() works after orbs run out
- [ ] next_game() preserves moonrocks correctly
- [ ] next_game() creates game with state = New
- [ ] next_game() increments game_id correctly
- [ ] start_game() works after next_game()
- [ ] Full gameplay loop works for game 2
- [ ] Moonrocks accumulate across games
- [ ] next_game() fails if current game not GameOver
- [ ] next_game() completes gamepack after game 10
- [ ] Cannot start game 11

## Implementation Summary

### New Function Added
- **Location**: `contracts/src/gbv3/actions/player_actions.cairo`
- **Function**: `next_game(gamepack_id: u32)`
- **Lines**: ~40 lines of code
- **Dependencies**: 
  - GameSystemTrait::create_game
  - GamePackSystemTrait::complete_gamepack
  - MAX_GAMES_PER_PACK constant

### Systems Composed
1. **GameSystem** - create_game()
2. **GamePackSystem** - complete_gamepack(), save_gamepack()

### No Changes Required To
- ✅ All existing systems (no modifications needed)
- ✅ All existing actions (work exactly the same)
- ✅ Models (no schema changes)
- ✅ Game logic (pure addition)

## Conclusion

The `next_game()` function enables the complete game loop:
1. Player can play multiple games per gamepack
2. Moonrocks accumulate across games
3. Each game starts fresh (level 1, full HP)
4. Gamepack automatically completes after 10 games
5. All existing actions work identically
6. Simple, clean interface: just call next_game() after GameOver

**Status**: ✅ Implemented and Compiled Successfully
