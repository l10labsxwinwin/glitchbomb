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
          <Bomb size={40} className="md:w-16 md:h-16 text-white" />
          {orb.value !== 1 && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white leading-none">
              {orb.value}x
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

