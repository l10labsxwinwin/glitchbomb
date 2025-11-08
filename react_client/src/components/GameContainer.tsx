import { useRef, useEffect, useState } from 'react'
import StatsDisplay from './StatsDisplay'
import Multiplier from './Multiplier'
import CashOutButton from './CashOutButton'
import PullOrbDisplay from './PullOrbDisplay'
import BottomBarDisplay from './BottomBarDisplay'
import { DonutChart } from './DonutChart'
import type { GameData } from './GameDataTypes'
import { OrbCategory } from './GameDataTypes'
import type { ChartConfig } from './ui/chart'

interface GameContainerProps {
  gameData: GameData
  donutChartData?: Array<{ category: string; value: number; fill: string }>
  donutChartConfig?: ChartConfig
  onCashOut?: () => void
  onPullOrb?: () => void
}

export default function GameContainer({ 
  gameData,
  donutChartData,
  donutChartConfig,
  onCashOut = () => console.log('Cash out clicked'),
  onPullOrb = () => console.log('Pull Orb clicked')
}: GameContainerProps) {
  const topRowRef = useRef<HTMLDivElement>(null)
  const [bottomBarWidth, setBottomBarWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    const updateWidth = () => {
      if (topRowRef.current) {
        setBottomBarWidth(topRowRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [gameData])

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-12 md:pt-16 px-6 md:px-8">
      <div className="flex flex-col items-center justify-between w-full max-w-7xl flex-1 pb-12 md:pb-16">
        <div className="flex flex-row items-center gap-4 md:gap-8 justify-center w-full">
          <div ref={topRowRef} className="flex flex-row items-center gap-4 md:gap-8">
            <CashOutButton onClick={onCashOut} />
            <StatsDisplay gameData={gameData} />
            <Multiplier value={gameData.multiplier} />
          </div>
        </div>
        <DonutChart 
          className="w-full max-w-md md:max-w-lg"
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
        <div className="flex flex-row items-center gap-4 md:gap-8 justify-center w-full">
          <BottomBarDisplay 
            bombOrbs={gameData.pullable_orbs.filter(orb => orb.category === OrbCategory.Bomb)} 
            width={bottomBarWidth} 
          />
        </div>
      </div>
    </div>
  )
}

