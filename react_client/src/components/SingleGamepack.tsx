import type { Game } from '@/bindings/typescript/models.gen'
import type { ReactNode } from 'react'

interface SingleGamepackProps {
  gamepackId: number
  latestGame: Game | null
  children?: ReactNode
}

export default function SingleGamepack({
  gamepackId,
  latestGame,
  children,
}: SingleGamepackProps) {

  return (
    <div
      className="relative flex flex-col text-white w-full h-full"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)',
      }}
    >
      <div className="flex-1 min-h-0 w-full">
        {children}
      </div>
    </div>
  )
}

