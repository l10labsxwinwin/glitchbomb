import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Button from '../components/Button'

export const Route = createFileRoute('/')({
  component: TitleScreen,
})

function TitleScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-8">
      <h1 className="text-6xl font-bold tracking-wider">GLITCHBOMB</h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate({ to: '/free' })}>Free Play</Button>
        <Button onClick={() => navigate({ to: '/real' })}>Real Play</Button>
      </div>
    </div>
  )
}
