import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// WATER HEATERS - Step 6
// ============================================

// 6 separate accordion models:
// 1. Common Area Water Heater
// 2. Heated Water Pumps - Common Area
// 3. Water Storage Tanks - Common Area
// 4. Tenant Spaces Water Heater
// 5. Heated Water Pumps - Tenant Spaces
// 6. Water Storage Tanks - Tenant Spaces

// ============================================
// WATER HEATER BASE MODEL (Reusable)
// ============================================

export const WaterHeaterBaseModel = types.model("WaterHeaterBase", {
  // Type: N/A, Electric Boiler, Electric, Gas Boiler, Gas, Heating Oil Boiler, Shared with Central Plant Boiler
  type: types.optional(types.array(types.string), []),
  
  // Basic Info
  quantity: types.optional(types.number, 0),
  capacity: types.optional(types.number, 0), // BTU, Watts
  yearInstalled: types.optional(types.number, 0),
  yearRebuild: types.optional(types.number, 0),
  
  // Location
  locationOfEach: types.optional(types.string, ""),
  
  // Assessment & Cost
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      quantity?: number
      capacity?: number
      yearInstalled?: number
      yearRebuild?: number
      locationOfEach?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacity !== undefined) self.capacity = data.capacity
      if (data.yearInstalled !== undefined) self.yearInstalled = data.yearInstalled
      if (data.yearRebuild !== undefined) self.yearRebuild = data.yearRebuild
      if (data.locationOfEach !== undefined) self.locationOfEach = data.locationOfEach
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// HEATED WATER PUMPS MODEL (Reusable)
// ============================================

export const HeatedWaterPumpsModel = types.model("HeatedWaterPumps", {
  description: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      description?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.description !== undefined) self.description = data.description
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// WATER STORAGE TANKS MODEL (Reusable)
// ============================================

export const WaterStorageTanksModel = types.model("WaterStorageTanks", {
  quantity: types.optional(types.number, 0),
  capacity: types.optional(types.number, 0),
  yearInstalled: types.optional(types.number, 0),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      quantity?: number
      capacity?: number
      yearInstalled?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacity !== undefined) self.capacity = data.capacity
      if (data.yearInstalled !== undefined) self.yearInstalled = data.yearInstalled
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines all 6 accordion models
// ============================================

export const MechanicalSystemsStep6 = types.model("MechanicalSystemsStep6", {
  // Common Area
  commonAreaWaterHeater: types.optional(WaterHeaterBaseModel, {}),
  commonAreaHeatedWaterPumps: types.optional(HeatedWaterPumpsModel, {}),
  commonAreaWaterStorageTanks: types.optional(WaterStorageTanksModel, {}),
  
  // Tenant Spaces
  tenantSpacesWaterHeater: types.optional(WaterHeaterBaseModel, {}),
  tenantSpacesHeatedWaterPumps: types.optional(HeatedWaterPumpsModel, {}),
  tenantSpacesWaterStorageTanks: types.optional(WaterStorageTanksModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    // Common Area Water Heater
    updateCommonAreaWaterHeater(data: Parameters<typeof self.commonAreaWaterHeater.update>[0]) {
      self.commonAreaWaterHeater.update(data)
      self.lastModified = new Date()
    },
    
    // Common Area Heated Water Pumps
    updateCommonAreaHeatedWaterPumps(data: Parameters<typeof self.commonAreaHeatedWaterPumps.update>[0]) {
      self.commonAreaHeatedWaterPumps.update(data)
      self.lastModified = new Date()
    },
    
    // Common Area Water Storage Tanks
    updateCommonAreaWaterStorageTanks(data: Parameters<typeof self.commonAreaWaterStorageTanks.update>[0]) {
      self.commonAreaWaterStorageTanks.update(data)
      self.lastModified = new Date()
    },
    
    // Tenant Spaces Water Heater
    updateTenantSpacesWaterHeater(data: Parameters<typeof self.tenantSpacesWaterHeater.update>[0]) {
      self.tenantSpacesWaterHeater.update(data)
      self.lastModified = new Date()
    },
    
    // Tenant Spaces Heated Water Pumps
    updateTenantSpacesHeatedWaterPumps(data: Parameters<typeof self.tenantSpacesHeatedWaterPumps.update>[0]) {
      self.tenantSpacesHeatedWaterPumps.update(data)
      self.lastModified = new Date()
    },
    
    // Tenant Spaces Water Storage Tanks
    updateTenantSpacesWaterStorageTanks(data: Parameters<typeof self.tenantSpacesWaterStorageTanks.update>[0]) {
      self.tenantSpacesWaterStorageTanks.update(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

