import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testnet/gamepack/$id/level-complete')({
  component: LevelCompleteStateRoute,
})

function LevelCompleteStateRoute() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-white text-lg">Level Complete!</div>
    </div>
  )
}

