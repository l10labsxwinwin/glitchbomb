import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useGamepackContext } from '@/context/gamepack'
import ShopDisplay from '@/components/ShopDisplay'
import { useBuyCommon } from '@/hooks/buyCommon'
import { useBuyRare } from '@/hooks/buyRare'
import { useBuyCosmic } from '@/hooks/buyCosmic'
import { useNextLevel } from '@/hooks/nextLevel'

export const Route = createFileRoute('/testnet/gamepack/$id/shop')({
  component: ShopStateRoute,
})

function ShopStateRoute() {
  const { gamepackId, latestGame, orbsInGame } = useGamepackContext()
  const navigate = useNavigate()
  const { buyCommon } = useBuyCommon()
  const { buyRare } = useBuyRare()
  const { buyCosmic } = useBuyCosmic()
  const { nextLevel } = useNextLevel()

  const [buyingOrbs, setBuyingOrbs] = useState<Map<string, boolean>>(new Map())
  const [nextingLevel, setNextingLevel] = useState(false)

  const handleBuyCommon = async (index: number) => {
    const key = `common-${index}`
    setBuyingOrbs((prev) => new Map(prev).set(key, true))
    try {
      await buyCommon(gamepackId, index)
    } catch (error) {
      console.error('Failed to buy common orb:', error)
    } finally {
      setBuyingOrbs((prev) => {
        const newMap = new Map(prev)
        newMap.delete(key)
        return newMap
      })
    }
  }

  const handleBuyRare = async (index: number) => {
    const key = `rare-${index}`
    setBuyingOrbs((prev) => new Map(prev).set(key, true))
    try {
      await buyRare(gamepackId, index)
    } catch (error) {
      console.error('Failed to buy rare orb:', error)
    } finally {
      setBuyingOrbs((prev) => {
        const newMap = new Map(prev)
        newMap.delete(key)
        return newMap
      })
    }
  }

  const handleBuyCosmic = async (index: number) => {
    const key = `cosmic-${index}`
    setBuyingOrbs((prev) => new Map(prev).set(key, true))
    try {
      await buyCosmic(gamepackId, index)
    } catch (error) {
      console.error('Failed to buy cosmic orb:', error)
    } finally {
      setBuyingOrbs((prev) => {
        const newMap = new Map(prev)
        newMap.delete(key)
        return newMap
      })
    }
  }

  const handleNextLevel = async () => {
    setNextingLevel(true)
    try {
      await nextLevel(gamepackId)
    } catch (error) {
      console.error('Failed to advance level:', error)
    } finally {
      setNextingLevel(false)
    }
  }

  const handleBackToGamepacks = () => {
    navigate({ to: '/testnet' })
  }

  return (
    <ShopDisplay
      latestGame={latestGame}
      gamepackId={gamepackId}
      orbsInGame={orbsInGame}
      onBuyCommon={handleBuyCommon}
      onBuyRare={handleBuyRare}
      onBuyCosmic={handleBuyCosmic}
      onNextLevel={handleNextLevel}
      onBackToGamepacks={handleBackToGamepacks}
      buyingOrbs={buyingOrbs}
      nextingLevel={nextingLevel}
    />
  )
}
