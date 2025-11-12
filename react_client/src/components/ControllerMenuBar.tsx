import { useEffect, useMemo, useRef, useState } from 'react'
import ControllerConnector from '@cartridge/connector/controller'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
} from '@starknet-react/core'
import { addAddressPadding } from 'starknet'
import Button from './Button'
import { useMint } from '@/hooks/mint'
import { useTokens } from '@/hooks/tokens'
import { getTokenAddress } from '../../config'

export default function ControllerMenuBar() {
  const { account } = useAccount()

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 md:gap-4">
      {account && <Balance />}
      {account ? <Profile /> : <Connect />}
      {account && <Disconnect />}
    </div>
  )
}

export const Connect = () => {
  const { connectAsync, connectors } = useConnect()
  return (
    <Button
      onClick={async () => {
        await connectAsync({ connector: connectors[0] })
      }}
    >
      <p
        className="text-sm translate-y-0.5"
        style={{ textShadow: '2px 2px 0px rgba(0, 0, 0, 0.24)' }}
      >
        Connect
      </p>
    </Button>
  )
}

export const Disconnect = () => {
  const { disconnect } = useDisconnect()

  return (
    <Button onClick={() => disconnect()}>
      <span className="text-sm">Disconnect</span>
    </Button>
  )
}

export const Profile = () => {
  const { connector } = useAccount()
  const [username, setUsername] = useState<string | null>(null)

  const controllerConnector = connector as never as ControllerConnector

  useEffect(() => {
    if (controllerConnector) {
      controllerConnector.username()?.then((username) => {
        setUsername(username)
      })
    }
  }, [controllerConnector])

  return (
    <Button
      onClick={async () => {
        ;(connector as ControllerConnector)?.controller.openProfile('inventory')
      }}
    >
      <span className="text-sm">{username}</span>
    </Button>
  )
}

export const Balance = () => {
  const { account } = useAccount()
  const { chain } = useNetwork()
  const tokenAddress = getTokenAddress(chain.id)
  const { mint } = useMint()

  const { tokens, balances, getBalance, toDecimal } = useTokens({
    accountAddresses: !!account ? [addAddressPadding(account.address)] : [],
    contractAddresses: [addAddressPadding(tokenAddress)],
  })

  const prevBalanceRef = useRef<bigint | undefined>(undefined)
  const balanceDiff = useRef<{ value: bigint }>({ value: 0n })

  const balance = useMemo(() => {
    if (!account) return '0'

    const token = tokens.find(
      (i) => BigInt(i.contract_address) === BigInt(tokenAddress),
    )
    if (!token) return '0'

    const balance = getBalance(token)
    if (!balance) return '0'

    const balanceScaled = toDecimal(token, balance)

    const diff = balanceScaled - (prevBalanceRef.current || 0n)

    if (diff !== 0n) {
      balanceDiff.current = { value: diff }
      prevBalanceRef.current = balanceScaled
    }

    return balanceScaled
  }, [balances, tokens, getBalance, toDecimal, account])

  return (
    <Button onClick={() => mint()}>
      <span className="text-sm">{`${balance.toLocaleString()} TKN`}</span>
    </Button>
  )
}
