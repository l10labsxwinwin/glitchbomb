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
    <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden relative">
      <div
        className="bg-white h-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-8 text-sm font-bold text-black uppercase whitespace-nowrap">
        <span className="whitespace-nowrap">GOAL:</span>
        <span className="whitespace-nowrap">{points} PTS</span>
      </div>
    </div>
  )
}

