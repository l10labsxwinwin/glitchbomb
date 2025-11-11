import type { Game, OrbsInGame } from '@/bindings/typescript/models.gen'
import ShopItemsView from './ShopItemsView'
import GlitchChipsIcon from './GlitchChipsIcon'

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
  const glitchChips = latestGame ? Number(latestGame.data.glitch_chips) : 0
  const level = latestGame ? Number(latestGame.data.level) : 0
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
            Gamepack #{displayGamepackId} • Game #{gameId} • Level {level}
          </p>
        )}
      </div>

      {/* Glitch Chips Display */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <GlitchChipsIcon className="w-8 h-8" />
          <div className="text-4xl font-bold" style={{ color: '#55DD63' }}>
            {glitchChips}
          </div>
        </div>
        <div className="text-sm opacity-80" style={{ color: '#55DD63' }}>
          Glitch Chips
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

