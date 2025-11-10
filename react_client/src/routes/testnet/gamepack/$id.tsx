import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGames } from '@/hooks/games'
import { useEffect, useMemo } from 'react'

export const Route = createFileRoute('/testnet/gamepack/$id')({
  component: GamepackRoute,
})

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

function GamepackRoute() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const gamepackId = Number(id)
  const { games } = useGames(gamepackId)

  const latestGame = useMemo(() => {
    if (games.length === 0) return null
    return games.reduce((latest, current) => {
      const currentId = Number(current.game_id)
      const latestId = Number(latest.game_id)
      return currentId > latestId ? current : latest
    })
  }, [games])

  useEffect(() => {
    if (latestGame) {
      const state = (latestGame.state as unknown as string) || 'Empty'
      const stateRoute = stateToRoute(state)
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
        replace: true,
      })
    } else {
      // If no game exists, redirect to empty state
      navigate({
        to: '/testnet/gamepack/$id/empty',
        params: { id: gamepackId.toString() },
        replace: true,
      })
    }
  }, [latestGame, gamepackId, navigate])

  // Show loading or nothing while redirecting
  return null
}
