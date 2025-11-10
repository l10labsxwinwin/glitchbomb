import { useState, useMemo, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '@/components/GameContainer'
import { LineDataPoint, OrbCategory, OrbEffect, PointType, type GameData, type Orb, orbCategoryColors } from '@/components/GameDataTypes'
import type { ChartConfig } from '@/components/ui/chart'
import { useGames } from '@/hooks/games'
import { usePullOrb } from '@/hooks/pullOrb'

export const Route = createFileRoute('/testnet/gamepack/$id/level')({
  component: LevelStateRoute,
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

function LevelStateRoute() {
  const { id } = Route.useParams()
  const gamepackId = Number(id)
  const { games } = useGames(gamepackId)
  const { pullOrb: pullOrbContract } = usePullOrb()

  const latestGame = useMemo(() => {
    if (games.length === 0) return null
    return games.reduce((latest, current) => {
      const currentId = Number(current.game_id)
      const latestId = Number(latest.game_id)
      return currentId > latestId ? current : latest
    })
  }, [games])

  // Use actual counts from Game data but keep mock structure for now (until we convert OrbEffectEnum to Orb)
  const [pullableOrbs, setPullableOrbs] = useState<Orb[]>([...initialPullableOrbs])
  const [consumedOrbs, setConsumedOrbs] = useState<Orb[]>([])

  // Update pullable orbs count when game data changes
  useEffect(() => {
    if (latestGame) {
      const count = latestGame.data.pullable_orbs.length
      setPullableOrbs(prev => {
        if (prev.length !== count) {
          // Create array with actual count, using mock orbs as template
          return Array(count).fill(null).map((_, i) => 
            prev[i] || prev[0] || initialPullableOrbs[0]
          )
        }
        return prev
      })
      // Update consumed orbs count
      const consumedCount = latestGame.data.consumed_orbs.length
      setConsumedOrbs(prev => {
        if (prev.length !== consumedCount) {
          return Array(consumedCount).fill(null).map((_, i) => 
            prev[i] || prev[0] || initialPullableOrbs[0]
          )
        }
        return prev
      })
    }
  }, [latestGame])

  // Function to pull an orb: calls the contract function
  const pullOrb = async () => {
    await pullOrbContract(gamepackId)
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

  // Convert Game type to GameData, using direct matches from actual Game data
  const gameData: GameData = {
    moonRocks: latestGame 
      ? Number(latestGame.data.temp_moonrocks) + Number(latestGame.data.moonrocks_earned) - Number(latestGame.data.moonrocks_spent)
      : 80,
    points: latestGame ? Number(latestGame.data.points) : 15,
    glitchChips: latestGame ? Number(latestGame.data.glitch_chips) : 36,
    milestone: latestGame ? Number(latestGame.data.milestone) : 30,
    multiplier: latestGame ? Number(latestGame.data.multiplier) : 2.5,
    bombs: 5, // Keep as mock for now
    health: latestGame ? Number(latestGame.data.hp) : 5,
    pullable_orbs: pullableOrbs, // Using arrays with actual counts from latestGame.data.pullable_orbs.length
    consumed_orbs: consumedOrbs, // Using arrays with actual counts from latestGame.data.consumed_orbs.length
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
