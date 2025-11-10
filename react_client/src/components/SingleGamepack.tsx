import type { Game } from '@/bindings/typescript/models.gen'
import { useNavigate } from '@tanstack/react-router'

interface SingleGamepackProps {
  gamepackId: number
  latestGame: Game | null
}

// Helper function to convert state name to URL-friendly format
function stateToRoute(state: string): string {
  const stateMap: Record<string, string> = {
    Empty: 'empty',
    New: 'new',
    Level: 'level',
    LevelComplete: 'level-complete',
    Shop: 'shop',
    GameOver: 'game-over',
  }
  return stateMap[state] || 'empty'
}

export default function SingleGamepack({
  gamepackId,
  latestGame,
}: SingleGamepackProps) {
  const navigate = useNavigate()
  
  const gameState = latestGame
    ? ((latestGame.state as unknown as string) || 'Empty')
    : 'Empty'

  const handleStateChange = (newState: string) => {
    const stateRoute = stateToRoute(newState)
    const routeMap: Record<string, '/testnet/gamepack/$id/empty' | '/testnet/gamepack/$id/new' | '/testnet/gamepack/$id/level' | '/testnet/gamepack/$id/level-complete' | '/testnet/gamepack/$id/shop' | '/testnet/gamepack/$id/game-over'> = {
      empty: '/testnet/gamepack/$id/empty',
      new: '/testnet/gamepack/$id/new',
      level: '/testnet/gamepack/$id/level',
      'level-complete': '/testnet/gamepack/$id/level-complete',
      shop: '/testnet/gamepack/$id/shop',
      'game-over': '/testnet/gamepack/$id/game-over',
    }
    const targetRoute = routeMap[stateRoute] || '/testnet/gamepack/$id/empty'
    navigate({
      to: targetRoute,
      params: { id: gamepackId.toString() },
    })
  }

  return (
    <div
      className="relative min-h-screen flex flex-col text-white"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)',
      }}
    >
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="text-white text-lg mb-4">
          Gamepack #{gamepackId}
        </div>
        {latestGame && (
          <div className="text-white text-md mb-4">
            Current State: {gameState}
          </div>
        )}
        <div className="flex flex-wrap gap-2 justify-center">
          {['Empty', 'New', 'Level', 'LevelComplete', 'Shop', 'GameOver'].map(
            (state) => (
              <button
                key={state}
                onClick={() => handleStateChange(state)}
                className={`px-4 py-2 rounded ${
                  gameState === state
                    ? 'bg-[#55DD63] text-[#0C1806]'
                    : 'bg-[#55DD63]/20 text-white hover:bg-[#55DD63]/40'
                } transition-colors`}
              >
                {state}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

