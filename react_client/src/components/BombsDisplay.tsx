import BombIcon from './BombIcon'
import type { Orb } from './GameDataTypes'

interface BombsDisplayProps {
  bombOrbs: Orb[]
}

export default function BombsDisplay({ bombOrbs }: BombsDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {bombOrbs.map((orb, index) => (
        <div key={index} className="relative">
          <BombIcon className="w-12 h-12 md:w-20 md:h-20" />
          {orb.value !== 1 && (
            <span 
              className="absolute left-1/2 flex items-center justify-center text-xs font-bold leading-none" 
              style={{ 
                color: '#14240C',
                bottom: '8%',
                transform: 'translateX(-5%)'
              }}
            >
              {orb.value}x
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

