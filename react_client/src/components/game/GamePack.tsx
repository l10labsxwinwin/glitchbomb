import { GamePack as GamePackType } from '@/bindings/typescript/models.gen'
import Button from '../Button'

interface GamePackProps {
  gamepack: GamePackType
  onOpen?: (gamepackId: number) => void
  onStart?: (gamepackId: number) => void
}

export default function GamePack({ gamepack, onOpen, onStart }: GamePackProps) {
  const gamepackId = Number(gamepack.gamepack_id)

  // Extract state from CairoCustomEnum - cast to string like in real.tsx
  const state = (gamepack.state as unknown as string) || 'Unknown'

  const isUnopened = state === 'Unopened'
  const isInProgress = state === 'InProgress'
  const isCompleted = state === 'Completed'
  const isEndedEarly = state === 'EndedEarly'

  const data = gamepack.data
  const currentGameId = Number(data.current_game_id)
  const accumulatedMoonrocks = Number(data.accumulated_moonrocks)

  return (
    <div className="shrink-0 w-full max-w-sm aspect-[2/1] rounded-2xl border-2 border-[#55DD63] bg-gradient-to-br from-[#0C1806]/40 to-black text-white p-3 sm:p-4 md:p-6 flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(85,221,99,0.3)] transition-shadow">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2 md:space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base md:text-xl font-bold">#{gamepackId}</h2>
          <StatusBadge state={state} />
        </div>

        {/* Center Content */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4 py-2 sm:py-4 md:py-6 grow flex flex-col justify-center">
          {/* Moonrocks Display */}
          <div className="text-center border-t border-[#55DD63]/30 pt-2 sm:pt-3">
            <p className="text-gray-400 text-[10px] sm:text-xs">Accumulated</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400">
              {accumulatedMoonrocks}
            </p>
            <p className="text-gray-400 text-[10px] sm:text-xs">Moonrocks</p>
          </div>

          {/* Game ID */}
          <div className="border-t border-[#55DD63]/30 pt-2 sm:pt-3 text-center">
            <p className="text-gray-400 text-[10px] sm:text-xs">Game ID</p>
            <p className="text-sm sm:text-base md:text-lg font-mono">{currentGameId}</p>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="pt-2 sm:pt-3 md:pt-4 border-t border-[#55DD63]/30 shrink-0 flex justify-center">
        {isUnopened && onOpen && (
          <Button onClick={() => onOpen(gamepackId)}>Open</Button>
        )}
        {isInProgress && onStart && (
          <Button onClick={() => onStart(gamepackId)}>Continue</Button>
        )}
        {(isCompleted || isEndedEarly) && (
          <Button disabled>{isCompleted ? 'Completed' : 'Ended'}</Button>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ state }: { state: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    Unopened: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    InProgress: { bg: 'bg-green-500/20', text: 'text-green-400' },
    Completed: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    EndedEarly: { bg: 'bg-red-500/20', text: 'text-red-400' },
    Empty: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  }

  const config = statusConfig[state] || statusConfig['Empty']

  return (
    <div
      className={`${config.bg} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${config.text}`}
    >
      {state}
    </div>
  )
}
