import { useMemo, useState } from 'react'
import type { Orb } from '@/bindings/typescript/models.gen'

interface ShopItemsViewProps {
  orbsInBag: {
    common: Array<Orb>
    rare: Array<Orb>
    cosmic: Array<Orb>
  } | null
  onBuyCommon: (index: number) => Promise<void>
  onBuyRare: (index: number) => Promise<void>
  onBuyCosmic: (index: number) => Promise<void>
  buyingOrbs: Map<string, boolean>
}

function getOrbEffect(orb: Orb | null): { type: string; value: number | string } | null {
  if (!orb || !orb.effect) return null
  
  const effect = orb.effect as any
  
  // Handle CairoCustomEnum structure
  let effectName: string | null = null
  let value: number = 0
  
  if (typeof effect === 'string') {
    effectName = effect
  } else if (typeof effect === 'object') {
    // Check if it has a variant property (e.g., { variant: { Point: 8 } })
    if ('variant' in effect && effect.variant && typeof effect.variant === 'object') {
      const variant = effect.variant as Record<string, any>
      const keys = Object.keys(variant)
      if (keys.length > 0) {
        effectName = keys[0]
        const variantValue = variant[effectName]
        if (variantValue !== undefined && variantValue !== null) {
          value = Number(variantValue)
          if (isNaN(value)) value = 0
        }
      }
    } else {
      // Check if it's a direct enum (e.g., { PointRewind: undefined })
      const keys = Object.keys(effect).filter(key => key !== 'variant')
      if (keys.length > 0) {
        effectName = keys[0]
        const enumValue = effect[effectName]
        if (enumValue !== undefined && enumValue !== null) {
          value = Number(enumValue)
          if (isNaN(value)) value = 0
        }
      }
    }
  }
  
  if (!effectName || effectName === 'Empty') return null
  
  switch (effectName) {
    case 'PointRewind':
      return { type: 'Pt Rewind', value: '' }
    case 'Point':
      return { type: 'Points', value }
    case 'PointPerOrbRemaining':
      return { type: 'Pts/Orb', value }
    case 'PointPerBombPulled':
      return { type: 'Pts/Bomb', value }
    case 'GlitchChips':
      return { type: 'Chips', value }
    case 'Moonrocks':
      return { type: 'Moonrocks', value }
    case 'Health':
      return { type: 'Health', value }
    case 'Bomb':
      return { type: 'Bomb', value }
    case 'Multiplier':
      return { type: 'Multiplier', value }
    case 'BombImmunity':
      return { type: 'Immunity', value }
    default:
      return null
  }
}

export default function ShopItemsView({
  orbsInBag,
  onBuyCommon,
  onBuyRare,
  onBuyCosmic,
  buyingOrbs,
}: ShopItemsViewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const orbsPerPage = 9
  const totalPages = 3 // Always 3 pages: common, rare, cosmic

  // Get orbs for the current page based on rarity
  const currentOrbs = useMemo(() => {
    if (!orbsInBag) return Array(orbsPerPage).fill(null)
    
    let orbsForPage: Array<Orb & { rarity: 'common' | 'rare' | 'cosmic'; index: number }> = []
    
    // Page 0: Common, Page 1: Rare, Page 2: Cosmic
    if (currentPage === 0) {
      orbsForPage = (orbsInBag.common || []).map((orb, idx) => ({ ...orb, rarity: 'common' as const, index: idx }))
    } else if (currentPage === 1) {
      orbsForPage = (orbsInBag.rare || []).map((orb, idx) => ({ ...orb, rarity: 'rare' as const, index: idx }))
    } else if (currentPage === 2) {
      orbsForPage = (orbsInBag.cosmic || []).map((orb, idx) => ({ ...orb, rarity: 'cosmic' as const, index: idx }))
    }
    
    // Filter out orbs with no effect and sort by price
    const filteredOrbs = orbsForPage
      .filter(orb => getOrbEffect(orb) !== null)
      .sort((a, b) => Number(a.current_price) - Number(b.current_price))
    
    // Fill remaining slots with null placeholders
    const placeholders = Array(Math.max(0, orbsPerPage - filteredOrbs.length)).fill(null)
    return [...filteredOrbs, ...placeholders]
  }, [orbsInBag, currentPage, orbsPerPage])

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="w-full">
      {totalPages > 1 && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === 0 ? '#14240C' : '#55DD63',
                color: currentPage === 0 ? '#55DD63' : '#0C1806',
                border: currentPage === 0 ? '2px solid #55DD63' : 'none',
              }}
            >
              &lt;
            </button>
            <span className="text-sm opacity-80" style={{ color: '#55DD63' }}>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: currentPage === totalPages - 1 ? '#14240C' : '#55DD63',
                color: currentPage === totalPages - 1 ? '#55DD63' : '#0C1806',
                border: currentPage === totalPages - 1 ? '2px solid #55DD63' : 'none',
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
      <div className="bg-black/30 border border-white/10 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {currentOrbs.map((orb, idx) => {
            if (!orb) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="aspect-square w-[120px] bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-center"
                >
                  <div className="opacity-30 text-sm" style={{ color: '#55DD63' }}>
                    Empty
                  </div>
                </div>
              )
            }

            const effect = getOrbEffect(orb)
            const buyKey = `${orb.rarity}-${orb.index}`
            const isBuying = buyingOrbs.get(buyKey) || false
            const borderColor =
              orb.rarity === 'common'
                ? '#55DD63'
                : orb.rarity === 'rare'
                  ? '#3B82F6'
                  : '#A855F7'

            if (!effect) return null

            return (
              <button
                key={`${orb.rarity}-${orb.index}`}
                onClick={() => {
                  if (orb.rarity === 'common') onBuyCommon(orb.index)
                  else if (orb.rarity === 'rare') onBuyRare(orb.index)
                  else if (orb.rarity === 'cosmic') onBuyCosmic(orb.index)
                }}
                disabled={isBuying}
                className="aspect-square w-[120px] bg-black/50 hover:bg-black/70 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer p-3 rounded-lg border-2 flex flex-col transition-colors"
                style={{
                  borderColor: isBuying ? '#666' : borderColor,
                }}
              >
                {isBuying ? (
                  <div className="text-xs opacity-80 text-center flex-1 flex items-center justify-center" style={{ color: '#55DD63' }}>
                    Buying...
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="text-sm font-bold text-center mb-1" style={{ color: '#55DD63' }}>
                        {effect.type}
                      </div>
                      <div className="text-sm opacity-80 text-center" style={{ color: '#55DD63' }}>
                        {effect.value || ''}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full text-xs opacity-70" style={{ color: '#55DD63' }}>
                      <div className="text-left">{Number(orb.current_price)} GC</div>
                      <div className="text-right">{Number(orb.count)}x</div>
                    </div>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

