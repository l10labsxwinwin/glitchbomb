import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '../components/GameContainer'
import { LineDataPoint, OrbCategory, OrbEffect, PointType, type GameData, type Orb } from '@/components/GameDataTypes'
import type { OrbCategories } from '@/lib/frontenddatatypes'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

const initialPullableOrbs: Orb[] = [
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Health, category: OrbCategory.Health, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 2 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 2 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 3 },
  { effect: OrbEffect.Multiplier, category: OrbCategory.Multiplier, value: 1 },
  { effect: OrbEffect.Multiplier, category: OrbCategory.Multiplier, value: 1 },
  { effect: OrbEffect.GlitchChips, category: OrbCategory.Special, value: 1 },
  { effect: OrbEffect.Moonrocks, category: OrbCategory.Special, value: 2 },
  { effect: OrbEffect.PointsPerAnyOrb, category: OrbCategory.Special, value: 3 },
  { effect: OrbEffect.PointsPerBombPulled, category: OrbCategory.Special, value: 1 },
  { effect: OrbEffect.PointsPerPointOrb, category: OrbCategory.Special, value: 2 },
  { effect: OrbEffect.RewindPoint, category: OrbCategory.Special, value: 1 },
  { effect: OrbEffect.BombImmunity, category: OrbCategory.Special, value: 1 },
]

const mockLineData: LineDataPoint[] = [
  { pull_number: 1, level: 1, aggregate_score: -10, point_type: PointType.NonBomb },
  { pull_number: 2, level: 1, aggregate_score: -10, point_type: PointType.NonBomb },
  { pull_number: 3, level: 1, aggregate_score: -5, point_type: PointType.NonBomb },
  { pull_number: 4, level: 1, aggregate_score: 5, point_type: PointType.NonBomb },
  { pull_number: 5, level: 1, aggregate_score: 5, point_type: PointType.Bomb },
  { pull_number: 6, level: 1, aggregate_score: 8, point_type: PointType.NonBomb },
  { pull_number: 7, level: 1, aggregate_score: 18, point_type: PointType.NonBomb },
  { pull_number: 8, level: 1, aggregate_score: 25, point_type: PointType.NonBomb },
]

// Convert Orb[] to OrbCategories format
const convertOrbsToCategories = (orbs: Orb[]): OrbCategories => {
  const result: OrbCategories = {
    health: [],
    bomb: [],
    multiplier: [],
    point: [],
    special: [],
  }

  for (const orb of orbs) {
    const entry = { effect: orb.effect, value: orb.value }
    
    switch (orb.category) {
      case OrbCategory.Health:
        result.health.push(entry)
        break
      case OrbCategory.Bomb:
        result.bomb.push(entry)
        break
      case OrbCategory.Multiplier:
        result.multiplier.push(entry)
        break
      case OrbCategory.Point:
        result.point.push(entry)
        break
      case OrbCategory.Special:
        result.special.push(entry)
        break
    }
  }

  return result
}

function FreePlay() {
  const [pullableOrbs, setPullableOrbs] = useState<Orb[]>([...initialPullableOrbs])
  const [consumedOrbs, setConsumedOrbs] = useState<Orb[]>([])

  // Function to pull an orb: removes one from pullable_orbs and adds to consumed_orbs
  const pullOrb = () => {
    if (pullableOrbs.length > 0) {
      const pulledOrb = pullableOrbs[0] // Get first orb
      setPullableOrbs((prev) => prev.slice(1)) // Remove first orb
      setConsumedOrbs((prev) => [...prev, pulledOrb]) // Add to consumed
    }
  }

  // Convert pullable orbs to orb categories format
  const orbCategories = useMemo(() => {
    return convertOrbsToCategories(pullableOrbs)
  }, [pullableOrbs])

  const gameData: GameData = {
    moonRocks: 80,
    points: 15,
    glitchChips: 36,
    milestone: 30,
    multiplier: 2.5,
    bombs: 5,
    health: 5,
    pullable_orbs: pullableOrbs,
    consumed_orbs: consumedOrbs,
  }

  return (
    <GameContainer 
      gameData={gameData}
      orbCategories={orbCategories}
      lineData={mockLineData}
      onPullOrb={pullOrb}
    />
  )
}

