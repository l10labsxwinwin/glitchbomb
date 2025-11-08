import type { GameData } from './GameDataTypes'
import StatColumn from './StatColumn'
import PointsProgressBar from './PointsProgressBar'

interface StatsDisplayProps {
  gameData: GameData
}

export default function StatsDisplay({ gameData }: StatsDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 text-white">
      <div className="flex flex-row gap-4 md:gap-8 items-center">
        <StatColumn value={gameData.moonRocks} />
        <span className="text-6xl md:text-8xl font-bold">{gameData.points}</span>
        <StatColumn value={gameData.glitchChips} />
      </div>
      <PointsProgressBar points={gameData.points} milestone={gameData.milestone} />
    </div>
  )
}

