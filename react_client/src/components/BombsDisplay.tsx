import BombIcon from './BombIcon'
import type { Orb } from './GameDataTypes'

interface BombsDisplayProps {
  bombOrbs: Orb[]
}

export default function BombsDisplay({ bombOrbs }: BombsDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
      {bombOrbs.map((orb, index) => (
        <div key={index} className="relative shrink-0">
          <BombIcon className="w-10 h-10" />
          {orb.value !== 1 && (
            <span 
              className="absolute left-1/2 flex items-center justify-center text-[10px] font-bold leading-none" 
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

