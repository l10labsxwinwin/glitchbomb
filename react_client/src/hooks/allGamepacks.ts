import type {
  SchemaType,
  StandardizedQueryResult,
  SubscriptionCallbackArgs,
} from '@dojoengine/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NAMESPACE } from '../../config'
import { GamePack } from '../bindings/typescript/models.gen'
import { useDojoSdk } from '@/hooks/dojo'

const MODEL_NAME = 'GamePack'
const ENTITIES_LIMIT = 10_000

const getGamepackQuery = async () => {
  const { KeysClause, ToriiQueryBuilder } = await import('@dojoengine/sdk')
  const clauses = KeysClause([`${NAMESPACE}-${MODEL_NAME}`], [])
  return new ToriiQueryBuilder()
    .withClause(clauses.build())
    .includeHashedKeys()
    .withLimit(ENTITIES_LIMIT)
}

export const useAllGamepacks = () => {
  const { sdk } = useDojoSdk()

  const [gamepacks, setGamepacks] = useState<GamePack[]>([])

  const subscriptionRef = useRef<any>(null)

  const onUpdate = useCallback(
    ({
      data,
      error,
    }: SubscriptionCallbackArgs<
      StandardizedQueryResult<SchemaType>,
      Error
    >) => {
      if (
        error ||
        !data ||
        data.length === 0 ||
        BigInt(data[0].entityId) === 0n
      )
        return
      const gamepacks: GamePack[] = []
      data.forEach((entity) => {
        if (BigInt(entity.entityId) === 0n) return
        if (!entity.models[NAMESPACE]?.[MODEL_NAME]) return
        const model = entity.models[NAMESPACE][MODEL_NAME] as GamePack
        gamepacks.push(model)
      })
      setGamepacks((prev) => {
        const deduped = prev.filter(
          (gamepack) =>
            !gamepacks.some((gp) => gp.gamepack_id === gamepack.gamepack_id),
        )
        return [...gamepacks, ...deduped]
      })
    },
    [],
  )

  const refresh = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current = null
    }

    const query = await getGamepackQuery()
    const [result, subscription] = await sdk.subscribeEntityQuery({
      query,
      callback: onUpdate,
    })
    subscriptionRef.current = subscription

    const items = result.getItems()
    if (items && items.length > 0) {
      onUpdate({ data: items, error: undefined })
    }
  }, [sdk, onUpdate])

  useEffect(() => {
    refresh()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.cancel()
      }
    }
  }, [refresh])

  return {
    gamepacks,
    refresh,
  }
}

