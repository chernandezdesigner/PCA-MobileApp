// ============================================
// MECHANICAL SYSTEMS - Step 1: HVAC Individual Units
// ============================================

// ============================================
// SHARED OPTIONS (DRY - Don't Repeat Yourself)
// Used across multiple HVAC system types
// ============================================

export const REFRIGERANT_TYPE_OPTIONS = [
  { id: "r22", label: "R-22" },
  { id: "r410", label: "R-410" },
  { id: "other", label: "Other" },
] as const

export const HEAT_SOURCE_OPTIONS = [
  { id: "naturalGas", label: "Natural Gas" },
  { id: "electric", label: "Electric" },
] as const

export const RESPONSIBILITY_OPTIONS = [
  { id: "unk", label: "Unk" },
  { id: "owner", label: "Owner" },
  { id: "tenant", label: "Tenant" },
  { id: "varies", label: "Varies" },
] as const


export const PACKAGED_UNIT_MOUNTING_LOCATION_OPTIONS = [
  { id: "gradeMounted", label: "Grade-mounted" },
  { id: "rooftop", label: "Rooftop" },
] as const

export const SPLIT_SYSTEM_MOUNTING_LOCATION_OPTIONS = [
  { id: "padMounted", label: "Pad-mounted" },
  { id: "rooftop", label: "Rooftop" },
] as const

// Unit Manufacturer & Specifics - Type dropdown (for dynamic table in Step 1)
export const HVAC_UNIT_TYPE_OPTIONS = [
  { id: "packagedRTU", label: "Packaged - RTU" },
  { id: "packagedPad", label: "Packaged - Pad" },
  { id: "splitSystemRTU", label: "Split System - RTU" },
  { id: "splitSystemPad", label: "Split System - Pad" },
] as const

//step 2 Misc Units Specific options

export const UNIT_HEATER_TYPE_OPTIONS = [
  { id: "radiantHeaters", label: "Radiant Heaters" },
  { id: "baseboard", label: "Baseboard" },
  { id: "wallMounted", label: "Wall-mounted" },
] as const

export const MISC_UNITS_HEAT_SOURCE_OPTIONS = [
  { id: "naturalGas", label: "Natural Gas" },
  { id: "electric", label: "Electric" },
  { id: "boiler", label: "Boiler" },
  { id: "notApplicable", label: "Not Applicable" },
] as const

export const MISC_UNITS_MOUNTING_LOCATION_OPTIONS = [
    { id: "baseboard", label: "Baseboard" },
    { id: "ceiling", label: "Ceiling" },
    { id: "wall", label: "Wall" },
] as const

export const AIR_HANDLER_MOUNTING_LOCATION_OPTIONS = [
    { id: "hvacroom", label: "HVAC Room" },
    { id: "closet", label: "Closet" },
    { id: "ceiling", label: "Ceiling" },
    { id: "wall", label: "Wall" },
] as const

export const EXHAUST_LOCATION_OPTIONS = [
    { id: "roofmounted", label: "Roof-mounted" },
    { id: "wallmounted", label: "Wall-mounted" },
] as const

// Step 3: Chillers and Cooling Towers Form Options

// Chiller compressor/technology type
export const CHILLER_TYPE_OPTIONS = [
    { id: "centrifugal", label: "Centrifugal" },
    { id: "reciprocating", label: "Reciprocating" },
    { id: "scroll", label: "Scroll" },
    { id: "rotary", label: "Rotary" },
  ] as const
  
  // Chiller cooling method/condenser type
  export const CHILLER_COOLING_METHOD_OPTIONS = [
    { id: "singleEffect", label: "Single-effect" },
    { id: "doubleEffect", label: "Double-effect" },
    { id: "airCooled", label: "Air-cooled" },
    { id: "waterCooled", label: "Water-cooled" },
  ] as const

  //refrigerant type
  export const CHILLER_REFRIGERANT_TYPE_OPTIONS = [
    { id: "r14", label: "R-14" },
    { id: "r22", label: "R-22" },
    { id: "r125", label: "R-125" },
    { id: "r134a", label: "R-134A" },
    { id: "r401a", label: "R-401A" },
    { id: "r407c", label: "R-407C" },
    { id: "r410a", label: "R-410A" },
    { id: "r422a", label: "R-422A" },
    { id: "r434a", label: "R-434A" },
    { id: "r428a", label: "R-428A" },
  ] as const

