import { Diameter, Heart } from 'lucide-react'

interface PullOrbDisplayProps {
  onClick?: () => void
  disabled?: boolean
  orbs: number
  health: number
}

export default function PullOrbDisplay({ onClick, disabled = false, orbs, health }: PullOrbDisplayProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white gap-2"
      >
        <span className="text-xl md:text-3xl font-bold">PULL</span>
        <span className="text-xl md:text-3xl font-bold">ORB</span>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Diameter size={16} className="md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-mono">x{orbs}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
          <div className="flex items-center gap-1">
            <Heart size={16} className="md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-mono">x{health}</span>
          </div>
        </div>
      </button>
    </div>
  )
}

