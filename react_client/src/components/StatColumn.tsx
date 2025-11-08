interface StatColumnProps {
  value: number
}

export default function StatColumn({ value }: StatColumnProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-white">
      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white rounded"></div>
      <span className="text-lg md:text-xl font-bold">{value}</span>
    </div>
  )
}

