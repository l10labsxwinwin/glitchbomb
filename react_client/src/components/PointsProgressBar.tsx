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
    <div className="w-full rounded-lg h-6 overflow-hidden relative" style={{ backgroundColor: '#14240C' }}>
      <div
        className="h-full transition-all duration-300 rounded-lg"
        style={{ width: `${progress}%`, backgroundColor: '#55DD63' }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-8 text-sm font-bold uppercase whitespace-nowrap" style={{ color: '#55DD63' }}>
        <span className="whitespace-nowrap">GOAL:</span>
        <span className="whitespace-nowrap">{points} PTS</span>
      </div>
    </div>
  )
}

