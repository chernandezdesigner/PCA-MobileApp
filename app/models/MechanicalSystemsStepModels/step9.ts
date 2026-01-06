import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// FIRE PROTECTION - Step 9
// ============================================

// ============================================
// SMOKE DETECTION ACCORDION
// ============================================

export const SmokeDetectionAccordionModel = types.model("SmokeDetectionAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Smoke Detectors
  smokeDetectorType: types.optional(types.array(types.string), []), // Hard, Battery
  smokeDetectorLocation: types.optional(types.array(types.string), []), // Common Areas, Tenant Areas
  
  // Fire Alarm Panel
  fireAlarmPanelLocation: types.optional(types.string, ""),
  fireAlarmPanelAge: types.optional(types.number, 0),
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      smokeDetectorType?: string[]
      smokeDetectorLocation?: string[]
      fireAlarmPanelLocation?: string
      fireAlarmPanelAge?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.smokeDetectorType !== undefined) self.smokeDetectorType.replace(data.smokeDetectorType)
      if (data.smokeDetectorLocation !== undefined) self.smokeDetectorLocation.replace(data.smokeDetectorLocation)
      if (data.fireAlarmPanelLocation !== undefined) self.fireAlarmPanelLocation = data.fireAlarmPanelLocation
      if (data.fireAlarmPanelAge !== undefined) self.fireAlarmPanelAge = data.fireAlarmPanelAge
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// FIRE EXTINGUISHERS ACCORDION
// ============================================

