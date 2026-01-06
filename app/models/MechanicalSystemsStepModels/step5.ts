import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// PLUMBING SYSTEMS - Step 5
// ============================================

// No dynamic lists or accordions - just 4 simple system models

// ============================================
// DOMESTIC PIPING
// ============================================

export const DomesticPipingModel = types.model("DomesticPiping", {
  type: types.optional(types.array(types.string), []), // Copper, PVC, CPVC, Lead, PEX, Galvanized, Polybutylene
  observations: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      observations?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// WATER METER
// ============================================

export const WaterMeterModel = types.model("WaterMeter", {
  type: types.optional(types.array(types.string), []), // Mechanical Room, Vault
  observations: types.optional(types.string, ""),
  
  // Booster Pumps
  hasBoosterPumps: types.optional(types.boolean, false), // No/Yes
  boosterPumpsQuantity: types.optional(types.number, 0),
  boosterPumpsGPM: types.optional(types.number, 0),
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      observations?: string
      hasBoosterPumps?: boolean
      boosterPumpsQuantity?: number
      boosterPumpsGPM?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.hasBoosterPumps !== undefined) self.hasBoosterPumps = data.hasBoosterPumps
      if (data.boosterPumpsQuantity !== undefined) self.boosterPumpsQuantity = data.boosterPumpsQuantity
      if (data.boosterPumpsGPM !== undefined) self.boosterPumpsGPM = data.boosterPumpsGPM
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// WASTE PIPING
// ============================================

export const WastePipingModel = types.model("WastePiping", {
  type: types.optional(types.array(types.string), []), // PVC, Cast Iron, ABS, Copper
  observations: types.optional(types.string, ""),
  
  // Sewer Lift Station
  hasSewerLiftStation: types.optional(types.boolean, false), // No/Yes
  sewerLiftStationLocation: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      observations?: string
      hasSewerLiftStation?: boolean
      sewerLiftStationLocation?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.hasSewerLiftStation !== undefined) self.hasSewerLiftStation = data.hasSewerLiftStation
      if (data.sewerLiftStationLocation !== undefined) self.sewerLiftStationLocation = data.sewerLiftStationLocation
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// NATURAL GAS PIPE
// ============================================

export const NaturalGasPipeModel = types.model("NaturalGasPipe", {
  type: types.optional(types.array(types.string), []), // Black Fe, Al, Galv Steel, Flex Steel
  observations: types.optional(types.string, ""),
  gasMeterLocation: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      observations?: string
      gasMeterLocation?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.gasMeterLocation !== undefined) self.gasMeterLocation = data.gasMeterLocation
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines all 4 plumbing system models
// ============================================

export const MechanicalSystemsStep5 = types.model("MechanicalSystemsStep5", {
  domesticPiping: types.optional(DomesticPipingModel, {}),
  waterMeter: types.optional(WaterMeterModel, {}),
  wastePiping: types.optional(WastePipingModel, {}),
  naturalGasPipe: types.optional(NaturalGasPipeModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateDomesticPiping(data: Parameters<typeof self.domesticPiping.update>[0]) {
      self.domesticPiping.update(data)
      self.lastModified = new Date()
    },
    
    updateWaterMeter(data: Parameters<typeof self.waterMeter.update>[0]) {
      self.waterMeter.update(data)
      self.lastModified = new Date()
    },
    
    updateWastePiping(data: Parameters<typeof self.wastePiping.update>[0]) {
      self.wastePiping.update(data)
      self.lastModified = new Date()
    },
    
    updateNaturalGasPipe(data: Parameters<typeof self.naturalGasPipe.update>[0]) {
      self.naturalGasPipe.update(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

