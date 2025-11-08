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
      <div className="absolute inset-0 flex items-center justify-between px-8 text-m font-bold text-black uppercase">
        <span>GOAL:</span>
        <span>{points} PTS</span>
      </div>
    </div>
  )
}

