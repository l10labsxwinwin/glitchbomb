import type { Game } from '@/bindings/typescript/models.gen'

/**
 * Extracts all bomb variant values from a game's pullable_orbs array.
 * Returns an array of bomb values (e.g., [1, 2, 3] for Bomb: 1, Bomb: 2, Bomb: 3).
 * 
 * @param game - The game object containing pullable_orbs
 * @returns An array of bomb variant values, or an empty array if no bombs found
 */
export function getBombVariants(game: Game | null): number[] {
  if (!game || !game.data || !game.data.pullable_orbs) {
    return []
  }

  const bombValues: number[] = []

  for (const orb of game.data.pullable_orbs) {
    // Check if the orb has a variant property with a Bomb key
    if (orb && typeof orb === 'object' && 'variant' in orb) {
      const variant = (orb as any).variant
      if (variant && typeof variant === 'object' && 'Bomb' in variant) {
        const bombValue = Number(variant.Bomb)
        if (!isNaN(bombValue)) {
          bombValues.push(bombValue)
        }
      }
    }
  }

  return bombValues
}

