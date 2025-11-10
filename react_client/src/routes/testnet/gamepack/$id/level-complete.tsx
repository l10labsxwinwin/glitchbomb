import { createFileRoute } from '@tanstack/react-router'
import SingleGamepack from '@/components/SingleGamepack'
import { useGames } from '@/hooks/games'
import { useEffect, useMemo } from 'react'

export const Route = createFileRoute('/testnet/gamepack/$id/level-complete')({
  component: LevelCompleteStateRoute,
})

function LevelCompleteStateRoute() {
  const { id } = Route.useParams()
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
    console.log('LevelComplete state - All games:', games)
  }, [games])

  return <SingleGamepack gamepackId={gamepackId} latestGame={latestGame} />
}

