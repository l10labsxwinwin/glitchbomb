import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/real')({
  component: RealPlay,
})

function RealPlay() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h2 className="text-4xl font-bold tracking-wider">Real Play</h2>
    </div>
  )
}
