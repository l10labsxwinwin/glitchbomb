import { createFileRoute } from '@tanstack/react-router'
import { useGamepackContext } from '@/context/gamepack'
import GameOverDisplay from '@/components/GameOverDisplay'
import { useNextGame } from '@/hooks/nextGame'
import { useState } from 'react'

export const Route = createFileRoute('/testnet/gamepack/$id/game-over')({
  component: GameOverStateRoute,
})

function GameOverStateRoute() {
  const { gamepackId, latestGame, orbsInGame } = useGamepackContext()
  const { nextGame } = useNextGame()
  const [isStarting, setIsStarting] = useState(false)

  console.log('Game Over Route Data:', {
    gamepackId,
    latestGame,
    orbsInGame,
  })

  const handleNextGame = async () => {
    setIsStarting(true)
    try {
      await nextGame(gamepackId)
    } catch (error) {
      console.error('Failed to start next game:', error)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <GameOverDisplay 
      latestGame={latestGame}
      onNewGame={handleNextGame}
      isStarting={isStarting}
    />
  )
}
