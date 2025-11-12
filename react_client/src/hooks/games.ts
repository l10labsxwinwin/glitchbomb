import type {
  SchemaType,
  StandardizedQueryResult,
  SubscriptionCallbackArgs,
} from '@dojoengine/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NAMESPACE } from '../../config'
import { Game } from '../bindings/typescript/models.gen'
import { useDojoSdk } from '@/hooks/dojo'

const MODEL_NAME = 'Game'
const ENTITIES_LIMIT = 10_000

const getGameQuery = async () => {
  const { KeysClause, ToriiQueryBuilder } = await import('@dojoengine/sdk')
  const clauses = KeysClause([`${NAMESPACE}-${MODEL_NAME}`], [])
  return new ToriiQueryBuilder()
    .withClause(clauses.build())
    .includeHashedKeys()
    .withLimit(ENTITIES_LIMIT)
}

export const useGames = (gamepackId: number) => {
  const { sdk } = useDojoSdk()

  const [games, setGames] = useState<Game[]>([])

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
      const games: Game[] = []
      data.forEach((entity) => {
        if (BigInt(entity.entityId) === 0n) return
        if (!entity.models[NAMESPACE]?.[MODEL_NAME]) return
        const model = entity.models[NAMESPACE][MODEL_NAME] as Game
        if (Number(model.gamepack_id) === gamepackId) {
          games.push(model)
        }
      })
      setGames((prev) => {
        const deduped = prev.filter(
          (game) =>
            !games.some(
              (g) =>
                g.gamepack_id === game.gamepack_id &&
                g.game_id === game.game_id,
            ),
        )
        return [...games, ...deduped]
      })
    },
    [gamepackId],
  )

  const refresh = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current = null
    }

    const query = await getGameQuery()
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
    games,
    refresh,
  }
}

