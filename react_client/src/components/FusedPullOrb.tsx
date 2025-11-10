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
import type { Orb } from './GameDataTypes'
import { OrbCategory, orbCategoryColors } from './GameDataTypes'

const categoryLabels: Record<OrbCategory, string> = {
  [OrbCategory.Point]: 'Point',
  [OrbCategory.Health]: 'Health',
  [OrbCategory.Bomb]: 'Bomb',
  [OrbCategory.Multiplier]: 'Multiplier',
  [OrbCategory.Special]: 'Special',
}

interface FusedPullOrbProps {
  onClick?: () => void
  disabled?: boolean
  orbs: number
  health: number
  className?: string
  innerRadius?: number
  outerRadius?: number
  data?: Array<{ category: string; value: number; fill: string }>
  config?: ChartConfig
  pullableOrbs?: Orb[]
}

// Group pullable orbs by category
const groupOrbsByCategory = (orbs: Orb[]) => {
  const grouped = orbs.reduce(
    (acc, orb) => {
      const category = orb.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<OrbCategory, number>,
  )

  return grouped
}

export function FusedPullOrb({
  onClick,
  disabled = false,
  orbs,
  health,
  className,
  innerRadius = 60,
  outerRadius,
  data,
  config,
  pullableOrbs,
}: FusedPullOrbProps) {
  // Generate data from pullableOrbs if data is not provided
  const chartData = React.useMemo(() => {
    if (data && data.length > 0) {
      return data
    }

    if (pullableOrbs && pullableOrbs.length > 0) {
      const orbCategoryCounts = groupOrbsByCategory(pullableOrbs)
      return Object.entries(orbCategoryCounts)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({
          category,
          value: count,
          fill: orbCategoryColors[category as OrbCategory],
        }))
    }

    return []
  }, [data, pullableOrbs])

  // Generate config if not provided
  const chartConfig = React.useMemo(() => {
    if (config) {
      return config
    }

    if (pullableOrbs && pullableOrbs.length > 0) {
      const orbCategoryCounts = groupOrbsByCategory(pullableOrbs)
      return {
        value: {
          label: 'Count',
        },
        ...Object.entries(orbCategoryCounts).reduce(
          (acc, [category]) => {
            if (orbCategoryCounts[category as OrbCategory] > 0) {
              acc[category] = {
                label: categoryLabels[category as OrbCategory],
                color: orbCategoryColors[category as OrbCategory],
              }
            }
            return acc
          },
          {} as Record<string, { label: string; color: string }>,
        ),
      } satisfies ChartConfig
    }

    // Default empty config
    return {
      value: {
        label: 'Count',
      },
    } satisfies ChartConfig
  }, [config, pullableOrbs])

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
                        <div className="w-full h-full flex items-center justify-center">
                          <button
                            onClick={onClick}
                            disabled={disabled}
                            className="flex flex-col items-center justify-center w-full h-full rounded-full border-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#55DD63] gap-2"
                            style={{
                              background:
                                'linear-gradient(to bottom, #1C4E21, #000000)',
                              borderColor: '#55DD63',
                              color: '#55DD63',
                            }}
                          >
                            <span className="text-lg font-bold">PULL</span>
                            <span className="text-lg font-bold">ORB</span>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Diameter className="w-3 h-3" />
                                <span className="text-xs font-mono">
                                  x{orbs}
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
