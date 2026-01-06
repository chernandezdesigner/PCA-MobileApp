import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// WATER HEATERS - Step 6
// ============================================

// Two separate water heater systems: Common Area & Tenant Spaces
// Each has the same structure (no dynamic lists)

// ============================================
// WATER HEATER MODEL (Reusable for both systems)
// ============================================

export const WaterHeaterModel = types.model("WaterHeater", {
  // Type: N/A, Electric Boiler, Electric, Gas Boiler, Gas, Heating Oil Boiler, Shared with Central Plant Boiler
  type: types.optional(types.array(types.string), []),
  
  // Basic Info
  quantity: types.optional(types.number, 0),
  capacity: types.optional(types.number, 0), // BTU, Watts
  yearInstalled: types.optional(types.number, 0),
  yearRebuild: types.optional(types.number, 0),
  
  // Location & Pumps
  locationOfEach: types.optional(types.string, ""),
  heatedWaterPumps: types.optional(types.string, ""),
  
  // Assessment & Cost
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
  
  // Water Storage Tanks (conditional)
  hasWaterStorageTanks: types.optional(types.boolean, false),
  waterStorageTanksQuantity: types.optional(types.number, 0),
  waterStorageTanksCapacity: types.optional(types.number, 0),
  waterStorageTanksYearInstalled: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      quantity?: number
      capacity?: number
      yearInstalled?: number
      yearRebuild?: number
      locationOfEach?: string
      heatedWaterPumps?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
      hasWaterStorageTanks?: boolean
      waterStorageTanksQuantity?: number
      waterStorageTanksCapacity?: number
      waterStorageTanksYearInstalled?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacity !== undefined) self.capacity = data.capacity
      if (data.yearInstalled !== undefined) self.yearInstalled = data.yearInstalled
      if (data.yearRebuild !== undefined) self.yearRebuild = data.yearRebuild
      if (data.locationOfEach !== undefined) self.locationOfEach = data.locationOfEach
      if (data.heatedWaterPumps !== undefined) self.heatedWaterPumps = data.heatedWaterPumps
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
      if (data.hasWaterStorageTanks !== undefined) self.hasWaterStorageTanks = data.hasWaterStorageTanks
      if (data.waterStorageTanksQuantity !== undefined) self.waterStorageTanksQuantity = data.waterStorageTanksQuantity
      if (data.waterStorageTanksCapacity !== undefined) self.waterStorageTanksCapacity = data.waterStorageTanksCapacity
      if (data.waterStorageTanksYearInstalled !== undefined) self.waterStorageTanksYearInstalled = data.waterStorageTanksYearInstalled
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines Common Area & Tenant Spaces water heaters
// ============================================

export const MechanicalSystemsStep6 = types.model("MechanicalSystemsStep6", {
  commonAreaWaterHeater: types.optional(WaterHeaterModel, {}),
  tenantSpacesWaterHeater: types.optional(WaterHeaterModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateCommonAreaWaterHeater(data: Parameters<typeof self.commonAreaWaterHeater.update>[0]) {
      self.commonAreaWaterHeater.update(data)
      self.lastModified = new Date()
    },
    
    updateTenantSpacesWaterHeater(data: Parameters<typeof self.tenantSpacesWaterHeater.update>[0]) {
      self.tenantSpacesWaterHeater.update(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

