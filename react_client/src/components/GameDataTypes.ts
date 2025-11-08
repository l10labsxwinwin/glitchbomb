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

