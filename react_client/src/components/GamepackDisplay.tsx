import { useAccount, useNetwork } from '@starknet-react/core'
import { useMemo } from 'react'
import { addAddressPadding } from 'starknet'
import { getCollectionAddress } from '../../config'
import { useGamepacks } from '@/hooks/gamepacks'
import { useTokens } from '@/hooks/tokens'
import { useOpen } from '@/hooks/open'
import { useStart } from '@/hooks/start'
import GamePack from './game/GamePack'

export default function GamepackDisplay() {
  const { chain } = useNetwork()
  const { account } = useAccount()
  const { open } = useOpen()
  const { start } = useStart()

  const { balances } = useTokens({
    contractAddresses: [addAddressPadding(getCollectionAddress(chain.id))],
    accountAddresses: !account ? [] : [addAddressPadding(account.address)],
    contractType: 'ERC721',
  })

  const gamepackIds = useMemo(() => {
    return balances
      .filter((balance) => {
        const balanceValue = BigInt(balance.balance || '0x0')
        return balanceValue > 0n
      })
      .map((balance) => {
        const tokenId = balance.token_id || '0x0'
        return parseInt(tokenId, 16)
      })
      .filter((id) => id > 0)
  }, [balances])

  const { gamepacks } = useGamepacks(gamepackIds)

  const handleOpen = (gamepackId: number) => {
    open(gamepackId)
  }

  const handleStart = (gamepackId: number) => {
    start(gamepackId)
  }

  if (gamepacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-white text-lg">No gamepacks found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-7xl">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 md:gap-6">
            {gamepacks.map((gamepack) => (
              <GamePack
                key={gamepack.gamepack_id}
                gamepack={gamepack}
                onOpen={handleOpen}
                onStart={handleStart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
