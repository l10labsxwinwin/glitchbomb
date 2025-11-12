interface MultiplierProps {
  value: number
}

export default function Multiplier({ value }: MultiplierProps) {
  const multiplierValue = value / 100
  const displayValue = multiplierValue % 1 === 0 
    ? multiplierValue.toString() 
    : multiplierValue.toFixed(1)
  
  return (
    <div 
      className="flex items-center justify-center aspect-square w-16 h-16 border-2 rounded-lg shrink-0"
      style={{ borderColor: '#55DD63', color: '#55DD63' }}
    >
      <span className="text-xl font-bold">{displayValue}x</span>
    </div>
  )
}

