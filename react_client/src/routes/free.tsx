import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '../components/GameContainer'
import { OrbCategory, OrbEffect, type GameData, type Orb } from '@/components/GameDataTypes'
import type { ChartConfig } from '@/components/ui/chart'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

const pullable_orbs: Orb[] = [
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Point, category: OrbCategory.Point, value: 1 },
  { effect: OrbEffect.Health, category: OrbCategory.Health, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
  { effect: OrbEffect.Bomb, category: OrbCategory.Bomb, value: 1 },
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

const mockGameData: GameData = {
  moonRocks: 80,
  points: 15,
  glitchChips: 36,
  milestone: 30,
  multiplier: 2.5,
  bombs: 5,
  health: 5,
  pullable_orbs,
  consumed_orbs: [],
}

// Group pullable orbs by category
const groupOrbsByCategory = (orbs: Orb[]) => {
  const grouped = orbs.reduce((acc, orb) => {
    const category = orb.category
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<OrbCategory, number>)
  
  return grouped
}

// Transform pullable orbs into donut chart format grouped by category
const orbCategoryCounts = groupOrbsByCategory(pullable_orbs)

// Map categories to colors and labels
const categoryColors: Record<OrbCategory, string> = {
  [OrbCategory.Point]: "var(--chart-1)",
  [OrbCategory.Health]: "var(--chart-2)",
  [OrbCategory.Bomb]: "var(--chart-3)",
  [OrbCategory.Multiplier]: "var(--chart-4)",
  [OrbCategory.Special]: "var(--chart-5)",
}

const categoryLabels: Record<OrbCategory, string> = {
  [OrbCategory.Point]: "Point",
  [OrbCategory.Health]: "Health",
  [OrbCategory.Bomb]: "Bomb",
  [OrbCategory.Multiplier]: "Multiplier",
  [OrbCategory.Special]: "Special",
}

const donutChartData = Object.entries(orbCategoryCounts)
  .filter(([_, count]) => count > 0)
  .map(([category, count]) => ({
    category,
    value: count,
    fill: categoryColors[category as OrbCategory],
  }))

const donutChartConfig: ChartConfig = {
  value: {
    label: "Count",
  },
  ...Object.entries(orbCategoryCounts).reduce((acc, [category]) => {
    if (orbCategoryCounts[category as OrbCategory] > 0) {
      acc[category] = {
        label: categoryLabels[category as OrbCategory],
        color: categoryColors[category as OrbCategory],
      }
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>),
}

function FreePlay() {
  return (
    <GameContainer 
      gameData={mockGameData}
      donutChartData={donutChartData}
      donutChartConfig={donutChartConfig}
    />
  )
}

