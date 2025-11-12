import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testnet/gamepack/$id/empty')({
  component: EmptyStateRoute,
})

function EmptyStateRoute() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-white text-lg">No game found. Create a new game to start.</div>
    </div>
  )
}

