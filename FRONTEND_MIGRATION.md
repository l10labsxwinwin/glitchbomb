# Frontend Migration Guide - v2 to v3

## Changes Made

### 1. GraphQL Schema Updates

All GraphQL queries updated to use new field names:

**Changed:**
- `player_id` → `player`

**Files Updated:**
- `svkit/src/routes/singleplayer/queries.ts`
- `svkit/src/routes/data/players/+page.svelte`
- `svkit/src/routes/data/gamepacks/+page.svelte`
- `svkit/src/routes/data/games/+page.svelte`
- `svkit/src/routes/data/orbs/+page.svelte`
- `svkit/src/lib/components/*.svelte`
- `svkit/src/routes/singleplayer/+page.svelte`
- `svkit/src/routes/singleplayer/[playerId]/gamepack/[gamepackId]/+page.svelte`

### 2. Helper Functions Updated

**File:** `svkit/src/lib/keys.ts`

Function parameters renamed for consistency:
```typescript
// Old
export function getPlayerKey(player_id: string)
export function getGamePackKey(player_id: string, gamepack_id: number)

// New
export function getPlayerKey(player: string)
export function getGamePackKey(player: string, gamepack_id: number)
```

### 3. Contract References Updated

**Contract name changed:**
- `gb_contract_v2` → `player_actions`

**Files Updated:**
- `svkit/src/routes/singleplayer/+page.svelte`
- `svkit/src/routes/singleplayer/[playerId]/gamepack/[gamepackId]/+page.svelte`

### 4. Model Field Mapping

| Model | Old Field | New Field |
|-------|-----------|-----------|
| Player | player_id | player |
| GamePack | player_id | player |
| Game | player_id | player |
| OrbsInGame | player_id | player |

All models now use `player: ContractAddress` as the key field instead of `player_id`.

## Next Steps Required

### 1. Regenerate TypeScript Bindings

You need to regenerate the TypeScript bindings for the new contracts:

```bash
cd contracts
sozo build
cd ../svkit
# Generate new bindings based on your setup
```

The generated files will be in:
- `svkit/src/lib/typescript/contracts.gen.ts`
- `svkit/src/lib/typescript/models.gen.ts`

### 2. Update manifest.json

Make sure your manifest points to the new deployed contracts with the correct namespace `glitchbomb` and contract name `player_actions`.

### 3. Deploy New Contracts

Deploy the v3 contracts:

```bash
cd contracts
sozo migrate apply
```

### 4. Update Torii

Ensure Torii is indexing the new contracts. Update `torii_dev.toml` if needed.

## Contract Function Names

All function names remain the same between v2 and v3:

| Function | v2 | v3 | Status |
|----------|----|----|--------|
| claim_free_usdc | ✓ | ✓ | ✅ Same |
| buy_gamepack | ✓ | ✓ | ✅ Same |
| open_gamepack | ✓ | ✓ | ✅ Same |
| start_game | ✓ | ✓ | ✅ Same |
| pull_orb | ✓ | ✓ | ✅ Same |
| confirm_five_or_die | ✓ | ✓ | ✅ Same |
| cash_out | ✓ | ✓ | ✅ Same |
| enter_shop | ✓ | ✓ | ✅ Same |
| buy_orb | ✓ | ✓ | ✅ Same |
| next_level | ✓ | ✓ | ✅ Same |

## Testing Checklist

- [ ] Regenerate TypeScript bindings
- [ ] Deploy v3 contracts to testnet
- [ ] Update manifest references
- [ ] Test player registration (claim_free_usdc)
- [ ] Test gamepack purchase
- [ ] Test gamepack opening
- [ ] Test game start
- [ ] Test orb pulling
- [ ] Test five-or-die mechanic
- [ ] Test cash out
- [ ] Test shop entry
- [ ] Test orb purchase
- [ ] Test level progression
- [ ] Verify GraphQL subscriptions work
- [ ] Verify all data displays correctly

## Known Changes

### Namespace
- Old: `glitchbombv2`
- New: `glitchbomb` (under `gbv3` module)

### Contract Structure
- Old: Single monolithic contract `gb_contract_v2`
- New: Modular system with `player_actions` coordinator

### Model Keys
- All entity models now use `player` instead of `player_id` as the primary key field

## Rollback Plan

If you need to rollback:

1. Revert all `.svelte` and `.ts` files:
   ```bash
   git checkout svkit/src
   ```

2. Redeploy v2 contracts if needed

3. Point frontend back to v2 manifest

## Support

The v3 contracts maintain the same external interface as v2, so the migration should be smooth once bindings are regenerated.
