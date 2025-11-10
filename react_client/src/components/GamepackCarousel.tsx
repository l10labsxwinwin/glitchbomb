import { useEffect } from 'react'
import { GamePack as GamePackType } from '@/bindings/typescript/models.gen'

interface GamepackCarouselProps {
  gamepacks: GamePackType[]
}

export default function GamepackCarousel({ gamepacks }: GamepackCarouselProps) {
  useEffect(() => {
    if (gamepacks.length > 0) {
      console.log('Gamepacks received:', gamepacks)
    }
  }, [gamepacks])

  return <div>{/* Empty component for now */}</div>
}
