import { ReactNode } from 'react'

interface StatColumnProps {
  value: number
  icon?: ReactNode
}

export default function StatColumn({ value, icon }: StatColumnProps) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ color: '#55DD63' }}>
      {icon ? (
        <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
          {icon}
        </div>
      ) : (
        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white rounded"></div>
      )}
      <span className="text-lg md:text-xl font-bold">{value}</span>
    </div>
  )
}

