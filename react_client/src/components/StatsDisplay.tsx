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
    <div className="flex flex-col items-center gap-3 md:gap-4" style={{ color: '#55DD63' }}>
      <div className="flex flex-row gap-4 md:gap-8 items-center">
        <StatColumn value={gameData.moonRocks} icon={<MoonrocksIcon className="w-5 h-5 md:w-6 md:h-6" />} />
        <div className="min-w-[120px] sm:min-w-[160px] md:min-w-[200px] flex items-center justify-center">
          <span className="text-6xl md:text-8xl font-bold">{gameData.points}</span>
        </div>
        <StatColumn value={gameData.glitchChips} icon={<GlitchChipsIcon className="w-5 h-5 md:w-6 md:h-6" />} />
      </div>
      <div className="w-full">
        <PointsProgressBar points={gameData.points} milestone={gameData.milestone} />
      </div>
    </div>
  )
}

