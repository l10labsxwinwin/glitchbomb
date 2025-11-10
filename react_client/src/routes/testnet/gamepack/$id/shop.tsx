import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testnet/gamepack/$id/shop')({
  component: ShopStateRoute,
})

function ShopStateRoute() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-white text-lg">Shop</div>
    </div>
  )
}

