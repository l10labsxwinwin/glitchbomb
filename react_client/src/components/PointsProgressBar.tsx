interface PointsProgressBarProps {
  points: number
  milestone: number
}

export default function PointsProgressBar({
  points,
  milestone,
}: PointsProgressBarProps) {
  const progress = milestone > 0 ? Math.min((points / milestone) * 100, 100) : 0

  return (
    <div className="w-full rounded-lg h-6 overflow-hidden relative" style={{ backgroundColor: '#1C4E21' }}>
      <div
        className="h-full transition-all duration-300 rounded-lg"
        style={{ width: `${progress}%`, backgroundColor: '#55DD63' }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold uppercase whitespace-nowrap" style={{ color: '#14240C' }}>
        <span className="whitespace-nowrap">GOAL:</span>
        <span className="whitespace-nowrap">{milestone} PTS</span>
      </div>
    </div>
  )
}

