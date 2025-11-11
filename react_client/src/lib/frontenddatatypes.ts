import { OrbEffect } from '@/components/GameDataTypes'
import type { OrbEffectEnum } from '@/bindings/typescript/models.gen'

export type OrbCategories = {
  health: Array<{ effect: OrbEffect; value: number }>
  bomb: Array<{ effect: OrbEffect; value: number }>
  multiplier: Array<{ effect: OrbEffect; value: number }>
  point: Array<{ effect: OrbEffect; value: number }>
  special: Array<{ effect: OrbEffect; value: number }>
}

/**
 * Converts an array of OrbEffectEnum to an OrbCategories object.
 * Categorizes effects as follows:
 * - Multiplier → multiplier
 * - Health → health
 * - Bomb → bomb
 * - Point, PointPerOrbRemaining, PointPerBombPulled → point
 * - Everything else → special
 */
export function to_orbcategory(orbs: Array<OrbEffectEnum>): OrbCategories {
  const result: OrbCategories = {
    health: [],
    bomb: [],
    multiplier: [],
    point: [],
    special: [],
  }

  for (const orb of orbs) {
    if (!orb) continue

    let effectName: string | null = null
    let value: number = 0

    // Handle different CairoCustomEnum structures
    if (typeof orb === 'string') {
      effectName = orb
    } else if (typeof orb === 'object') {
      // Check if it has a variant property (e.g., { variant: { Point: 8 } })
      if ('variant' in orb && orb.variant && typeof orb.variant === 'object') {
        const variant = orb.variant as Record<string, any>
        const keys = Object.keys(variant)
        if (keys.length > 0) {
          effectName = keys[0]
          const variantValue = variant[effectName]
          if (variantValue !== undefined && variantValue !== null) {
            value = Number(variantValue)
            if (isNaN(value)) value = 0
          }
        }
      } else {
        // Check if it's a direct enum (e.g., { PointRewind: undefined })
        const keys = Object.keys(orb).filter(key => key !== 'variant')
        if (keys.length > 0) {
          effectName = keys[0]
        }
      }
    }

    if (!effectName || effectName === 'Empty') continue

    // Map effect name to OrbEffect enum
    let effect: OrbEffect | null = null
    
    // Map the backend effect names to frontend OrbEffect enum
    switch (effectName) {
      case 'Point':
        effect = OrbEffect.Point
        break
      case 'PointPerOrbRemaining':
        effect = OrbEffect.PointsPerAnyOrb // Note: backend uses PointPerOrbRemaining, frontend uses PointsPerAnyOrb
        break
      case 'PointPerBombPulled':
        effect = OrbEffect.PointsPerBombPulled
        break
      case 'PointRewind':
        effect = OrbEffect.RewindPoint
        break
      case 'GlitchChips':
        effect = OrbEffect.GlitchChips
        break
      case 'Moonrocks':
        effect = OrbEffect.Moonrocks
        break
      case 'Health':
        effect = OrbEffect.Health
        break
      case 'Bomb':
        effect = OrbEffect.Bomb
        break
      case 'Multiplier':
        effect = OrbEffect.Multiplier
        break
      case 'BombImmunity':
        effect = OrbEffect.BombImmunity
        break
      default:
        continue
    }

    if (!effect) continue

    // Categorize the effect
    const entry = { effect, value }

    if (effect === OrbEffect.Multiplier) {
      result.multiplier.push(entry)
    } else if (effect === OrbEffect.Health) {
      result.health.push(entry)
    } else if (effect === OrbEffect.Bomb) {
      result.bomb.push(entry)
    } else if (
      effect === OrbEffect.Point ||
      effect === OrbEffect.PointsPerAnyOrb ||
      effect === OrbEffect.PointsPerBombPulled
    ) {
      result.point.push(entry)
    } else {
      result.special.push(entry)
    }
  }

  return result
}

