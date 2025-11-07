import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

function FreePlay() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h2 className="text-4xl font-bold tracking-wider">Free Play</h2>
    </div>
  )
}

