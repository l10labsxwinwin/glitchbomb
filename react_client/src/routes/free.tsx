import { createFileRoute } from '@tanstack/react-router'
import StatsDisplay from '../components/StatsDisplay'
import Multiplier from '../components/Multiplier'
import CashOutButton from '../components/CashOutButton'
import PullOrbDisplay from '../components/PullOrbDisplay'
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
    bombs: 4,
    health: 5,
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-12 md:pt-16 px-6 md:px-8">
      <div className="flex flex-col items-center gap-8 md:gap-12 w-full max-w-7xl">
        <div className="flex flex-row items-center gap-4 md:gap-8 justify-center">
          <CashOutButton onClick={() => console.log('Cash out clicked')} />
          <StatsDisplay gameData={mockGameData} />
          <Multiplier value={mockGameData.multiplier} />
        </div>
        <PullOrbDisplay 
          onClick={() => console.log('Pull Orb clicked')} 
          bombs={mockGameData.bombs}
          health={mockGameData.health}
        />
      </div>
    </div>
  )
}

