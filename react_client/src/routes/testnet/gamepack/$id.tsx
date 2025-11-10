import { createFileRoute } from '@tanstack/react-router'
import SingleGamepack from '@/components/SingleGamepack'
import { useGames } from '@/hooks/games'
import { useEffect } from 'react'

export const Route = createFileRoute('/testnet/gamepack/$id')({
  component: GamepackRoute,
})

function GamepackRoute() {
  const { id } = Route.useParams()
  const gamepackId = Number(id)
  const { games } = useGames(gamepackId)

  useEffect(() => {
    console.log('All games:', games)
  }, [games])

  return <SingleGamepack gamepackId={gamepackId} />
}
