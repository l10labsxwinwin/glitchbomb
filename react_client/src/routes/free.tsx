import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '../components/GameContainer'
import { LineDataPoint, OrbCategory, OrbEffect, PointType, type GameData, type Orb, orbCategoryColors } from '@/components/GameDataTypes'
import type { ChartConfig } from '@/components/ui/chart'

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

// Group pullable orbs by category
const groupOrbsByCategory = (orbs: Orb[]) => {
  const grouped = orbs.reduce((acc, orb) => {
    const category = orb.category
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<OrbCategory, number>)
  
  return grouped
}

const categoryLabels: Record<OrbCategory, string> = {
  [OrbCategory.Point]: "Point",
  [OrbCategory.Health]: "Health",
  [OrbCategory.Bomb]: "Bomb",
  [OrbCategory.Multiplier]: "Multiplier",
  [OrbCategory.Special]: "Special",
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

  // Calculate donut chart data based on current pullable orbs
  const orbCategoryCounts = groupOrbsByCategory(pullableOrbs)
  const donutChartData = Object.entries(orbCategoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      category,
      value: count,
      fill: orbCategoryColors[category as OrbCategory],
    }))

  const donutChartConfig: ChartConfig = {
    value: {
      label: "Count",
    },
    ...Object.entries(orbCategoryCounts).reduce((acc, [category]) => {
      if (orbCategoryCounts[category as OrbCategory] > 0) {
        acc[category] = {
          label: categoryLabels[category as OrbCategory],
          color: orbCategoryColors[category as OrbCategory],
        }
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>),
  }

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
      donutChartData={donutChartData}
      donutChartConfig={donutChartConfig}
      lineData={mockLineData}
      onPullOrb={pullOrb}
    />
  )
}