//cooling tower type
export const COOLING_TOWER_TYPE_OPTIONS = [
    { id: "openloop", label: "Open-loop (wet)" },
    { id: "closedloop", label: "Closed-loop (fluid coolers)" },
] as const

//Step 4 Boilers - heat options & boilers plumbing water options

export const BOILER_HEAT_TYPE_OPTIONS = [
    { id: "steam", label: "Steam" },
    { id: "water", label: "Water" },
] as const

export const BOILER_FUEL_TYPE_OPTIONS = [
    { id: "naturalGas", label: "Natural Gas" },
    { id: "electric", label: "Electric" },
    { id: "oil", label: "Oil" },
    { id: "Not applicable", label: "Not applicable" },
] as const

//step 5 - Plumbing systems options

export const DOMESTIC_PIPING_MATERIAL_OPTIONS = [
    { id: "copper", label: "Copper" },
    { id: "pvc", label: "PVC" },
    { id: "cpvc", label: "CPVC" },
    { id: "lead", label: "Lead" },
    { id: "pex", label: "PEX" },
    { id: "galvanized", label: "Galvanized" },
    { id: "polybutylene", label: "Polybutylene" },
] as const

export const WATERMETERS_OPTIONS = [
    { id: "mechanicalroom", label: "Mechanical Room" },
    { id: "vault", label: "Vault" },
] as const

export const WASTEPIPING_MATERIAL_OPTIONS = [
    { id: "pvc", label: "PVC" },
    { id: "castiron", label: "Cast Iron" },
    { id: "abs", label: "ABS" },
    { id: "copper", label: "Copper" },
] as const

// Natural Gas Piping Material options
export const NATURAL_GAS_PIPING_MATERIAL_OPTIONS = [
    { id: "black_fe", label: "Black Fe" },
    { id: "al", label: "Al" },
    { id: "galv_steel", label: "Galv Steel" },
    { id: "flex_steel", label: "Flex Steel" },
] as const

// Step 6: Water Heaters 
export const WATER_HEATER_BOILER_TYPE_OPTIONS = [
    { id: "notapplicable", label: "Not applicable" },
    { id: "electricboiler", label: "Electric Boiler" },
    { id: "electric", label: "Electric" },
    { id: "gasboiler", label: "Gas Boiler" },
    { id: "gas", label: "Gas" },
    { id: "heatingoilboiler", label: "Heating Oil Boiler" },
    { id: "shared_centralplant_boiler", label: "Shared with Central Plant Boiler" },
] as const

// step 7 - electrical options

export const VOLTAGE_OPTIONS = [
    { id: "277_480_3ph_4w", label: "277/480, 3PH 4W" },
    { id: "120_208_3ph_4w", label: "120/208, 3PH 4W" },
    { id: "120_240_1ph_3w", label: "120/240, 1PH 3W" },
] as const

export const Wiring_Method_Options = [
    { id: "copper", label: "Copper" },
    { id: "aluminum", label: "Aluminum" },
    { id: "other", label: "Other" },
] as const

export const EMERGENCY_GENERATOR_OPTIONS = [
    { id: "naturalGas", label: "Natural Gas" },
    { id: "diesel", label: "Diesel" },
    { id: "propane", label: "Propane" },
    { id: "backup_to_fls", label: "Back-up to FLS" },
] as const

