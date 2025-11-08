"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  width?: number
  data?: LineDataPoint[]
}

export function ChartLineDots({ width, data = [] }: ChartLineDotsProps) {
  return (
    <Card 
      className="w-full h-full bg-transparent border-0 shadow-none"
      style={width ? { width: `${width}px` } : undefined}
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
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="aggregate_score"
              type="natural"
              stroke="white"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props
                const color = payload.point_type === PointType.Bomb ? "#ff3333" : "#33ff33"
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={10}
                    fill={color}
                    stroke="white"
                    strokeWidth={2}
                  />
                )
              }}
              activeDot={{
                r: 8,
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
