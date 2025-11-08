import { createFileRoute } from '@tanstack/react-router'
import StatsDisplay from '../components/StatsDisplay'
import Multiplier from '../components/Multiplier'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

function FreePlay() {
  const mockGameData = {
    moonRocks: 80,
    points: 140,
    glitchChips: 36,
    milestone: 200,
    multiplier: 2.5,
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-16">
      <div className="flex flex-row items-center gap-8">
        <StatsDisplay gameData={mockGameData} />
        <Multiplier value={mockGameData.multiplier} />
      </div>
    </div>
  )
}

