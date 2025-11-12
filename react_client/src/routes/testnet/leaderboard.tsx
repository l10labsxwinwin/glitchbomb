import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useAllGamepacks } from '@/hooks/allGamepacks'
import { GamePack } from '@/bindings/typescript/models.gen'

export const Route = createFileRoute('/testnet/leaderboard')({
  component: LeaderboardRoute,
})

function LeaderboardRoute() {
  const { gamepacks } = useAllGamepacks()

  const sortedGamepacks = useMemo(() => {
    return [...gamepacks].sort((a, b) => {
      const moonrocksA = Number(a.data.accumulated_moonrocks)
      const moonrocksB = Number(b.data.accumulated_moonrocks)
      return moonrocksB - moonrocksA // Sort descending (largest first)
    })
  }, [gamepacks])

  return (
    <div className="flex flex-col items-center h-full overflow-y-auto p-4 md:p-6">
      <h2
        className="text-2xl font-bold tracking-wider uppercase mb-6"
        style={{
          color: '#55DD63',
          textShadow: '2px 2px 0px rgba(0, 0, 0, 0.25)',
        }}
      >
        LEADERBOARD
      </h2>
      {sortedGamepacks.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-white text-lg">No gamepacks found</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#55DD63' }}>
            <table className="w-full">
              <thead>
                <tr className="bg-[#55DD63] text-[#0C1806]">
                  <th className="px-4 py-3 text-left font-bold uppercase text-sm tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left font-bold uppercase text-sm tracking-wider">Gamepack ID</th>
                  <th className="px-4 py-3 text-left font-bold uppercase text-sm tracking-wider">State</th>
                  <th className="px-4 py-3 text-right font-bold uppercase text-sm tracking-wider">Moonrocks</th>
                </tr>
              </thead>
              <tbody>
                {sortedGamepacks.map((gamepack, index) => (
                  <LeaderboardRow
                    key={gamepack.gamepack_id}
                    gamepack={gamepack}
                    rank={index + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

interface LeaderboardRowProps {
  gamepack: GamePack
  rank: number
}

function LeaderboardRow({ gamepack, rank }: LeaderboardRowProps) {
  const navigate = useNavigate()
  const gamepackId = Number(gamepack.gamepack_id)
  const accumulatedMoonrocks = Number(gamepack.data.accumulated_moonrocks)
  const state = (gamepack.state as unknown as string) || 'Unknown'

  const handleClick = () => {
    navigate({
      to: '/testnet/gamepack/$id',
      params: { id: gamepackId.toString() },
    })
  }

  const rankColor =
    rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#55DD63'

  return (
    <tr
      onClick={handleClick}
      className="bg-[#0C1806] border-b cursor-pointer hover:bg-[#1a2d0f] transition-colors"
      style={{ borderColor: '#55DD63' }}
    >
      <td className="px-4 py-3">
        <span
          className="font-bold text-lg"
          style={{
            color: rankColor,
          }}
        >
          #{rank}
        </span>
      </td>
      <td className="px-4 py-3 text-white font-semibold">#{gamepackId}</td>
      <td className="px-4 py-3 text-white text-sm uppercase tracking-wider opacity-70">
        {state}
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-white font-bold text-lg">
          {accumulatedMoonrocks.toLocaleString()}
        </span>
      </td>
    </tr>
  )
}

