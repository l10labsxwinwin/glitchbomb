import { createFileRoute } from '@tanstack/react-router'
import GameContainer from '../components/GameContainer'
import type { GameData } from '@/components/GameDataTypes'
import type { ChartConfig } from '@/components/ui/chart'

export const Route = createFileRoute('/free')({
  component: FreePlay,
})

// Extract mock data
const mockGameData: GameData = {
  moonRocks: 80,
  points: 15,
  glitchChips: 36,
  milestone: 30,
  multiplier: 2.5,
  bombs: 5,
  health: 5,
  orbs: 12,
}

// Transform game data into donut chart format
const donutChartData = [
  { category: "moonRocks", value: mockGameData.moonRocks, fill: "var(--chart-1)" },
  { category: "glitchChips", value: mockGameData.glitchChips, fill: "var(--chart-2)" },
  { category: "points", value: mockGameData.points, fill: "var(--chart-3)" },
  { category: "bombs", value: mockGameData.bombs, fill: "var(--chart-4)" },
  { category: "orbs", value: mockGameData.orbs, fill: "var(--chart-5)" },
]

const donutChartConfig: ChartConfig = {
  value: {
    label: "Value",
  },
  moonRocks: {
    label: "Moon Rocks",
    color: "var(--chart-1)",
  },
  glitchChips: {
    label: "Glitch Chips",
    color: "var(--chart-2)",
  },
  points: {
    label: "Points",
    color: "var(--chart-3)",
  },
  bombs: {
    label: "Bombs",
    color: "var(--chart-4)",
  },
  orbs: {
    label: "Orbs",
    color: "var(--chart-5)",
  },
}

function FreePlay() {
  return (
    <GameContainer 
      gameData={mockGameData}
      donutChartData={donutChartData}
      donutChartConfig={donutChartConfig}
    />
  )
}

