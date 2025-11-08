import { createFileRoute } from '@tanstack/react-router'
import StatsDisplay from '../components/StatsDisplay'
import Multiplier from '../components/Multiplier'
import CashOutButton from '../components/CashOutButton'

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
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-12 md:pt-16 px-6 md:px-8">
      <div className="flex flex-row items-center gap-4 md:gap-8 w-full max-w-7xl justify-center">
        <CashOutButton onClick={() => console.log('Cash out clicked')} />
        <StatsDisplay gameData={mockGameData} />
        <Multiplier value={mockGameData.multiplier} />
      </div>
    </div>
  )
}

