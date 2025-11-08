"use client"

import * as React from "react"

import { Label, Pie, PieChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
  { browser: "safari", visitors: 200, fill: "var(--chart-2)" },
  { browser: "firefox", visitors: 287, fill: "var(--chart-3)" },
  { browser: "edge", visitors: 173, fill: "var(--chart-4)" },
  { browser: "other", visitors: 190, fill: "var(--chart-5)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

interface DonutChartProps {
  children?: React.ReactNode
  className?: string
  innerRadius?: number
  outerRadius?: number
  showText?: boolean
  data?: typeof chartData
  config?: ChartConfig
}

export function DonutChart({
  children,
  className,
  innerRadius = 60,
  outerRadius,
  showText = false,
  data = chartData,
  config = chartConfig,
}: DonutChartProps) {
  const totalVisitors = React.useMemo(() => {
    const valueKey = data?.[0]?.visitors !== undefined ? "visitors" : "value"
    return data.reduce((acc, curr) => acc + (curr[valueKey as keyof typeof curr] as number), 0)
  }, [data])

  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-center", className)}>
      <div className="relative w-full h-full aspect-square max-w-full max-h-full">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square w-full h-full max-w-full max-h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={data?.[0]?.visitors !== undefined ? "visitors" : "value"}
              nameKey={data?.[0]?.browser !== undefined ? "browser" : "category"}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={5}
              animationDuration={500}
            >
              {showText && (
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              )}
            </Pie>
          </PieChart>
        </ChartContainer>
        {children && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="pointer-events-auto flex items-center justify-center">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

