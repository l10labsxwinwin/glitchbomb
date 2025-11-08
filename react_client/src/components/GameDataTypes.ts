export interface GameData {
  moonRocks: number
  points: number
  glitchChips: number
  milestone: number
  multiplier: number
  bombs: number
  health: number
  pullable_orbs: Orb[]
  consumed_orbs: Orb[]
}

export enum OrbEffect {
  Point = "Point",
  Health = "Health",
  Bomb = "Bomb",
  Multiplier = "Multiplier",
  PointsPerAnyOrb = "PointsPerAnyOrb",
  PointsPerBombPulled = "PointsPerBombPulled",
  PointsPerPointOrb = "PointsPerPointOrb",
  GlitchChips = "GlitchChips",
  Moonrocks = "Moonrocks",
  RewindPoint = "RewindPoint",
  BombImmunity = "BombImmunity",
}

export enum OrbCategory {
  Bomb = "Bomb",
  Health = "Health",
  Point = "Point",
  Multiplier = "Multiplier",
  Special = "Special",
}

export enum PointType {
  Bomb = "Bomb",
  NonBomb = "NonBomb",
}

export interface Orb {
  effect: OrbEffect
  category: OrbCategory
  value: number
}

export interface LineDataPoint {
  pull_number: number
  level: number
  aggregate_score: number
  point_type: PointType
}

// Orb category color theme configuration
export type OrbCategoryColors = Record<OrbCategory, string>

export const mutedColors: OrbCategoryColors = {
  [OrbCategory.Point]: "#5146CD",
  [OrbCategory.Health]: "#223717",
  [OrbCategory.Bomb]: "#58260C",
  [OrbCategory.Multiplier]: "#242C54",
  [OrbCategory.Special]: "#59551A",
}

export const brightColors: OrbCategoryColors = {
  [OrbCategory.Point]: "var(--chart-1)",
  [OrbCategory.Health]: "var(--chart-2)",
  [OrbCategory.Bomb]: "var(--chart-3)",
  [OrbCategory.Multiplier]: "var(--chart-4)",
  [OrbCategory.Special]: "var(--chart-5)",
}

export const rainbowColors: OrbCategoryColors = {
  [OrbCategory.Point]: "#00D9FF",      // Bright cyan - energetic and valuable
  [OrbCategory.Health]: "#00FF88",     // Bright green - life and vitality
  [OrbCategory.Bomb]: "#FF4444",       // Bright red - danger and warning
  [OrbCategory.Multiplier]: "#A855F7", // Bright purple - power and amplification
  [OrbCategory.Special]: "#FFD700",    // Gold - rare and premium
}

export const orbCategoryColors: OrbCategoryColors = rainbowColors

