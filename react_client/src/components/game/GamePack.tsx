import { GamePack as GamePackType } from '@/bindings/typescript/models.gen'

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
    <div className="shrink-0 w-full max-w-[200px] aspect-[3/5] rounded-lg bg-[#55DD63] text-[#0C1806] p-3 flex flex-col relative shadow-lg hover:shadow-[0_0_15px_rgba(85,221,99,0.2)] transition-shadow">
      {/* Top Section - Screw Holes and Header */}
      <div className="shrink-0 relative">
        {/* Screw Holes */}
        <div className="flex justify-between mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0C1806]/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#0C1806]/30"></div>
        </div>

        {/* Triangle Indentation */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#0C1806]/20"></div>

        {/* Game Pack ID */}
        <div className="text-center mb-0.5">
          <div className="text-2xl font-bold leading-none">#{gamepackId}</div>
        </div>

        {/* Status (like MAGICGATE) */}
        <div className="text-center">
          <div className="text-[7px] font-sans uppercase tracking-wider opacity-80">
            {state.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Middle Section - Recessed Area with Game Data */}
      <div className="grow my-2 bg-[#2d7a3d] rounded border border-[#0C1806]/20 p-3 flex flex-col justify-center space-y-2">
        {/* Moonrocks Display */}
        <div className="text-center">
          <div className="text-[8px] text-[#0C1806]/70 uppercase mb-1">Moonrocks</div>
          <div className="text-xl font-bold text-[#0C1806] leading-none">
            {accumulatedMoonrocks}
          </div>
        </div>

        {/* Currently Playing Game */}
        <div className="text-center border-t border-[#0C1806]/20 pt-2">
          <div className="text-[8px] text-[#0C1806]/70 uppercase mb-1">Game: {currentGameId}</div>
        </div>
      </div>

      {/* Bottom Section - Action Button */}
      <div className="shrink-0 flex justify-center mb-1">
        {isUnopened && onOpen && (
          <button
            onClick={() => onOpen(gamepackId)}
            className="px-3 py-1 text-[10px] font-sans uppercase bg-[#0C1806]/20 text-[#0C1806] border border-[#0C1806]/30 rounded hover:bg-[#0C1806]/30 transition-colors"
          >
            Open
          </button>
        )}
        {isInProgress && onStart && (
          <button
            onClick={() => onStart(gamepackId)}
            className="px-3 py-1 text-[10px] font-sans uppercase bg-[#0C1806]/20 text-[#0C1806] border border-[#0C1806]/30 rounded hover:bg-[#0C1806]/30 transition-colors"
          >
            Continue
          </button>
        )}
        {(isCompleted || isEndedEarly) && (
          <button
            disabled
            className="px-3 py-1 text-[10px] font-sans uppercase bg-[#0C1806]/10 text-[#0C1806]/50 border border-[#0C1806]/20 rounded cursor-not-allowed"
          >
            {isCompleted ? 'Completed' : 'Ended'}
          </button>
        )}
      </div>
    </div>
  )
}

