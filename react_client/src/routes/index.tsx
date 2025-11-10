import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Button from '../components/Button'

export const Route = createFileRoute('/')({
  component: TitleScreen,
})

function TitleScreen() {
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-white gap-8 px-4"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)'
      }}
    >
      <h1 
        className="text-6xl font-bold tracking-wider uppercase"
        style={{ 
          color: '#55DD63',
          textShadow: '3px 3px 0px rgba(0, 0, 0, 0.25)'
        }}
      >
        GLITCHBOMB
      </h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate({ to: '/free' })}>Free Play</Button>
        <Button onClick={() => navigate({ to: '/real' })}>Real Play</Button>
      </div>
    </div>
  )
}
