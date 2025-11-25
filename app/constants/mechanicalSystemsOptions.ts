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


export const MOUNTING_LOCATION_OPTIONS = [
  { id: "gradeMounted", label: "Grade-mounted" },
  { id: "rooftop", label: "Rooftop" },
  { id: "padMounted", label: "Pad-mounted" },
] as const



// Type exports for TypeScript
export type RefrigerantTypeId = typeof REFRIGERANT_TYPE_OPTIONS[number]["id"]
export type HeatSourceId = typeof HEAT_SOURCE_OPTIONS[number]["id"]
export type ResponsibilityId = typeof RESPONSIBILITY_OPTIONS[number]["id"]
export type MountingLocationId = typeof MOUNTING_LOCATION_OPTIONS[number]["id"]
