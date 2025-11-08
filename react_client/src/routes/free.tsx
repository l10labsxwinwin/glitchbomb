import { createFileRoute } from '@tanstack/react-router'
import StatsDisplay from '../components/StatsDisplay'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

function FreePlay() {
  const mockGameData = {
    moonRocks: 80,
    points: 140,
    glitchChips: 36,
    milestone: 200,
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-16">
      <StatsDisplay gameData={mockGameData} />
    </div>
  )
}

