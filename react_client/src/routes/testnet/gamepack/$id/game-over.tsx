import { createFileRoute } from '@tanstack/react-router'
import { useGamepackContext } from '@/context/gamepack'
import GameOverDisplay from '@/components/GameOverDisplay'
import { useStart } from '@/hooks/start'
import { useState } from 'react'

export const Route = createFileRoute('/testnet/gamepack/$id/game-over')({
  component: GameOverStateRoute,
})

function GameOverStateRoute() {
  const { gamepackId, latestGame, orbsInGame } = useGamepackContext()
  const { start } = useStart()
  const [isStarting, setIsStarting] = useState(false)

  console.log('Game Over Route Data:', {
    gamepackId,
    latestGame,
    orbsInGame,
  })

  const handleNewGame = async () => {
    setIsStarting(true)
    try {
      await start(gamepackId)
    } catch (error) {
      console.error('Failed to start new game:', error)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <GameOverDisplay 
      latestGame={latestGame}
      onNewGame={handleNewGame}
      isStarting={isStarting}
    />
  )
}
