import { createFileRoute, useNavigate, Outlet, useRouterState } from '@tanstack/react-router'
import ControllerMenuBar from '../components/ControllerMenuBar'
import GamepackDisplay from '../components/GamepackDisplay'
import Button from '../components/Button'
import { useBuy } from '../hooks/buy'

export const Route = createFileRoute('/testnet')({
  component: TestnetRoute,
})

function TestnetRoute() {
  const router = useRouterState()
  const isExactMatch = router.location.pathname === '/testnet'

  return (
    <div
      className="relative h-dvh overflow-hidden flex flex-col text-white"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)',
      }}
    >
      <Header />
      <div className="flex-1 min-h-0">
        {isExactMatch ? <Main /> : <Outlet />}
      </div>
    </div>
  )
}

const Main = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2
        className="text-2xl font-bold tracking-wider uppercase mb-4"
        style={{
          color: '#55DD63',
          textShadow: '2px 2px 0px rgba(0, 0, 0, 0.25)',
        }}
      >
        MY GAMEPACKS
      </h2>
      <div className="flex gap-3 mb-4">
        <Buy />
        <ViewLeaderboard />
      </div>
      <GamepackDisplay />
    </div>
  )
}

const Buy = () => {
  const { buy } = useBuy()
  return <Button onClick={() => buy()}>Buy Gamepack</Button>
}

const ViewLeaderboard = () => {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate({ to: '/testnet/leaderboard' })}>
      View Leaderboard
    </Button>
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
