interface MultiplierProps {
  value: number
}

export default function Multiplier({ value }: MultiplierProps) {
  return (
    <div className="flex items-center justify-center w-24 h-24 border-2 border-white text-white">
      <span className="text-3xl font-bold">{value}</span>
    </div>
  )
}

