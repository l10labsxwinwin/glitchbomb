import { createFileRoute } from '@tanstack/react-router'
import { useGamepackContext } from '@/context/gamepack'
import LevelCompleteDisplay from '@/components/LevelCompleteDisplay'
import { useEnterShop } from '@/hooks/enterShop'
import { useCashOut } from '@/hooks/cashOut'
import { useState } from 'react'

export const Route = createFileRoute('/testnet/gamepack/$id/level-complete')({
  component: LevelCompleteStateRoute,
})

function LevelCompleteStateRoute() {
  const { gamepackId, latestGame, orbsInGame } = useGamepackContext()
  const { enterShop } = useEnterShop()
  const { cashOut } = useCashOut()
  const [isEnteringShop, setIsEnteringShop] = useState(false)
  const [isCashingOut, setIsCashingOut] = useState(false)

  console.log('Level Complete Route Data:', {
    gamepackId,
    latestGame,
    orbsInGame,
  })

  const handleEnterShop = async () => {
    setIsEnteringShop(true)
    try {
      await enterShop(gamepackId)
    } catch (error) {
      console.error('Failed to enter shop:', error)
    } finally {
      setIsEnteringShop(false)
    }
  }

  const handleCashOut = async () => {
    setIsCashingOut(true)
    try {
      await cashOut(gamepackId)
    } catch (error) {
      console.error('Failed to cash out:', error)
    } finally {
      setIsCashingOut(false)
    }
  }

  return (
    <LevelCompleteDisplay 
      latestGame={latestGame}
      onEnterShop={handleEnterShop}
      onCashOut={handleCashOut}
      isEnteringShop={isEnteringShop}
      isCashingOut={isCashingOut}
    />
  )
}

