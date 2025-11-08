import { Menu, ArrowDown } from 'lucide-react'
import BombsDisplay from './BombsDisplay'
import type { Orb } from './GameDataTypes'

interface BottomBarDisplayProps {
  bombOrbs: Orb[]
  onLeftButtonClick?: () => void
  onRightButtonClick?: () => void
  width?: number
}

export default function BottomBarDisplay({ 
  bombOrbs, 
  onLeftButtonClick,
  onRightButtonClick,
  width
}: BottomBarDisplayProps) {
  return (
    <div 
      className="flex items-center justify-between gap-4 md:gap-8" 
      style={width ? { width: `${width}px` } : undefined}
    >
      <button
        onClick={onLeftButtonClick}
        className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 hover:bg-white hover:text-black transition-colors rounded-lg"
        style={{ backgroundColor: '#0E1908', color: '#55DD63' }}
      >
        <Menu size={24} className="md:w-6 md:h-6" style={{ color: '#55DD63' }} />
      </button>
      <BombsDisplay bombOrbs={bombOrbs} />
      <button
        onClick={onRightButtonClick}
        className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 hover:bg-white hover:text-black transition-colors rounded-lg"
        style={{ backgroundColor: '#0E1908', color: '#55DD63' }}
      >
        <ArrowDown size={24} className="md:w-6 md:h-6" style={{ color: '#55DD63' }} />
      </button>
    </div>
  )
}

