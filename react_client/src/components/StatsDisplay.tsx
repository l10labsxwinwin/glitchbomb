import type { GameData } from './GameDataTypes'

interface StatsDisplayProps {
  gameData: GameData
}

export default function StatsDisplay({ gameData }: StatsDisplayProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-8 text-white">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{gameData.moonRocks}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{gameData.points}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{gameData.glitchChips}</span>
      </div>
    </div>
  )
}

