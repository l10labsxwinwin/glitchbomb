import { useEffect, useState } from 'react'
import { useDojoSdk } from '@/hooks/dojo'

export const useGamepackOwners = (gamepackIds: number[]) => {
  const sdk = useDojoSdk()
  const [owners, setOwners] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOwners = async () => {
      if (!sdk?.client || gamepackIds.length === 0) {
        setLoading(false)
        return
      }

      const ownerMap: Record<number, string> = {}
      
      try {
        await Promise.all(
          gamepackIds.map(async (gamepackId) => {
            try {
              const result = await sdk.client.Collection.ownerOf(gamepackId)
              // The result should be an array with the owner address
              const ownerAddress = Array.isArray(result) ? result[0] : result
              if (ownerAddress) {
                ownerMap[gamepackId] = ownerAddress.toString()
              }
            } catch (error) {
              console.error(`Error fetching owner for gamepack ${gamepackId}:`, error)
            }
          })
        )
        setOwners(ownerMap)
      } catch (error) {
        console.error('Error fetching owners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOwners()
  }, [sdk, gamepackIds.join(',')])

  return { owners, loading }
}

