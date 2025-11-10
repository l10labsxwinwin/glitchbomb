import { createFileRoute } from '@tanstack/react-router'
import SingleGamepack from '@/components/SingleGamepack'

export const Route = createFileRoute('/testnet/gamepack/$id')({
  component: GamepackRoute,
})

function GamepackRoute() {
  const { id } = Route.useParams()
  return <SingleGamepack gamepackId={Number(id)} />
}
