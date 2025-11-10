interface MultiplierProps {
  value: number
}

export default function Multiplier({ value }: MultiplierProps) {
  return (
    <div 
      className="flex items-center justify-center aspect-square w-16 h-16 border-2 rounded-lg shrink-0"
      style={{ borderColor: '#55DD63', color: '#55DD63' }}
    >
      <span className="text-xl font-bold">{value}X</span>
    </div>
  )
}

