import type { GameData } from './GameDataTypes'
import StatColumn from './StatColumn'

interface StatsDisplayProps {
  gameData: GameData
}

export default function StatsDisplay({ gameData }: StatsDisplayProps) {
  return (
    <div className="flex flex-row gap-8 items-center text-white">
      <StatColumn value={gameData.moonRocks} />
      <span className="text-8xl font-bold">{gameData.points}</span>
      <StatColumn value={gameData.glitchChips} />
    </div>
  )
}

