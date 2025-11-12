'use client'

import * as React from 'react'
import { Diameter, Heart } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { OrbCategory, orbCategoryColors } from './GameDataTypes'
import type { OrbCategories } from '@/lib/frontenddatatypes'

// Map OrbCategories field names to colors
const orbCategoryFieldColors: Record<keyof OrbCategories, string> = {
  health: orbCategoryColors[OrbCategory.Health],    // #00FF88 - Bright green
  bomb: orbCategoryColors[OrbCategory.Bomb],        // #FF4444 - Bright red
  multiplier: orbCategoryColors[OrbCategory.Multiplier], // #A855F7 - Bright purple
  point: orbCategoryColors[OrbCategory.Point],     // #00D9FF - Bright cyan
  special: orbCategoryColors[OrbCategory.Special], // #FFD700 - Gold
}

// Map OrbCategories field names to display labels
const orbCategoryFieldLabels: Record<keyof OrbCategories, string> = {
  health: 'Health',
  bomb: 'Bomb',
  multiplier: 'Multiplier',
  point: 'Point',
  special: 'Special',
}

interface FusedPullOrbProps {
  onClick?: () => void
  disabled?: boolean
  health: number
  className?: string
  innerRadius?: number
  outerRadius?: number
  orbCategories: OrbCategories
}

export function FusedPullOrb({
  onClick,
  disabled = false,
  health,
  className,
  innerRadius = 60,
  outerRadius,
  orbCategories,
}: FusedPullOrbProps) {
  // Calculate total orb count from all categories
  const totalOrbs = React.useMemo(() => {
    return Object.values(orbCategories).reduce(
      (sum, effects) => sum + effects.length,
      0,
    )
  }, [orbCategories])

  // Generate chart data from orbCategories
  const chartData = React.useMemo(() => {
    return Object.entries(orbCategories)
      .filter(([_, effects]) => effects.length > 0)
      .map(([fieldName, effects]) => ({
        category: fieldName,
        value: effects.length,
        fill: orbCategoryFieldColors[fieldName as keyof OrbCategories],
      }))
  }, [orbCategories])

  // Generate chart config from orbCategories
  const chartConfig = React.useMemo(() => {
    return {
      value: {
        label: 'Count',
      },
      ...Object.entries(orbCategories).reduce(
        (acc, [fieldName, effects]) => {
          if (effects.length > 0) {
            acc[fieldName] = {
              label: orbCategoryFieldLabels[fieldName as keyof OrbCategories],
              color: orbCategoryFieldColors[fieldName as keyof OrbCategories],
            }
          }
          return acc
        },
        {} as Record<string, { label: string; color: string }>,
      ),
    } satisfies ChartConfig
  }, [orbCategories])

  // Calculate responsive stroke width based on outerRadius
  const strokeWidth = outerRadius
    ? Math.max(3, Math.min(8, outerRadius * 0.03))
    : 5

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col items-center justify-center',
        className,
      )}
    >
      <div className="relative w-full h-full aspect-square max-w-full max-h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full h-full max-w-full max-h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              wrapperStyle={{ zIndex: 9999 }}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="z-[9999]"
                  style={{ zIndex: 9999 }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={strokeWidth}
              animationDuration={500}
            >
              <Label
                content={({ viewBox }) => {
                  if (
                    viewBox &&
                    'cx' in viewBox &&
                    'cy' in viewBox &&
                    viewBox.cx &&
                    viewBox.cy
                  ) {
                    const cx = viewBox.cx
                    const cy = viewBox.cy
                    // Calculate button size: inner diameter * 0.85 to leave some padding
                    // Use default innerRadius of 60 if undefined
                    const effectiveInnerRadius = innerRadius ?? 60
                    const buttonSize = effectiveInnerRadius * 2 * 0.85

                    return (
                      <foreignObject
                        x={cx - buttonSize / 2}
                        y={cy - buttonSize / 2}
                        width={buttonSize}
                        height={buttonSize}
                      >
                        <div className="w-full h-full flex items-center justify-center relative">
                          <img
                            src="/glass_pullorb_idle.svg"
                            alt=""
                            className="absolute inset-0 w-full h-full pointer-events-none z-10"
                            style={{ objectFit: 'contain' }}
                          />
                          <button
                            onClick={onClick}
                            disabled={disabled}
                            className="flex flex-col items-center justify-center w-full h-full rounded-full border-2 hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#55DD63] gap-2 relative z-20"
                            style={{
                              background: 'transparent',
                              borderColor: '#55DD63',
                              color: '#55DD63',
                            }}
                          >
                            <div className="flex flex-col items-center gap-0 leading-none">
                              <span className="text-4xl font-extrabold">PULL</span>
                              <span className="text-4xl font-extrabold">ORB</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Diameter className="w-3 h-3" />
                                <span className="text-xs font-mono">
                                  x{totalOrbs}
                                </span>
                              </div>
                              <span className="w-0.5 h-0.5 rounded-full bg-gray-400"></span>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span className="text-xs font-mono">
                                  x{health}
                                </span>
                              </div>
                            </div>
                          </button>
                        </div>
                      </foreignObject>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}
