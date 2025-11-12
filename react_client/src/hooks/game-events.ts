import type {
  SchemaType,
  StandardizedQueryResult,
  SubscriptionCallbackArgs,
} from '@dojoengine/sdk'
import { KeysClause, ToriiQueryBuilder } from '@dojoengine/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NAMESPACE } from '../../config'
import { GameEvent } from '../bindings/typescript/models.gen'
import { useDojoSdk } from '@/hooks/dojo'

const MODEL_NAME = 'GameEvent'
const ENTITIES_LIMIT = 10_000

const getGameEventsQuery = (packId: number, gameId: number) => {
  const clauses = KeysClause([`${NAMESPACE}-${MODEL_NAME}`], [`0x${packId.toString(16)}`, `0x${gameId.toString(16)}`, undefined], "FixedLen")
  return new ToriiQueryBuilder()
    .withClause(clauses.build())
    .includeHashedKeys()
    .withLimit(ENTITIES_LIMIT)
}

export const useGameEvents = (packId: number, gameId: number) => {
  const { sdk } = useDojoSdk()

  const [events, setEvents] = useState<GameEvent[]>([])

  const subscriptionRef = useRef<any>(null)

  const onUpdate = useCallback(
    ({
      data,
      error,
    }: SubscriptionCallbackArgs<
      StandardizedQueryResult<SchemaType>,
      Error
    >) => {
      console.log({ data })
      if (
        error ||
        !data ||
        data.length === 0 ||
        BigInt(data[0].entityId) === 0n
      )
        return
      const events: GameEvent[] = []
      data.forEach((entity) => {
        if (BigInt(entity.entityId) === 0n) return
        if (!entity.models[NAMESPACE]?.[MODEL_NAME]) return
        const model = entity.models[NAMESPACE][MODEL_NAME] as GameEvent
        if (Number(model.gamepack_id) === packId && Number(model.game_id) === gameId) {
          events.push(model)
        }
      })
      setEvents((prev) => {
        const deduped = prev.filter(
          (event) =>
            !events.some(
              (e) =>
                e.gamepack_id === event.gamepack_id && e.game_id === event.game_id && e.tick === event.tick,
            ),
        )
        console.log({ deduped })
        return [...events, ...deduped]
      })
    },
    [packId, gameId],
  )

  const refresh = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current = null
    }

    const query = await getGameEventsQuery(packId, gameId)
    console.log({ query })
    const [result, subscription] = await sdk.subscribeEventQuery({
      query,
      callback: onUpdate,
    })
    subscriptionRef.current = subscription

    const items = result.getItems()
    if (items && items.length > 0) {
      onUpdate({ data: items, error: undefined })
    }
  }, [sdk, onUpdate, packId, gameId])

  useEffect(() => {
    refresh()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.cancel()
      }
    }
  }, [refresh])

  return {
    events,
    refresh,
  }
}

