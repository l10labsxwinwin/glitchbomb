import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ControllerMenuBar from '../components/ControllerMenuBar'
import GamepackDisplay from '../components/GamepackDisplay'

export const Route = createFileRoute('/testnet')({
  component: TestnetRoute,
})

function TestnetRoute() {
  return (
    <div
      className="relative min-h-screen flex flex-col text-white"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)',
      }}
    >
      <Header />
      <Main />
    </div>
  )
}

const Main = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GamepackDisplay />
    </div>
  )
}

export const Header = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: '/' })
  }

  return (
    <div
      className="w-full min-h-12 sm:min-h-14 md:min-h-16 flex flex-row items-center justify-between border-b px-4 md:px-6"
      style={{ borderColor: '#55DD63' }}
    >
      <div
        className="flex items-center justify-start cursor-pointer select-none"
        onClick={handleClick}
      >
        <h1
          className="text-base font-bold tracking-wider"
          style={{
            color: '#55DD63',
            textShadow: '2px 2px 0px rgba(0, 0, 0, 0.25)',
          }}
        >
          GLITCHBOMB
        </h1>
      </div>
      <ControllerMenuBar />
    </div>
  )
}
