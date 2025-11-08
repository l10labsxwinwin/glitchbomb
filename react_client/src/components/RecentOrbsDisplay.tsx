import type { Orb } from './GameDataTypes'
import { OrbCategory } from './GameDataTypes'

interface RecentOrbsDisplayProps {
  consumedOrbs: Orb[]
  width?: number
}

// Map categories to colors (matching donut chart colors)
const categoryColors: Record<OrbCategory, string> = {
  [OrbCategory.Point]: "var(--chart-1)",
  [OrbCategory.Health]: "var(--chart-2)",
  [OrbCategory.Bomb]: "var(--chart-3)",
  [OrbCategory.Multiplier]: "var(--chart-4)",
  [OrbCategory.Special]: "var(--chart-5)",
}

export default function RecentOrbsDisplay({ consumedOrbs, width }: RecentOrbsDisplayProps) {
  // Reverse the array so most recent (last pulled) is first (leftmost)
  const reversedOrbs = [...consumedOrbs].reverse()

  return (
    <div className="w-full flex items-center justify-center">
      <div 
        className="flex items-center justify-start px-3 md:px-4 py-1.5 md:py-2 bg-black rounded-full gap-3 md:gap-4"
        style={width ? { width: `${width}px` } : undefined}
      >
        <span className="font-mono text-xs md:text-sm font-bold tracking-wider" style={{ color: '#55DD63' }}>
          RECENT
        </span>
        <div className="flex items-center gap-1.5 md:gap-2">
          {reversedOrbs.map((orb, index) => {
            const colorVar = categoryColors[orb.category]
            
            return (
              <div
                key={index}
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: colorVar,
                  boxShadow: `0 0 8px ${colorVar}, 0 0 16px ${colorVar}`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

