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

// Site & Grounds - Step 3: Site Elements Options

export const SIGNAGE_OPTIONS = [
  { id: "monument", label: "Monument" },
  { id: "woodPost", label: "Wood Post" },
  { id: "pylon", label: "Pylon" },
  { id: "bldgMounted", label: "Bldg. Mounted" },
] as const

export const LOT_LIGHTING_OPTIONS = [
  { id: "metalPole", label: "Metal Pole" },
  { id: "woodPole", label: "Wood Pole" },
] as const

export const BLDG_LIGHTING_OPTIONS = [
  { id: "surface", label: "Surface" },
  { id: "recessedInSoffits", label: "Recessed in Soffits" },
] as const

export const SITE_FENCING_MATERIALS = [
  { id: "chainLink", label: "Chain Link" },
  { id: "wood", label: "Wood" },
  { id: "cmu", label: "CMU" },
  { id: "brick", label: "Brick" },
  { id: "vinyl", label: "Vinyl" },
  { id: "other", label: "Other" },
] as const

export const DUMPSTER_ENCLOSURE_MATERIALS = [
  { id: "chainLink", label: "Chain Link" },
  { id: "wood", label: "Wood" },
  { id: "cmu", label: "CMU" },
  { id: "brick", label: "Brick" },
  { id: "vinyl", label: "Vinyl" },
  { id: "other", label: "Other" },
] as const

export const DUMPSTER_GATE_MATERIALS = [
  { id: "chainLink", label: "Chain Link" },
  { id: "wood", label: "Wood" },
  { id: "metalSolid", label: "Metal (Solid)" },
  { id: "metalTubular", label: "Metal (Tubular)" },
] as const

export const RECREATIONAL_FACILITY_OPTIONS = [
  { id: "bbqArea", label: "BBQ Area" },
  { id: "playground", label: "Playground" },
  { id: "basketballCourt", label: "Basketball Court" },
  { id: "tennisCourt", label: "Tennis Court" },
  { id: "volleyballCourt", label: "Volleyball Court" },
  { id: "golfCourse", label: "Golf Course" },
  { id: "leisureArea", label: "Leisure Area" },
  { id: "other", label: "Other" },
] as const

export const BRIDGE_MATERIALS = [
  { id: "concrete", label: "Concrete" },
  { id: "wood", label: "Wood" },
  { id: "granite", label: "Granite" },
  { id: "steel", label: "Steel" },
] as const

export const BRIDGE_RAILING_MATERIALS = [
  { id: "metal", label: "Metal" },
  { id: "wood", label: "Wood" },
  { id: "vinyl", label: "Vinyl" },
] as const

// Site & Grounds - Step 4: Miscellaneous Structures Options

export const GENERAL_CONSTRUCTION_OPTIONS = [
  { id: "cmu", label: "CMU" },
  { id: "tiltUp", label: "Tilt-up" },
  { id: "lightGaugeSteel", label: "Light-Gauge Steel" },
  { id: "wood", label: "Wood" },
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
export type SignageId = typeof SIGNAGE_OPTIONS[number]["id"]
export type LotLightingId = typeof LOT_LIGHTING_OPTIONS[number]["id"]
export type BldgLightingId = typeof BLDG_LIGHTING_OPTIONS[number]["id"]
export type SiteFencingMaterialId = typeof SITE_FENCING_MATERIALS[number]["id"]
export type DumpsterEnclosureMaterialId = typeof DUMPSTER_ENCLOSURE_MATERIALS[number]["id"]
export type DumpsterGateMaterialId = typeof DUMPSTER_GATE_MATERIALS[number]["id"]
export type RecreationalFacilityId = typeof RECREATIONAL_FACILITY_OPTIONS[number]["id"]
export type BridgeMaterialId = typeof BRIDGE_MATERIALS[number]["id"]
export type BridgeRailingMaterialId = typeof BRIDGE_RAILING_MATERIALS[number]["id"]
export type GeneralConstructionId = typeof GENERAL_CONSTRUCTION_OPTIONS[number]["id"]

