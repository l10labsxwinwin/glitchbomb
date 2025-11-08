import { Menu, ArrowDown } from 'lucide-react'
import BombsDisplay from './BombsDisplay'

interface BottomBarDisplayProps {
  bombs: number
  onLeftButtonClick?: () => void
  onRightButtonClick?: () => void
  width?: number
}

export default function BottomBarDisplay({ 
  bombs, 
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
        className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 border-2 border-white text-white hover:bg-white hover:text-black transition-colors rounded-lg"
      >
        <Menu size={24} className="md:w-6 md:h-6" />
      </button>
      <BombsDisplay bombs={bombs} />
      <button
        onClick={onRightButtonClick}
        className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 border-2 border-white text-white hover:bg-white hover:text-black transition-colors rounded-lg"
      >
        <ArrowDown size={24} className="md:w-6 md:h-6" />
      </button>
    </div>
  )
}

