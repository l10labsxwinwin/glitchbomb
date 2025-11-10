"use client"

import { useRef, useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import type { LineDataPoint } from "./GameDataTypes"
import { PointType } from "./GameDataTypes"

const chartConfig = {
  aggregate_score: {
    label: "Aggregate Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ChartLineDotsProps {
  data?: LineDataPoint[]
}

export function ChartLineDots({ data = [] }: ChartLineDotsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [yAxisWidth, setYAxisWidth] = useState(40)
  const [dotRadius, setDotRadius] = useState(10)
  const [activeDotRadius, setActiveDotRadius] = useState(8)

  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        // Calculate responsive sizes based on container width
        // Y-axis width: 5% of container width, min 30px, max 60px
        const calculatedYAxisWidth = Math.max(30, Math.min(60, containerWidth * 0.05))
        // Dot radius: 1.5% of container width, min 6px, max 12px
        const calculatedDotRadius = Math.max(6, Math.min(12, containerWidth * 0.015))
        // Active dot radius: 80% of dot radius
        const calculatedActiveDotRadius = calculatedDotRadius * 0.8
        
        setYAxisWidth(calculatedYAxisWidth)
        setDotRadius(calculatedDotRadius)
        setActiveDotRadius(calculatedActiveDotRadius)
      }
    }

    updateSizes()
    window.addEventListener('resize', updateSizes)
    return () => window.removeEventListener('resize', updateSizes)
  }, [])
  // Calculate domain with lowest value as minimum aggregate_score
  const calculateDomain = () => {
    if (data.length === 0) return [0, 0]
    
    const scores = data.map(d => d.aggregate_score)
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    
    // Add padding to min and max
    const range = max - min
    const padding = range * 0.1 || 10
    return [min - padding, max + padding]
  }

  // Calculate ticks that include 0 and only integers in multiples of 5 or 10
  const calculateTicks = () => {
    const domain = calculateDomain()
    const [min, max] = domain
    const range = max - min
    
    // Determine step size: prefer 10, use 5 if range is small
    let step = 10
    if (range < 50) {
      step = 5
    }
    
    // Round min down to nearest multiple of step
    const startTick = Math.floor(min / step) * step
    // Round max up to nearest multiple of step
    const endTick = Math.ceil(max / step) * step
    
    const ticks: number[] = []
    // Generate ticks in multiples of step
    for (let i = startTick; i <= endTick; i += step) {
      ticks.push(i)
    }
    
    // Always include 0 if it's within the domain
    if (min <= 0 && max >= 0 && !ticks.includes(0)) {
      ticks.push(0)
    }
    
    return ticks.sort((a, b) => a - b)
  }

  const domain = calculateDomain()
  const ticks = calculateTicks()

  // Custom tooltip that only shows the value
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div className="rounded-md border bg-popover px-3 py-1 text-sm text-popover-foreground shadow-md">
          {value}
        </div>
      )
    }
    return null
  }

  return (
    <Card 
      ref={containerRef}
      className="w-full h-full bg-transparent border-0 shadow-none"
    >
      <CardContent className="p-0 h-full">
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid 
              vertical={true} 
              horizontal={true}
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis
              dataKey="pull_number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide={true}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={yAxisWidth}
              domain={domain}
              ticks={ticks}
              allowDecimals={false}
              tickFormatter={(value) => Math.round(value).toString()}
              tick={{ fill: '#55DD63' }}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Line
              dataKey="aggregate_score"
              type="linear"
              stroke="#55DD63"
              strokeWidth={2}
              animationDuration={500}
              dot={(props: any) => {
                const { cx, cy, payload } = props
                const color = payload.point_type === PointType.Bomb ? "#FF1E00" : "#55DD63"
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={dotRadius}
                    fill={color}
                  />
                )
              }}
              activeDot={{
                r: activeDotRadius,
                fill: "white",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
