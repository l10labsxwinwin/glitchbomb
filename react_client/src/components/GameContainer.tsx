import { useRef, useEffect, useState } from 'react'
import StatsDisplay from './StatsDisplay'
import Multiplier from './Multiplier'
import CashOutButton from './CashOutButton'
import PullOrbDisplay from './PullOrbDisplay'
import BottomBarDisplay from './BottomBarDisplay'
import RecentOrbsDisplay from './RecentOrbsDisplay'
import { DonutChart } from './DonutChart'
import { ChartLineDots } from './LineChart'
import type { GameData, LineDataPoint } from './GameDataTypes'
import { OrbCategory } from './GameDataTypes'
import type { ChartConfig } from './ui/chart'

interface GameContainerProps {
  gameData: GameData
  donutChartData?: Array<{ category: string; value: number; fill: string }>
  donutChartConfig?: ChartConfig
  lineData?: LineDataPoint[]
  onCashOut?: () => void
  onPullOrb?: () => void
}

export default function GameContainer({ 
  gameData,
  donutChartData,
  donutChartConfig,
  lineData,
  onCashOut = () => console.log('Cash out clicked'),
  onPullOrb = () => console.log('Pull Orb clicked')
}: GameContainerProps) {
  const topRowRef = useRef<HTMLDivElement>(null)
  const [bottomBarWidth, setBottomBarWidth] = useState<number | undefined>(undefined)
  const [topRowWidth, setTopRowWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    const updateWidth = () => {
      if (topRowRef.current) {
        setBottomBarWidth(topRowRef.current.offsetWidth)
        setTopRowWidth(topRowRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [gameData])

  return (
    <div 
      className="h-screen overflow-hidden flex flex-col items-center justify-center text-white px-4 md:px-6 py-6 md:py-8"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)'
      }}
    >
      <div className="flex flex-col items-center w-full max-w-7xl h-full gap-2 md:gap-4">
        <div className="flex flex-row items-center gap-4 md:gap-8 justify-center w-full shrink-0">
          <div ref={topRowRef} className="flex flex-row items-center gap-4 md:gap-8">
            <CashOutButton onClick={onCashOut} />
            <StatsDisplay gameData={gameData} />
            <Multiplier value={gameData.multiplier} />
          </div>
        </div>
        <div className="w-full shrink-0">
          <RecentOrbsDisplay consumedOrbs={gameData.consumed_orbs} width={topRowWidth} />
        </div>
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-start md:justify-center gap-2 md:gap-4">
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <ChartLineDots width={topRowWidth} data={lineData} />
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <DonutChart 
              className="w-full h-full"
          innerRadius={120}
          outerRadius={150}
          data={donutChartData}
          config={donutChartConfig}
        >
          <PullOrbDisplay 
            onClick={onPullOrb} 
                orbs={gameData.pullable_orbs.length}
            health={gameData.health}
          />
        </DonutChart>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 md:gap-8 justify-center w-full shrink-0">
          <BottomBarDisplay 
            bombOrbs={gameData.pullable_orbs.filter(orb => orb.category === OrbCategory.Bomb)} 
            width={bottomBarWidth} 
          />
        </div>
      </div>
    </div>
  )
}

