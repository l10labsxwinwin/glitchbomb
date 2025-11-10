import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '@/components/GameContainer'
import type { GameData } from '@/components/GameDataTypes'

export const Route = createFileRoute('/testnet/gamepack/$id/level')({
  component: LevelStateRoute,
})

function LevelStateRoute() {
  // Default game data for now
  const gameData: GameData = {
    moonRocks: 0,
    points: 0,
    glitchChips: 0,
    milestone: 0,
    multiplier: 1,
    bombs: 0,
    health: 100,
    pullable_orbs: [],
    consumed_orbs: [],
  }

  return <GameContainer gameData={gameData} />
}
