import type { Game, OrbsInGame } from '@/bindings/typescript/models.gen'
import type { ReactNode } from 'react'
import { GamepackProvider } from '@/context/gamepack'

interface SingleGamepackProps {
  gamepackId: number
  latestGame: Game | null
  orbsInGame: OrbsInGame | null
  children?: ReactNode
}

export default function SingleGamepack({
  gamepackId,
  latestGame,
  orbsInGame,
  children,
}: SingleGamepackProps) {
  return (
    <GamepackProvider
      gamepackId={gamepackId}
      latestGame={latestGame}
      orbsInGame={orbsInGame}
    >
      <div
        className="relative flex flex-col text-white w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, #0C1806, #000000)',
        }}
      >
        <div className="flex-1 min-h-0 w-full">{children}</div>
      </div>
    </GamepackProvider>
  )
}