export const ELECTRICAL_TANK_OPTIONS = [
    { id: "Underground", label: "Underground" },
    { id:"belly", label: "Belly" },
    { id:"adjacent", label: "Adjacent" },
] as const


//step 8 - elevator and conveying systems options

export const ELEVATOR_TYPE_OPTIONS = [
    { id: "hydraulic", label: "Hydraulic" },
    { id: "traction", label: "Traction" },
] as const

export const MACHINERY_LOCATION_OPTIONS = [
    { id: "base", label: "Base" },
    { id: "penthouse", label: "Penthouse" },
] as const

// Elevator Cab Lights Options
export const ELEVATOR_LIGHTS_OPTIONS = [
    { id: "surface", label: "Surface" },
    { id: "recessed", label: "Recessed" },
] as const

// Elevator Cab Floor Options
export const ELEVATOR_FLOOR_OPTIONS = [
    { id: "carpet", label: "Carpet" },
    { id: "vct", label: "VCT" },
    { id: "ct", label: "CT" },
    { id: "other", label: "Other" },
] as const

// Elevator Safety Stops Options
export const ELEVATOR_SAFETY_STOPS_OPTIONS = [
    { id: "infrared", label: "Infrared" },
    { id: "mechanical", label: "Mechanical" },
] as const

// Elevator Cab Wall Options
export const ELEVATOR_WALL_OPTIONS = [
    { id: "plam", label: "P-Lam" },
    { id: "ss_metal", label: "SS Metal" },
    { id: "wood_lam", label: "Wood Lam" },
] as const

// step 9 - Fire protection options

export const SMOKE_DETECTOR_OPTIONS = [
    { id: "hardwired", label: "Hardwired" },
    { id: "batteryoperated", label: "Battery Operated" },
    { id: "commonareas", label: "Common Areas" },
    { id: "tenantareas", label: "Tenant Areas" },
] as const

export const FIXTURES = [
    { id: "battery_backup_exit_lights", label: "Battery Back-up Exit Lights" },
    { id: "pull_station", label: "Pull Station" },
    { id: "alarm_horns", label: "Alarm Horns" },
    { id: "illuminated_exit_signs", label: "Illuminated Exit Signs" },
    { id: "strobes", label: "Strobes" },
    { id: "common_area_restrooms_compliant", label: "Common Area Restrooms Compliant" },
] as const

export const NEAREST_FIRE_HYDRANT_OPTIONS = [
    { id: "Street", label: "Street" },
    { id: "driveaisle", label: "Drive aisle" },
] as const


// Type exports for TypeScript
export type RefrigerantTypeId = typeof REFRIGERANT_TYPE_OPTIONS[number]["id"]
export type HeatSourceId = typeof HEAT_SOURCE_OPTIONS[number]["id"]
export type ResponsibilityId = typeof RESPONSIBILITY_OPTIONS[number]["id"]
export type PackagedUnitMountingLocationId = typeof PACKAGED_UNIT_MOUNTING_LOCATION_OPTIONS[number]["id"]
export type SplitSystemMountingLocationId = typeof SPLIT_SYSTEM_MOUNTING_LOCATION_OPTIONS[number]["id"]
export type HVACUnitTypeId = typeof HVAC_UNIT_TYPE_OPTIONS[number]["id"]
export type UnitHeaterTypeId = typeof UNIT_HEATER_TYPE_OPTIONS[number]["id"]
export type MiscUnitsHeatSourceId = typeof MISC_UNITS_HEAT_SOURCE_OPTIONS[number]["id"]
export type MiscUnitsMountingLocationId = typeof MISC_UNITS_MOUNTING_LOCATION_OPTIONS[number]["id"]
export type AirHandlerMountingLocationId = typeof AIR_HANDLER_MOUNTING_LOCATION_OPTIONS[number]["id"]
export type ExhaustLocationId = typeof EXHAUST_LOCATION_OPTIONS[number]["id"]