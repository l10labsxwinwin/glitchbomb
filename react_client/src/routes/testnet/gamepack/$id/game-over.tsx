import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()
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

  const handleBackToGamepacks = () => {
    navigate({ to: '/testnet' })
  }

  return (
    <GameOverDisplay 
      latestGame={latestGame}
      gamepackId={gamepackId}
      onNewGame={handleNextGame}
      onBackToGamepacks={handleBackToGamepacks}
      isStarting={isStarting}
    />
  )
}
