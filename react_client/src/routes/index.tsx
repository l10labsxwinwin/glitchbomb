import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: TitleScreen,
})

function TitleScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold tracking-wider">GLITCHBOMB</h1>
    </div>
  )
}
