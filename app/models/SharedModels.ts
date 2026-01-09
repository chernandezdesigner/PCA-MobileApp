// app/models/SharedModels.ts
import { types } from "mobx-state-tree"

export const ConditionEnum = types.enumeration("ConditionEnum", ["good", "fair", "poor"])
export const RepairStatusEnum = types.enumeration("RepairStatusEnum", ["IR", "ST", "RR", "RM", "INV", "NA"])

export const ConditionAssessment = types.model("ConditionAssessment", {
  condition: types.maybe(ConditionEnum),
  repairStatus: types.maybe(RepairStatusEnum),
  amountToRepair: types.optional(types.string, ""),
})

export const RepairAssessment = types.model("RepairAssessment", {
  repairStatus: types.maybe(RepairStatusEnum),
  amountToRepair: types.optional(types.string, ""),
})

export const ConditionAssessmentwithEffAge = types.model("ConditionAssessmentwithEffAge", {
  condition: types.maybe(ConditionEnum),
  repairStatus: types.maybe(RepairStatusEnum),
  amountToRepair: types.optional(types.string, ""),
  effectiveAge: types.optional(types.number, 0),
})

// ============================================
// FORM 4: HVAC Individual Units - Shared Models
// ============================================

/**
 * Base model for MOST HVAC systems
 * Used by: Packaged Units, Split Systems (Condenser & Heat Pump)
 * Has: Refrigerant, Capacity, Age brackets, Heat source, Responsibilities
 */
export const HVACUnitBaseModel = types.model("HVACUnitBase", {
  // Basic Info
  quantity: types.optional(types.number, 0),
  capacityRangeTons: types.optional(types.string, ""), // e.g., "3-5"
  totalCapacityTons: types.optional(types.number, 0),
  
  // Age Brackets - Tonnage per bracket (0-10, 11-20, 21+)
  age0to10Tons: types.optional(types.number, 0),
  age11to20Tons: types.optional(types.number, 0),
  age21PlusTons: types.optional(types.number, 0),
  
  // Heat Source (Natural Gas or Electric)
  heatSource: types.optional(types.string, ""), // "naturalGas" | "electric" | ""
  
  // Refrigerant Type
  refrigerantType: types.optional(types.string, ""), // "r22" | "r410" | "other"
  refrigerantOtherSpec: types.optional(types.string, ""), // When "other" selected
  
  // Responsibilities (Maintenance & Replacement)
  maintenanceResponsibility: types.optional(types.string, ""), // "unk" | "owner" | "tenant" | "varies"
  replacementResponsibility: types.optional(types.string, ""),

  assessment: types.optional(ConditionAssessment, {}),
  

})
.actions((self) => ({
    update(data: { assessment?: Record<string, any> }) {
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

//hvac unit base model without the refrigerant type and other specific
export const HVACUnitBaseModelWithoutRefrigerantAndOtherSpec = types.model("HVACUnitBaseWithoutRefrigerantAndOtherSpec", {
  // Basic Info
  quantity: types.optional(types.number, 0),
  capacityRangeTons: types.optional(types.string, ""), // e.g., "3-5"
  totalCapacityTons: types.optional(types.number, 0),
  
  // Age Brackets - Tonnage per bracket (0-10, 11-20, 21+)
  age0to10Tons: types.optional(types.number, 0),
  age11to20Tons: types.optional(types.number, 0),
  age21PlusTons: types.optional(types.number, 0),

  assessment: types.optional(ConditionAssessment, {}),
  

})
.actions((self) => ({
    update(data: { assessment?: Record<string, any> }) {
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

//unit manufacturer and specifics dynamic list

export const UnitManufacturerAndSpecificsModel = types.model("UnitManufacturerAndSpecificsModel", {
  id: types.identifier,
  manufacturer: types.optional(types.string, ""),
  quantity: types.optional(types.number, 0),
  tenantSpace: types.optional(types.string, ""),
  approxTonnage: types.optional(types.number, 0),
  approxAge: types.optional(types.number, 0),
  type: types.optional(types.string, ""),
})
.actions((self) => ({
    update(data: { manufacturer?: string; quantity?: number; tenantSpace?: string; approxTonnage?: number; approxAge?: number; type?: string }) {
        if (data.manufacturer !== undefined) self.manufacturer = data.manufacturer
        if (data.quantity !== undefined) self.quantity = data.quantity
        if (data.tenantSpace !== undefined) self.tenantSpace = data.tenantSpace
        if (data.approxTonnage !== undefined) self.approxTonnage = data.approxTonnage
        if (data.approxAge !== undefined) self.approxAge = data.approxAge
        if (data.type !== undefined) self.type = data.type
    },
}))



/**
 * Furnace-specific model
 * Different from HVACUnitBase: has Location field instead of Refrigerant
 * Simpler structure - no age brackets with tonnage
 */
export const FurnaceBaseModel = types.model("FurnaceBase", {
  // Basic Info
  quantity: types.optional(types.number, 0),
  
  // Location (where in building: attic, basement, etc.)
  location: types.optional(types.string, ""), // "attic" | "basement" | "closet" | etc

  
  // Heat Source (Natural Gas or Electric)
  heatSource: types.optional(types.string, ""), // "naturalGas" | "electric"
  
  // Responsibilities
  maintenanceResponsibility: types.optional(types.string, ""),
  replacementResponsibility: types.optional(types.string, ""),
})

