interface SingleGamepackProps {
  gamepackId: number
}

export default function SingleGamepack({ gamepackId }: SingleGamepackProps) {
  return (
    <div
      className="relative min-h-screen flex flex-col text-white"
      style={{
        background: 'linear-gradient(to bottom, #0C1806, #000000)',
      }}
    >
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="text-white text-lg">
          Gamepack #{gamepackId}
        </div>
      </div>
    </div>
  )
}

