import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ControllerMenuBar from '../components/ControllerMenuBar'
import GamepackCarousel from '../components/GamepackCarousel'
import { useAccount, useNetwork } from '@starknet-react/core'
import { useMemo } from 'react'
import { useTokens } from '@/hooks/tokens'
import { useGamepacks } from '@/hooks/gamepacks'
import { addAddressPadding } from 'starknet'
import { getCollectionAddress } from '../../config'

export const Route = createFileRoute('/testnet')({
  component: TestnetRoute,
})

function TestnetRoute() {
  return (
    <div
      className="relative min-h-screen flex flex-col gap-4 md:gap-8 lg:gap-16 text-white"
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
  const { chain } = useNetwork()
  const { account } = useAccount()
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

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4">
      <GamepackCarousel gamepacks={gamepacks} />
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
      className="w-full min-h-12 sm:min-h-14 md:min-h-16 px-2 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-2 md:py-3 flex flex-row items-center justify-between gap-1 sm:gap-2 border-b"
      style={{ borderColor: '#55DD63' }}
    >
      <div
        className="flex items-center justify-start gap-1 cursor-pointer select-none"
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