export const FireExtinguishersAccordionModel = types.model("FireExtinguishersAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  inspectionDate: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      inspectionDate?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.inspectionDate !== undefined) self.inspectionDate = data.inspectionDate
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// FIRE ALARM FIXTURES ACCORDION
// ============================================

export const FireAlarmFixturesAccordionModel = types.model("FireAlarmFixturesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  fixtures: types.optional(types.array(types.string), []), // Battery Back-up Exit Lights, Pull Station, Alarm Horns, etc.
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      fixtures?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.fixtures !== undefined) self.fixtures.replace(data.fixtures)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// SPRINKLER SYSTEM ACCORDION
// ============================================

export const SprinklerSystemAccordionModel = types.model("SprinklerSystemAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  hasBackflowPreventer: types.optional(types.boolean, false),
  standpipeLocations: types.optional(types.string, ""),
  location: types.optional(types.array(types.string), []), // Near Riser, Exterior Vault
  sprinklerHeadManufacturerList: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      hasBackflowPreventer?: boolean
      standpipeLocations?: string
      location?: string[]
      sprinklerHeadManufacturerList?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.hasBackflowPreventer !== undefined) self.hasBackflowPreventer = data.hasBackflowPreventer
      if (data.standpipeLocations !== undefined) self.standpipeLocations = data.standpipeLocations
      if (data.location !== undefined) self.location.replace(data.location)
      if (data.sprinklerHeadManufacturerList !== undefined) self.sprinklerHeadManufacturerList = data.sprinklerHeadManufacturerList
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// FIRE PUMP ACCORDION
// ============================================

export const FirePumpAccordionModel = types.model("FirePumpAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  diesel: types.optional(types.boolean, false),
  tankGallons: types.optional(types.number, 0),
  gpmElectric: types.optional(types.boolean, false),
  storageTankLocation: types.optional(types.string, ""),
  nearestFireHydrant: types.optional(types.array(types.string), []), // Street, Drive Aisle
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      diesel?: boolean
      tankGallons?: number
      gpmElectric?: boolean
      storageTankLocation?: string
      nearestFireHydrant?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.diesel !== undefined) self.diesel = data.diesel
      if (data.tankGallons !== undefined) self.tankGallons = data.tankGallons
      if (data.gpmElectric !== undefined) self.gpmElectric = data.gpmElectric
      if (data.storageTankLocation !== undefined) self.storageTankLocation = data.storageTankLocation
      if (data.nearestFireHydrant !== undefined) self.nearestFireHydrant.replace(data.nearestFireHydrant)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// SMOKE EVACUATION SYSTEM ACCORDION
// ============================================

export const SmokeEvacuationSystemAccordionModel = types.model("SmokeEvacuationSystemAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  hasSmokeEvacSystem: types.optional(types.boolean, false),
  hasStairPressurization: types.optional(types.boolean, false),
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      hasSmokeEvacSystem?: boolean
      hasStairPressurization?: boolean
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.hasSmokeEvacSystem !== undefined) self.hasSmokeEvacSystem = data.hasSmokeEvacSystem
      if (data.hasStairPressurization !== undefined) self.hasStairPressurization = data.hasStairPressurization
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// FIRE EXIT STAIRWELL ACCORDION
// ============================================

export const FireExitStairwellAccordionModel = types.model("FireExitStairwellAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  hasFireExitStairwell: types.optional(types.boolean, false),
  finish: types.optional(types.array(types.string), []), // Drywall, CMU
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      hasFireExitStairwell?: boolean
      finish?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.hasFireExitStairwell !== undefined) self.hasFireExitStairwell = data.hasFireExitStairwell
      if (data.finish !== undefined) self.finish.replace(data.finish)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// ANSUL SYSTEM ACCORDION
// ============================================

export const AnsulSystemAccordionModel = types.model("AnsulSystemAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  hasAnsulSystem: types.optional(types.boolean, false),
  tenantOwned: types.optional(types.boolean, false), // Y/N
  dischargeTo: types.optional(types.array(types.string), []), // Exterior, Common Area
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      hasAnsulSystem?: boolean
      tenantOwned?: boolean
      dischargeTo?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.hasAnsulSystem !== undefined) self.hasAnsulSystem = data.hasAnsulSystem
      if (data.tenantOwned !== undefined) self.tenantOwned = data.tenantOwned
      if (data.dischargeTo !== undefined) self.dischargeTo.replace(data.dischargeTo)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// MAIN STEP MODEL
// ============================================

export const MechanicalSystemsStep9 = types.model("MechanicalSystemsStep9", {
  // Top-level fields
  systemType: types.optional(types.string, ""), // N/A, Limited, Full
  systemCondition: types.optional(types.array(types.string), []), // Wet, Dry
  percentSprinklered: types.optional(types.number, 0),
  lastInspection: types.optional(types.string, ""),
  
  // Accordions
  smokeDetection: types.optional(SmokeDetectionAccordionModel, {}),
  fireExtinguishers: types.optional(FireExtinguishersAccordionModel, {}),
  fireAlarmFixtures: types.optional(FireAlarmFixturesAccordionModel, {}),
  sprinklerSystem: types.optional(SprinklerSystemAccordionModel, {}),
  firePump: types.optional(FirePumpAccordionModel, {}),
  smokeEvacuationSystem: types.optional(SmokeEvacuationSystemAccordionModel, {}),
  fireExitStairwell: types.optional(FireExitStairwellAccordionModel, {}),
  ansulSystem: types.optional(AnsulSystemAccordionModel, {}),
  
  additionalComments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateTopLevel(data: {
      systemType?: string
      systemCondition?: string[]
      percentSprinklered?: number
      lastInspection?: string
    }) {
      if (data.systemType !== undefined) self.systemType = data.systemType
      if (data.systemCondition !== undefined) self.systemCondition.replace(data.systemCondition)
      if (data.percentSprinklered !== undefined) self.percentSprinklered = data.percentSprinklered
      if (data.lastInspection !== undefined) self.lastInspection = data.lastInspection
      self.lastModified = new Date()
    },
    
    // ============================================
    // ACCORDION UPDATE ACTIONS
    // ============================================
    
    updateSmokeDetection(data: {
      NotApplicable?: boolean
      smokeDetectorType?: string[]
      smokeDetectorLocation?: string[]
      fireAlarmPanelLocation?: string
      fireAlarmPanelAge?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.smokeDetection.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateFireExtinguishers(data: {
      NotApplicable?: boolean
      inspectionDate?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.fireExtinguishers.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateFireAlarmFixtures(data: {
      NotApplicable?: boolean
      fixtures?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.fireAlarmFixtures.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateSprinklerSystem(data: {
      NotApplicable?: boolean
      hasBackflowPreventer?: boolean
      standpipeLocations?: string
      location?: string[]
      sprinklerHeadManufacturerList?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.sprinklerSystem.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateFirePump(data: {
      NotApplicable?: boolean
      diesel?: boolean
      tankGallons?: number
      gpmElectric?: boolean
      storageTankLocation?: string
      nearestFireHydrant?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.firePump.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateSmokeEvacuationSystem(data: {
      NotApplicable?: boolean
      hasSmokeEvacSystem?: boolean
      hasStairPressurization?: boolean
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.smokeEvacuationSystem.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateFireExitStairwell(data: {
      NotApplicable?: boolean
      hasFireExitStairwell?: boolean
      finish?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.fireExitStairwell.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateAnsulSystem(data: {
      NotApplicable?: boolean
      hasAnsulSystem?: boolean
      tenantOwned?: boolean
      dischargeTo?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.ansulSystem.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateAdditionalComments(value: string) {
      self.additionalComments = value
      self.lastModified = new Date()
    },
  }))

