import { Bomb } from 'lucide-react'
import type { Orb } from './GameDataTypes'

interface BombsDisplayProps {
  bombOrbs: Orb[]
}

export default function BombsDisplay({ bombOrbs }: BombsDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {bombOrbs.map((orb, index) => (
        <div key={index} className="relative">
          <Bomb 
            size={40} 
            className="md:w-16 md:h-16" 
            style={{ fill: '#55DD63', stroke: '#14240C', color: '#55DD63' }}
          />
          {orb.value !== 1 && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold leading-none" style={{ color: '#14240C' }}>
              {orb.value}x
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

