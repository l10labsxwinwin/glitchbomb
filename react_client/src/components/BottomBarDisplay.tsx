import { Menu, ArrowDown } from 'lucide-react'
import BombsDisplay from './BombsDisplay'
import type { Orb } from './GameDataTypes'

interface BottomBarDisplayProps {
  bombOrbs: Orb[]
  onLeftButtonClick?: () => void
  onRightButtonClick?: () => void
}

export default function BottomBarDisplay({ 
  bombOrbs, 
  onLeftButtonClick,
  onRightButtonClick,
}: BottomBarDisplayProps) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <button
        onClick={onLeftButtonClick}
        className="flex items-center justify-center aspect-square w-10 h-10 hover:bg-white hover:text-black transition-colors rounded-lg shrink-0"
        style={{ backgroundColor: '#0E1908', color: '#55DD63' }}
      >
        <Menu className="w-4 h-4" style={{ color: '#55DD63' }} />
      </button>
      <BombsDisplay bombOrbs={bombOrbs} />
      <button
        onClick={onRightButtonClick}
        className="flex items-center justify-center aspect-square w-10 h-10 hover:bg-white hover:text-black transition-colors rounded-lg shrink-0"
        style={{ backgroundColor: '#0E1908', color: '#55DD63' }}
      >
        <ArrowDown className="w-4 h-4" style={{ color: '#55DD63' }} />
      </button>
    </div>
  )
}

