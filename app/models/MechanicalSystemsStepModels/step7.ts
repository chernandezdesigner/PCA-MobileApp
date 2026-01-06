import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// ELECTRICAL - Step 7
// ============================================

// ============================================
// TRANSFORMERS
// ============================================

export const TransformersModel = types.model("Transformers", {
  // Pad & Pole-mounted
  hasPad: types.optional(types.boolean, false),
  padQuantity: types.optional(types.number, 0),
  hasPoleMounted: types.optional(types.boolean, false),
  poleMountedQuantity: types.optional(types.number, 0),
  
  // Technical specs
  amps: types.optional(types.number, 0),
  voltage: types.optional(types.array(types.string), []), // 277/480,3PH 4W | 120/208, 3PH 4W | 120/240, 1PH 3W
  wiring: types.optional(types.array(types.string), []), // Copper, AL
  
  // Assessment & Cost
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      hasPad?: boolean
      padQuantity?: number
      hasPoleMounted?: boolean
      poleMountedQuantity?: number
      amps?: number
      voltage?: string[]
      wiring?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.hasPad !== undefined) self.hasPad = data.hasPad
      if (data.padQuantity !== undefined) self.padQuantity = data.padQuantity
      if (data.hasPoleMounted !== undefined) self.hasPoleMounted = data.hasPoleMounted
      if (data.poleMountedQuantity !== undefined) self.poleMountedQuantity = data.poleMountedQuantity
      if (data.amps !== undefined) self.amps = data.amps
      if (data.voltage !== undefined) self.voltage.replace(data.voltage)
      if (data.wiring !== undefined) self.wiring.replace(data.wiring)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// MAIN ELECTRICAL
// ============================================

export const MainElectricalModel = types.model("MainElectrical", {
  amps: types.optional(types.number, 0),
  voltage: types.optional(types.array(types.string), []),
  wiring: types.optional(types.array(types.string), []),
})
  .actions((self) => ({
    update(data: {
      amps?: number
      voltage?: string[]
      wiring?: string[]
    }) {
      if (data.amps !== undefined) self.amps = data.amps
      if (data.voltage !== undefined) self.voltage.replace(data.voltage)
      if (data.wiring !== undefined) self.wiring.replace(data.wiring)
    },
  }))

// ============================================
// TENANT/APT ELECTRICAL
// ============================================

export const TenantAptElectricalModel = types.model("TenantAptElectrical", {
  amps: types.optional(types.number, 0),
  voltage: types.optional(types.array(types.string), []),
  wiring: types.optional(types.array(types.string), []),
})
  .actions((self) => ({
    update(data: {
      amps?: number
      voltage?: string[]
      wiring?: string[]
    }) {
      if (data.amps !== undefined) self.amps = data.amps
      if (data.voltage !== undefined) self.voltage.replace(data.voltage)
      if (data.wiring !== undefined) self.wiring.replace(data.wiring)
    },
  }))

// ============================================
// EMERGENCY GENERATOR (Reusable for Generator 1 & 2)
// ============================================

export const EmergencyGeneratorModel = types.model("EmergencyGenerator", {
  type: types.optional(types.array(types.string), []), // Natural Gas, Diesel, Propane, Back-up to FLS
  effAge: types.optional(types.number, 0),
  kVa: types.optional(types.number, 0),
  kw: types.optional(types.number, 0),
  tank: types.optional(types.array(types.string), []), // Underground, Belly, Adjacent
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      effAge?: number
      kVa?: number
      kw?: number
      tank?: string[]
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.effAge !== undefined) self.effAge = data.effAge
      if (data.kVa !== undefined) self.kVa = data.kVa
      if (data.kw !== undefined) self.kw = data.kw
      if (data.tank !== undefined) self.tank.replace(data.tank)
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines all electrical systems
// ============================================

export const MechanicalSystemsStep7 = types.model("MechanicalSystemsStep7", {
  transformers: types.optional(TransformersModel, {}),
  main: types.optional(MainElectricalModel, {}),
  tenantApt: types.optional(TenantAptElectricalModel, {}),
  emergencyGenerator1: types.optional(EmergencyGeneratorModel, {}),
  emergencyGenerator2: types.optional(EmergencyGeneratorModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateTransformers(data: Parameters<typeof self.transformers.update>[0]) {
      self.transformers.update(data)
      self.lastModified = new Date()
    },
    
    updateMain(data: Parameters<typeof self.main.update>[0]) {
      self.main.update(data)
      self.lastModified = new Date()
    },
    
    updateTenantApt(data: Parameters<typeof self.tenantApt.update>[0]) {
      self.tenantApt.update(data)
      self.lastModified = new Date()
    },
    
    updateEmergencyGenerator1(data: Parameters<typeof self.emergencyGenerator1.update>[0]) {
      self.emergencyGenerator1.update(data)
      self.lastModified = new Date()
    },
    
    updateEmergencyGenerator2(data: Parameters<typeof self.emergencyGenerator2.update>[0]) {
      self.emergencyGenerator2.update(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

