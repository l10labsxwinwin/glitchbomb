import type { Orb } from './GameDataTypes'
import { orbCategoryColors } from './GameDataTypes'

interface RecentOrbsDisplayProps {
  consumedOrbs: Orb[]
}

export default function RecentOrbsDisplay({
  consumedOrbs,
}: RecentOrbsDisplayProps) {
  // Reverse the array so most recent (last pulled) is first (leftmost)
  const reversedOrbs = [...consumedOrbs].reverse()

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-center justify-start px-2 py-1 bg-black rounded-full gap-2 w-full">
        <span
          className="font-mono text-xs font-bold tracking-wider shrink-0"
          style={{ color: '#55DD63' }}
        >
          RECENT
        </span>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {reversedOrbs.map((orb, index) => {
            const colorVar = orbCategoryColors[orb.category]

            return (
              <div
                key={index}
                className="aspect-square w-3 h-3 rounded-full shrink-0"
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
