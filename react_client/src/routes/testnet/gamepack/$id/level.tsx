import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testnet/gamepack/$id/level')({
  component: LevelStateRoute,
})

function LevelStateRoute() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-white text-lg">Level in progress...</div>
    </div>
  )
}
