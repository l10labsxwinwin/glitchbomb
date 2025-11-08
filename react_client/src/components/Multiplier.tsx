interface MultiplierProps {
  value: number
}

export default function Multiplier({ value }: MultiplierProps) {
  return (
    <div 
      className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 border-2 rounded-lg"
      style={{ borderColor: '#55DD63', color: '#55DD63' }}
    >
      <span className="text-2xl md:text-3xl font-bold">{value}X</span>
    </div>
  )
}

