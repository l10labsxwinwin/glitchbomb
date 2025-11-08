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
        className="flex flex-col items-center justify-center w-48 h-48 max-w-48 max-h-48 rounded-full border-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#55DD63] gap-2"
        style={{ background: 'linear-gradient(to bottom, #1C4E21, #000000)', borderColor: '#55DD63', color: '#55DD63' }}
      >
        <span className="text-xl font-bold">PULL</span>
        <span className="text-xl font-bold">ORB</span>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Diameter size={16} />
            <span className="text-sm font-mono">x{orbs}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span className="text-sm font-mono">x{health}</span>
          </div>
        </div>
      </button>
    </div>
  )
}

