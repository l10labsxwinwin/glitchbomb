import type { GameData } from './GameDataTypes'
import StatColumn from './StatColumn'
import PointsProgressBar from './PointsProgressBar'
import MoonrocksIcon from './MoonrocksIcon'
import GlitchChipsIcon from './GlitchChipsIcon'

interface StatsDisplayProps {
  gameData: GameData
}

export default function StatsDisplay({ gameData }: StatsDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1" style={{ color: '#55DD63' }}>
      <div className="flex flex-row gap-4 items-center w-full justify-center">
        <StatColumn value={gameData.moonRocks} icon={<MoonrocksIcon className="w-5 h-5" />} />
        <div className="flex-1 flex items-center justify-center min-w-0">
          <span className="text-4xl font-bold">{gameData.points}</span>
        </div>
        <StatColumn value={gameData.glitchChips} icon={<GlitchChipsIcon className="w-5 h-5" />} />
      </div>
      <div className="w-full">
        <PointsProgressBar points={gameData.points} milestone={gameData.milestone} />
      </div>
    </div>
  )
}

