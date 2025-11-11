import type {
  SchemaType,
  StandardizedQueryResult,
  SubscriptionCallbackArgs,
} from '@dojoengine/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NAMESPACE } from '../../config'
import { OrbsInGame } from '../bindings/typescript/models.gen'
import { useDojoSdk } from '@/hooks/dojo'

const MODEL_NAME = 'OrbsInGame'
const ENTITIES_LIMIT = 10_000

const getOrbsInGameQuery = async () => {
  const { KeysClause, ToriiQueryBuilder } = await import('@dojoengine/sdk')
  const clauses = KeysClause([`${NAMESPACE}-${MODEL_NAME}`], [])
  return new ToriiQueryBuilder()
    .withClause(clauses.build())
    .includeHashedKeys()
    .withLimit(ENTITIES_LIMIT)
}

export const useOrbsInGame = (
  gamepackId: number,
  gameId: number,
) => {
  const { sdk } = useDojoSdk()

  const [orbsInGame, setOrbsInGame] = useState<OrbsInGame | null>(null)

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
      
      let foundOrbs: OrbsInGame | null = null
      data.forEach((entity) => {
        if (BigInt(entity.entityId) === 0n) return
        if (!entity.models[NAMESPACE]?.[MODEL_NAME]) return
        const model = entity.models[NAMESPACE][MODEL_NAME] as OrbsInGame
        if (
          Number(model.gamepack_id) === gamepackId &&
          Number(model.game_id) === gameId
        ) {
          foundOrbs = model
        }
      })
      
      if (foundOrbs) {
        setOrbsInGame(foundOrbs)
      }
    },
    [gamepackId, gameId],
  )

  const refresh = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current = null
    }

    const query = await getOrbsInGameQuery()
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
    orbsInGame,
    refresh,
  }
}

