import { useRef, useEffect, useState } from 'react'
import StatsDisplay from './StatsDisplay'
import Multiplier from './Multiplier'
import CashOutButton from './CashOutButton'
import BottomBarDisplay from './BottomBarDisplay'
import RecentOrbsDisplay from './RecentOrbsDisplay'
import { FusedPullOrb } from './FusedPullOrb'
import { ChartLineDots } from './LineChart'
import type { GameData, LineDataPoint } from './GameDataTypes'
import type { OrbCategories } from '@/lib/frontenddatatypes'

interface GameContainerProps {
  gameData: GameData
  bombValues?: number[]
  orbCategories?: OrbCategories
  lineData?: LineDataPoint[]
  onCashOut?: () => void
  onPullOrb?: () => void
}

export default function GameContainer({ 
  gameData,
  bombValues = [],
  orbCategories,
  lineData,
  onCashOut = () => console.log('Cash out clicked'),
  onPullOrb = () => console.log('Pull Orb clicked')
}: GameContainerProps) {
  const donutContainerRef = useRef<HTMLDivElement>(null)
  const [donutRadii, setDonutRadii] = useState<{ inner: number; outer: number } | undefined>(undefined)

  useEffect(() => {
    const updateRadii = () => {
      if (donutContainerRef.current) {
        const size = Math.min(donutContainerRef.current.offsetWidth, donutContainerRef.current.offsetHeight)
        // Calculate radii as percentages of container size for scalability
        const innerRadius = size * 0.4 // 40% of container size
        const outerRadius = size * 0.5 // 50% of container size
        setDonutRadii({ inner: innerRadius, outer: outerRadius })
      }
    }

    updateRadii()
    window.addEventListener('resize', updateRadii)
    return () => window.removeEventListener('resize', updateRadii)
  }, [gameData])

  return (
    <div 
      className="h-full overflow-hidden flex flex-col items-center justify-center text-white px-4 py-6"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)'
      }}
    >
      <div className="flex flex-col items-center w-full h-full gap-2">
        <div className="flex flex-row items-center gap-4 w-full shrink-0">
          <CashOutButton onClick={onCashOut} />
          <StatsDisplay gameData={gameData} />
          <Multiplier value={gameData.multiplier} />
        </div>
        <div className="w-full shrink-0 mt-4">
          <RecentOrbsDisplay consumedOrbs={gameData.consumed_orbs} />
        </div>
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-start gap-2">
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <ChartLineDots data={lineData} />
          </div>
          <div ref={donutContainerRef} className="flex-1 min-h-0 w-full flex items-center justify-center">
            {orbCategories && (
              <FusedPullOrb 
                className="w-full h-full"
                innerRadius={donutRadii?.inner}
                outerRadius={donutRadii?.outer}
                orbCategories={orbCategories}
                onClick={onPullOrb}
                health={gameData.health}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 w-full shrink-0">
          <BottomBarDisplay 
            bombValues={bombValues}
          />
        </div>
      </div>
    </div>
  )
}

