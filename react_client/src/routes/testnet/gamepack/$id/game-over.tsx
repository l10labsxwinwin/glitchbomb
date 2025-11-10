import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testnet/gamepack/$id/game-over')({
  component: GameOverStateRoute,
})

function GameOverStateRoute() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-white text-lg">Game Over</div>
    </div>
  )
}
