# Next Game Button - Frontend Implementation

## ✅ Implementation Complete

Added a "Start Next Game" button to the GameCard component that appears when a game reaches GameOver state, allowing players to seamlessly continue playing multiple games within the same gamepack.

## Changes Made

### 1. GameCard Component (`svkit/src/lib/components/GameCard.svelte`)

**Added Props:**
```typescript
interface Props {
  // ... existing props
  onNextGame?: () => void;
  startingNextGame?: boolean;
}
```

**Added Button:**
```svelte
{#if onNextGame && game.state === 'GameOver'}
  <button
    onclick={onNextGame}
    disabled={startingNextGame}
    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-bold text-sm"
  >
    {startingNextGame ? 'Starting Next Game...' : '🎮 Start Next Game'}
  </button>
{/if}
```

**Button Behavior:**
- Only shows when `game.state === 'GameOver'`
- Green color to indicate new game opportunity
- Disabled while processing
- Shows loading state "Starting Next Game..."

### 2. Gamepack Page (`svkit/src/routes/singleplayer/[playerId]/gamepack/[gamepackId]/+page.svelte`)

**Added State:**
```typescript
let startingNextGame = $state(false);
```

**Added Function:**
```typescript
async function nextGame() {
  if (!$account || !$dojoProvider || !gamepackId) return;

  startingNextGame = true;
  try {
    console.log('Starting next game...');
    const world = setupWorld($dojoProvider);
    const gamepackIdInt = parseInt(gamepackId);
    const result = await world.player_actions.nextGame($account, gamepackIdInt);
    console.log('✅ Next game created!', result);
    toasts.add('Next game started! You can now play again.', 'success');
  } catch (err) {
    console.error('Failed to start next game:', err);
    toasts.add('Failed to start next game', 'error');
  } finally {
    startingNextGame = false;
  }
}
```

**Updated GameCard Props:**
```svelte
<GameCard
  {game}
  onStartGame={startGame}
  onPullOrb={pullOrb}
  onCashOut={cashOut}
  onNextGame={nextGame}          // NEW!
  {startingGames}
  {pullingOrbs}
  {cashingOut}
  {startingNextGame}              // NEW!
/>
```

## User Flow

### Before (Single Game Only)
```
1. Open Gamepack → Game 1 created
2. Start Game → Play game
3. Cash Out → Game Over
4. [No option to continue] → Must buy new gamepack
```

### After (Multiple Games)
```
1. Open Gamepack → Game 1 created
2. Start Game → Play game
3. Cash Out → Game Over
4. [🎮 Start Next Game button appears!]
5. Click "Start Next Game" → Game 2 created
6. Click "Start Game" → Play game 2
7. Cash Out → Game Over
8. [🎮 Start Next Game button appears!]
9. Click "Start Next Game" → Game 3 created
... up to 3 games per gamepack
```

## Visual Design

### Game Over State Display
```
┌─────────────────────────────────────────────────┐
│ Game #1              State: GameOver            │
├─────────────────────────────────────────────────┤
│ Stats:                                          │
│ Level: 5    Pull #: 42   Milestone: 70          │
│ HP: 0       Multiplier: 250   Points: 65        │
│ MR Spent: 10   MR Earned: 65   Temp MR: 155     │
│                                                  │
│ Pullable Orbs (0)     Consumed Orbs (42)        │
│ - Empty -             [list of consumed orbs]   │
├─────────────────────────────────────────────────┤
│ [Cash Out] [🎮 Start Next Game]                │
└─────────────────────────────────────────────────┘
```

### Button States

| State | Button Text | Color | Clickable |
|-------|------------|-------|-----------|
| Ready | 🎮 Start Next Game | Green | ✅ Yes |
| Processing | Starting Next Game... | Gray | ❌ No |
| After Click | (Button disappears, new game appears) | - | - |

## Error Handling

### Scenario 1: Max Games Reached (3 games)
```typescript
// After game 3 ends
nextGame() → Error: "GamePack completed - maximum games reached"
Toast: "Failed to start next game"
// Gamepack state transitions to Completed
```

### Scenario 2: Called When Not GameOver
```typescript
// Game still in Level state
nextGame() → Error: "Current game must be in GameOver state"
Toast: "Failed to start next game"
```

### Scenario 3: Network Error
```typescript
nextGame() → Network timeout
Toast: "Failed to start next game"
startingNextGame = false // Button becomes clickable again
```

## Real-time Updates

Thanks to GraphQL subscriptions, the UI updates automatically:

1. **After nextGame() succeeds:**
   - New Game entity appears in the games list
   - GamePack's current_game_id increments
   - New OrbsInGame entity created
   - All updates happen automatically via subscription

2. **Button automatically disappears** when new game is created because:
   - New game has `state: 'New'` (not GameOver)
   - GameCard only shows button when `game.state === 'GameOver'`

## Testing Checklist

- [x] Button only shows when game is GameOver
- [ ] Button calls nextGame() function
- [ ] Button shows loading state while processing
- [ ] Success toast appears on success
- [ ] Error toast appears on failure
- [ ] New game appears in UI after success
- [ ] Can start the new game with "Start Game" button
- [ ] Can play multiple games in sequence (1 → 2 → 3)
- [ ] Gamepack completes after 3rd game
- [ ] Cannot start 4th game (shows error)
- [ ] Moonrocks accumulate correctly across games

## Files Modified

1. `svkit/src/lib/components/GameCard.svelte`
   - Added `onNextGame` prop
   - Added `startingNextGame` prop
   - Added conditional button for GameOver state

2. `svkit/src/routes/singleplayer/[playerId]/gamepack/[gamepackId]/+page.svelte`
   - Added `startingNextGame` state
   - Added `nextGame()` async function
   - Passed props to GameCard

## Next Steps

1. **Regenerate TypeScript bindings** to include `nextGame` function
2. **Deploy contracts** with next_game() function
3. **Test the flow** end-to-end:
   - Buy gamepack
   - Play game 1 to completion
   - Click "Start Next Game"
   - Play game 2 to completion
   - Click "Start Next Game"
   - Play game 3 to completion
   - Verify error on trying to start game 4

## Benefits

✅ **Seamless UX** - No need to leave the page or buy new gamepack
✅ **Clear Visual Feedback** - Green button with emoji stands out
✅ **Loading States** - User knows action is processing
✅ **Error Handling** - Clear feedback if something goes wrong
✅ **Automatic Updates** - GraphQL subscription keeps UI in sync
✅ **Conditional Display** - Button only appears when relevant

---

**Status**: ✅ Frontend Implementation Complete  
**Ready For**: Contract deployment and end-to-end testing
