import type { Game, OrbsInGame } from '@/bindings/typescript/models.gen'
import StatsDisplay from './StatsDisplay'
import { useMemo } from 'react'
import type { GameData } from './GameDataTypes'
import ShopItemsView from './ShopItemsView'

interface ShopDisplayProps {
  latestGame: Game | null
  gamepackId?: number
  orbsInGame: OrbsInGame | null
  onBuyCommon: (index: number) => Promise<void>
  onBuyRare: (index: number) => Promise<void>
  onBuyCosmic: (index: number) => Promise<void>
  onNextLevel: () => Promise<void>
  onBackToGamepacks?: () => void
  buyingOrbs: Map<string, boolean>
  nextingLevel: boolean
}

export default function ShopDisplay({
  latestGame,
  gamepackId,
  orbsInGame,
  onBuyCommon,
  onBuyRare,
  onBuyCosmic,
  onNextLevel,
  onBackToGamepacks,
  buyingOrbs,
  nextingLevel,
}: ShopDisplayProps) {
  // Convert Game type to GameData for StatsDisplay compatibility
  const gameData: GameData = useMemo(() => {
    if (!latestGame) {
      return {
        moonRocks: 0,
        points: 0,
        glitchChips: 0,
        milestone: 0,
        multiplier: 0,
        bombs: 0,
        health: 0,
        pullable_orbs: [],
        consumed_orbs: [],
      }
    }

    const moonRocks =
      Number(latestGame.data.temp_moonrocks) +
      Number(latestGame.data.moonrocks_earned) -
      Number(latestGame.data.moonrocks_spent)

    return {
      moonRocks,
      points: Number(latestGame.data.points),
      glitchChips: Number(latestGame.data.glitch_chips),
      milestone: Number(latestGame.data.milestone),
      multiplier: Number(latestGame.data.multiplier),
      bombs: 0,
      health: Number(latestGame.data.hp),
      pullable_orbs: [],
      consumed_orbs: [],
    }
  }, [latestGame])

  const level = latestGame ? Number(latestGame.data.level) : 0
  const pullNumber = latestGame ? Number(latestGame.data.pull_number) : 0
  const gameId = latestGame ? Number(latestGame.game_id) : 0
  const displayGamepackId = gamepackId ?? (latestGame ? Number(latestGame.gamepack_id) : 0)

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 py-8 gap-8 overflow-y-auto">
      {/* Shop Title */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-bold" style={{ color: '#55DD63' }}>
          SHOP
        </h1>
        {latestGame && (
          <p className="text-lg opacity-80" style={{ color: '#55DD63' }}>
            Gamepack #{displayGamepackId} • Game #{gameId} • Level {level} • Pull {pullNumber}
          </p>
        )}
      </div>

      {/* Current Stats */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="text-xl font-semibold" style={{ color: '#55DD63' }}>
          Current Stats
        </div>

        <div className="w-full">
          <StatsDisplay gameData={gameData} />
        </div>
      </div>

      {/* Shop Items */}
      {orbsInGame && (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <ShopItemsView
            orbsInBag={orbsInGame}
            onBuyCommon={onBuyCommon}
            onBuyRare={onBuyRare}
            onBuyCosmic={onBuyCosmic}
            buyingOrbs={buyingOrbs}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={onNextLevel}
          disabled={nextingLevel}
          className="w-full px-8 py-4 rounded-lg text-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#55DD63',
            color: '#0C1806',
          }}
        >
          {nextingLevel ? 'Loading...' : 'Next Level'}
        </button>
        {onBackToGamepacks && (
          <button
            onClick={onBackToGamepacks}
            disabled={nextingLevel}
            className="w-full px-8 py-4 rounded-lg text-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#14240C',
              color: '#55DD63',
              border: '2px solid #55DD63',
            }}
          >
            Back to Gamepacks
          </button>
        )}
      </div>
    </div>
  )
}

