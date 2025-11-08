import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '../components/GameContainer'
import type { GameData } from '@/components/GameDataTypes'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

function FreePlay() {
  const mockGameData: GameData = {
    moonRocks: 80,
    points: 15,
    glitchChips: 36,
    milestone: 30,
    multiplier: 2.5,
    bombs: 5,
    health: 5,
    orbs: 12,
  }

  return <GameContainer gameData={mockGameData} />
}

