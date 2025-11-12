import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useStart } from '@/hooks/start'

export const Route = createFileRoute('/testnet/gamepack/$id/new')({
  component: NewStateRoute,
})

function NewStateRoute() {
  const { id } = Route.useParams()
  const gamepackId = Number(id)
  const { start } = useStart()
  const [isStarting, setIsStarting] = useState(false)

  const handleStartGame = async () => {
    setIsStarting(true)
    try {
      await start(gamepackId)
    } catch (error) {
      console.error('Failed to start game:', error)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="flex justify-center items-center py-8">
      <button
        onClick={handleStartGame}
        disabled={isStarting}
        className="px-6 py-3 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: '#55DD63',
          color: '#0C1806',
        }}
      >
        {isStarting ? 'Starting...' : 'Start Game'}
      </button>
    </div>
  )
}

