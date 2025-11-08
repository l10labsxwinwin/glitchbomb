import { Bomb } from 'lucide-react'

interface BombsDisplayProps {
  bombs: number
}

export default function BombsDisplay({ bombs }: BombsDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: bombs }).map((_, index) => (
        <Bomb key={index} size={32} className="md:w-12 md:h-12 text-white" />
      ))}
    </div>
  )
}

