interface StatColumnProps {
  value: number
}

export default function StatColumn({ value }: StatColumnProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-white">
      <div className="w-6 h-6 border-2 border-white"></div>
      <span className="text-xl font-bold">{value}</span>
    </div>
  )
}

