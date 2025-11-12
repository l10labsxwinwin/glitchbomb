import type { Game, OrbsInGame } from '@/bindings/typescript/models.gen'
import { createContext, useContext } from 'react'

interface GamepackContextValue {
  gamepackId: number
  latestGame: Game | null
  orbsInGame: OrbsInGame | null
}

const GamepackContext = createContext<GamepackContextValue | null>(null)

export function useGamepackContext() {
  const context = useContext(GamepackContext)
  if (!context) {
    throw new Error('useGamepackContext must be used within a GamepackProvider')
  }
  return context
}

interface GamepackProviderProps {
  gamepackId: number
  latestGame: Game | null
  orbsInGame: OrbsInGame | null
  children: React.ReactNode
}

export function GamepackProvider({
  gamepackId,
  latestGame,
  orbsInGame,
  children,
}: GamepackProviderProps) {
  return (
    <GamepackContext.Provider value={{ gamepackId, latestGame, orbsInGame }}>
      {children}
    </GamepackContext.Provider>
  )
}

