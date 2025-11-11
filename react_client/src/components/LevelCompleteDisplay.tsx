import type { Game } from '@/bindings/typescript/models.gen'
import StatsDisplay from './StatsDisplay'
import { useMemo } from 'react'
import type { GameData } from './GameDataTypes'

interface LevelCompleteDisplayProps {
  latestGame: Game | null
  onEnterShop?: () => void
  onCashOut?: () => void
  isEnteringShop?: boolean
  isCashingOut?: boolean
}

export default function LevelCompleteDisplay({ 
  latestGame, 
  onEnterShop, 
  onCashOut,
  isEnteringShop = false,
  isCashingOut = false,
}: LevelCompleteDisplayProps) {
  // Count total bombs pulled from consumed_orbs array
  const totalBombsPulled = useMemo(() => {
    if (!latestGame || !latestGame.data.consumed_orbs) {
      return 0
    }

    let bombCount = 0
    for (const orb of latestGame.data.consumed_orbs) {
      if (!orb) continue

      // Check if the orb is a bomb
      if (typeof orb === 'object') {
        // Check if it has a variant property with a Bomb key
        if ('variant' in orb && orb.variant && typeof orb.variant === 'object') {
          const variant = orb.variant as Record<string, any>
          if ('Bomb' in variant) {
            bombCount++
          }
        } else {
          // Check if it's a direct enum with Bomb key
          const keys = Object.keys(orb).filter(key => key !== 'variant')
          if (keys.includes('Bomb')) {
            bombCount++
          }
        }
      }
    }

    return bombCount
  }, [latestGame])

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
      bombs: totalBombsPulled,
      health: Number(latestGame.data.hp),
      pullable_orbs: [],
      consumed_orbs: [],
    }
  }, [latestGame, totalBombsPulled])

  const level = latestGame ? Number(latestGame.data.level) : 0
  const pullNumber = latestGame ? Number(latestGame.data.pull_number) : 0

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 py-8 gap-8">
      {/* Level Complete Title */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-bold" style={{ color: '#55DD63' }}>
          LEVEL COMPLETE!
        </h1>
        {latestGame && (
          <p className="text-lg opacity-80" style={{ color: '#55DD63' }}>
            Level {level} • Pull {pullNumber}
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

        {/* Additional Stats */}
        <div className="flex flex-row gap-6 w-full justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm opacity-70" style={{ color: '#55DD63' }}>
              Bombs Pulled
            </div>
            <div className="text-2xl font-bold" style={{ color: '#55DD63' }}>
              {gameData.bombs}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-4 w-full max-w-md justify-center">
        {onEnterShop && (
          <button
            onClick={onEnterShop}
            disabled={isEnteringShop || isCashingOut}
            className="flex-1 px-8 py-4 rounded-lg text-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#55DD63',
              color: '#0C1806',
            }}
          >
            {isEnteringShop ? 'Entering...' : 'Enter Shop'}
          </button>
        )}
        {onCashOut && (
          <button
            onClick={onCashOut}
            disabled={isCashingOut || isEnteringShop}
            className="flex-1 px-8 py-4 rounded-lg text-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#14240C',
              color: '#55DD63',
              border: '2px solid #55DD63',
            }}
          >
            {isCashingOut ? 'Cashing Out...' : 'Cash Out'}
          </button>
        )}
      </div>
    </div>
  )
}

