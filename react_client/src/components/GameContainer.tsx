import StatsDisplay from './StatsDisplay'
import Multiplier from './Multiplier'
import CashOutButton from './CashOutButton'
import PullOrbDisplay from './PullOrbDisplay'
import BombsDisplay from './BombsDisplay'
import type { GameData } from './GameDataTypes'

interface GameContainerProps {
  gameData: GameData
  onCashOut?: () => void
  onPullOrb?: () => void
}

export default function GameContainer({ 
  gameData, 
  onCashOut = () => console.log('Cash out clicked'),
  onPullOrb = () => console.log('Pull Orb clicked')
}: GameContainerProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-12 md:pt-16 px-6 md:px-8">
      <div className="flex flex-col items-center justify-between w-full max-w-7xl flex-1 pb-12 md:pb-16">
        <div className="flex flex-row items-center gap-4 md:gap-8 justify-center">
          <CashOutButton onClick={onCashOut} />
          <StatsDisplay gameData={gameData} />
          <Multiplier value={gameData.multiplier} />
        </div>
        <PullOrbDisplay 
          onClick={onPullOrb} 
          orbs={gameData.orbs}
          health={gameData.health}
        />
        <BombsDisplay bombs={gameData.bombs} />
      </div>
    </div>
  )
}

