// Site & Grounds - Step 1: Drainage & Erosion Options

export const SURFACE_TO_OPTIONS = [
  { id: "ditch", label: "Ditch" },
  { id: "stream", label: "Stream" },
  { id: "retentionPond", label: "Retention pond" },
  { id: "detentionPond", label: "Detention pond" },
  { id: "parkingGarageSump", label: "Parking Garage Sump" },
  { id: "drywell", label: "Drywell" },
] as const

export const DRAINAGE_FEATURES_OPTIONS = [
  { id: "concreteSwales", label: "Concrete swales" },
  { id: "surfaceDrains", label: "Surface drains" },
  { id: "curbInlets", label: "Curb inlets" },
  { id: "adjacentProperty", label: "Adjacent property" },
] as const

// Site & Grounds - Step 2: Topography Options

export const TOPOGRAPHY_SLOPE_OPTIONS = [
  { id: "flat", label: "Flat" },
  { id: "gentleSlope", label: "Gentle Slope" },
  { id: "moderateSlope", label: "Moderate Slope" },
  { id: "significantSlope", label: "Significant Slope" },
  { id: "highlyVariable", label: "Highly Variable" },
  { id: "erosion", label: "Erosion" },
] as const

export const LANDSCAPING_OPTIONS = [
  { id: "typical", label: "Typical" },
  { id: "grass", label: "Grass" },
  { id: "shrubs", label: "Shrubs" },
  { id: "flowerbeds", label: "Flowerbeds" },
  { id: "droughtTolerant", label: "Drought tolerant" },
  { id: "trees", label: "Trees" },
  { id: "sprinkler", label: "Sprinkler" },
  { id: "dripIrrig", label: "Drip Irrig." },
  { id: "stoneRocksMulch", label: "Stone/Rocks/Mulch" },
] as const

export const RETAINING_WALL_MATERIALS = [
  { id: "timber", label: "Timber" },
  { id: "stone", label: "Stone" },
  { id: "cmuBlock", label: "CMU Block" },
  { id: "concrete", label: "Concrete" },
  { id: "brick", label: "Brick" },
  { id: "railroadTies", label: "Railroad Ties" },
  { id: "lumber", label: "Lumber" },
  { id: "other", label: "Other" },
] as const

export const SCREEN_WALL_MATERIALS = [
  { id: "timber", label: "Timber" },
  { id: "stone", label: "Stone" },
  { id: "cmuBlock", label: "CMU Block" },
  { id: "concrete", label: "Concrete" },
  { id: "brick", label: "Brick" },
  { id: "railroadTies", label: "Railroad Ties" },
  { id: "lumber", label: "Lumber" },
  { id: "other", label: "Other" },
] as const

export const RAILING_MATERIALS = [
  { id: "metal", label: "Metal" },
  { id: "wood", label: "Wood" },
  { id: "vinyl", label: "Vinyl" },
  { id: "chainlink", label: "Chainlink" },
] as const

export const WATER_FEATURE_OPTIONS = [
  { id: "decorativeFountain", label: "Decorative Fountain" },
  { id: "artificialPond", label: "Artificial Pond" },
  { id: "creek", label: "Creek" },
  { id: "regPond", label: "Reg. Pond" },
  { id: "lake", label: "Lake" },
  { id: "oceanShoreline", label: "Ocean Shoreline" },
] as const

export const PUMP_LOCATION_OPTIONS = [
  { id: "vault", label: "Vault" },
  { id: "water", label: "Water" },
  { id: "enclosure", label: "Enclosure" },
] as const

// Type helpers
export type SurfaceToId = typeof SURFACE_TO_OPTIONS[number]["id"]
export type DrainageFeatureId = typeof DRAINAGE_FEATURES_OPTIONS[number]["id"]
export type TopographySlopeId = typeof TOPOGRAPHY_SLOPE_OPTIONS[number]["id"]
export type LandscapingId = typeof LANDSCAPING_OPTIONS[number]["id"]
export type RetainingWallMaterialId = typeof RETAINING_WALL_MATERIALS[number]["id"]
export type ScreenWallMaterialId = typeof SCREEN_WALL_MATERIALS[number]["id"]
export type RailingMaterialId = typeof RAILING_MATERIALS[number]["id"]
export type WaterFeatureId = typeof WATER_FEATURE_OPTIONS[number]["id"]
export type PumpLocationId = typeof PUMP_LOCATION_OPTIONS[number]["id"]

