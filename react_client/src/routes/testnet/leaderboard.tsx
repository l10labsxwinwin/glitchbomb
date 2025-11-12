import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useNetwork } from '@starknet-react/core'
import { addAddressPadding } from 'starknet'
import { useAllGamepacks } from '@/hooks/allGamepacks'
import { useAllTokenBalances } from '@/hooks/allTokenBalances'
import { getCollectionAddress } from '../../../config'
import { GamePack } from '@/bindings/typescript/models.gen'

export const Route = createFileRoute('/testnet/leaderboard')({
  component: LeaderboardRoute,
})

function LeaderboardRoute() {
  const { chain } = useNetwork()
  const { gamepacks } = useAllGamepacks()
  
  // Get all ERC721 token balances (token_id -> owner mapping) in a single query
  const collectionAddress = useMemo(() => {
    return getCollectionAddress(chain.id)
  }, [chain.id])
  
  const { owners } = useAllTokenBalances(addAddressPadding(collectionAddress))

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
                  <th className="px-4 py-3 text-left font-bold uppercase text-sm tracking-wider">Owner</th>
                  <th className="px-4 py-3 text-left font-bold uppercase text-sm tracking-wider">ID</th>
                  <th className="px-4 py-3 text-right font-bold uppercase text-sm tracking-wider">Moonrocks</th>
                </tr>
              </thead>
              <tbody>
                {sortedGamepacks.map((gamepack, index) => (
                  <LeaderboardRow
                    key={gamepack.gamepack_id}
                    gamepack={gamepack}
                    rank={index + 1}
                    owner={owners[Number(gamepack.gamepack_id)]}
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
  owner?: string
}

function LeaderboardRow({ gamepack, rank, owner }: LeaderboardRowProps) {
  const navigate = useNavigate()
  const gamepackId = Number(gamepack.gamepack_id)
  const accumulatedMoonrocks = Number(gamepack.data.accumulated_moonrocks)

  const handleClick = () => {
    navigate({
      to: '/testnet/gamepack/$id',
      params: { id: gamepackId.toString() },
    })
  }

  const rankColor =
    rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#55DD63'

  const formatAddress = (address?: string) => {
    if (!address) return 'Loading...'
    // Convert from felt252 to hex if needed, then format
    try {
      let hexAddress = address.startsWith('0x') 
        ? address 
        : `0x${BigInt(address).toString(16)}`
      // Remove 0x prefix to get the address part, then format with 0x
      const addressWithoutPrefix = hexAddress.slice(2)
      if (addressWithoutPrefix.length < 8) {
        // If address is too short, pad it
        const padded = addressWithoutPrefix.padStart(8, '0')
        return `0x${padded.slice(0, 4)}...${padded.slice(-4)}`
      }
      return `0x${addressWithoutPrefix.slice(0, 4)}...${addressWithoutPrefix.slice(-4)}`
    } catch {
      // Fallback: try to format without conversion
      const cleanAddress = address.replace('0x', '')
      if (cleanAddress.length < 8) {
        const padded = cleanAddress.padStart(8, '0')
        return `0x${padded.slice(0, 4)}...${padded.slice(-4)}`
      }
      return `0x${cleanAddress.slice(0, 4)}...${cleanAddress.slice(-4)}`
    }
  }

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
      <td className="px-4 py-3 text-white text-sm font-mono">
        {formatAddress(owner)}
      </td>
      <td className="px-4 py-3 text-white font-semibold">#{gamepackId}</td>
      <td className="px-4 py-3 text-right">
        <span className="text-white font-bold text-lg">
          {accumulatedMoonrocks.toLocaleString()}
        </span>
      </td>
    </tr>
  )
}

