import { useState, useMemo, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '@/components/GameContainer'
import { LineDataPoint, PointType, type GameData, type Orb } from '@/components/GameDataTypes'
import { useGames } from '@/hooks/games'
import { usePullOrb } from '@/hooks/pullOrb'
import { getBombVariants } from '@/helpers/getBombVariants'
import { to_orbcategory } from '@/lib/frontenddatatypes'

export const Route = createFileRoute('/testnet/gamepack/$id/level')({
  component: LevelStateRoute,
})

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
  const [pullableOrbs, setPullableOrbs] = useState<Orb[]>([])
  const [consumedOrbs, setConsumedOrbs] = useState<Orb[]>([])

  // Update pullable orbs count when game data changes
  useEffect(() => {
    if (latestGame) {
      const count = latestGame.data.pullable_orbs.length
      setPullableOrbs(prev => {
        if (prev.length !== count) {
          // Create empty array with actual count
          return Array(count).fill(null).map(() => ({} as Orb))
        }
        return prev
      })
      // Update consumed orbs count
      const consumedCount = latestGame.data.consumed_orbs.length
      setConsumedOrbs(prev => {
        if (prev.length !== consumedCount) {
          return Array(consumedCount).fill(null).map(() => ({} as Orb))
        }
        return prev
      })
    }
  }, [latestGame])

  // Function to pull an orb: calls the contract function
  const pullOrb = async () => {
    await pullOrbContract(gamepackId)
  }

  // Get bomb values from latest game
  const bombValues = useMemo(() => {
    return latestGame ? getBombVariants(latestGame) : []
  }, [latestGame])

  // Convert pullable orbs to orb categories
  const orbCategories = useMemo(() => {
    if (latestGame && latestGame.data.pullable_orbs) {
      return to_orbcategory(latestGame.data.pullable_orbs)
    }
    // Return empty categories if no game data
    return {
      health: [],
      bomb: [],
      multiplier: [],
      point: [],
      special: [],
    }
  }, [latestGame])

  // Convert Game type to GameData, using direct matches from actual Game data
  const gameData: GameData = {
    moonRocks: latestGame 
      ? Number(latestGame.data.temp_moonrocks) + Number(latestGame.data.moonrocks_earned) - Number(latestGame.data.moonrocks_spent)
      : 80,
    points: latestGame ? Number(latestGame.data.points) : 15,
    glitchChips: latestGame ? Number(latestGame.data.glitch_chips) : 36,
    milestone: latestGame ? Number(latestGame.data.milestone) : 30,
    multiplier: latestGame ? Number(latestGame.data.multiplier) : 2.5,
    bombs: bombValues.length,
    health: latestGame ? Number(latestGame.data.hp) : 5,
    pullable_orbs: pullableOrbs, // Using arrays with actual counts from latestGame.data.pullable_orbs.length
    consumed_orbs: consumedOrbs, // Using arrays with actual counts from latestGame.data.consumed_orbs.length
  }

  return (
    <GameContainer 
      gameData={gameData}
      bombValues={bombValues}
      orbCategories={orbCategories}
      lineData={mockLineData}
      onPullOrb={pullOrb}
    />
  )
}
