import { types, destroy } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// MISC UNITS - Step 2
// ============================================

// ============================================
// INDIVIDUAL UNIT MODELS
// Each unit has technical specs + assessment
// Observations/Areas/Responsibilities are at accordion level
// ============================================

/**
 * Unit Heater Model (Individual Unit)
 * Contains: Type, Quantity, Capacity, Heat Source, Mounted Location, Assessment
 */
export const UnitHeaterModel = types.model("UnitHeater", {
  id: types.identifier,
  type: types.optional(types.string, ""), // Radiant, Baseboard, Wall-mounted
  quantity: types.optional(types.number, 0),
  capacityRange: types.optional(types.string, ""),
  heatSource: types.optional(types.array(types.string), []), // N/A, Natural Gas, Boiler, Electric
  mounted: types.optional(types.array(types.string), []), // Baseboard, Ceiling, Wall
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    update(data: {
      type?: string
      quantity?: number
      capacityRange?: string
      heatSource?: string[]
      mounted?: string[]
      assessment?: Record<string, any>
    }) {
      if (data.type !== undefined) self.type = data.type
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacityRange !== undefined) self.capacityRange = data.capacityRange
      if (data.heatSource !== undefined) self.heatSource.replace(data.heatSource)
      if (data.mounted !== undefined) self.mounted.replace(data.mounted)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

/**
 * Air Handling Unit Model (Individual Unit)
 * Contains: Quantity, CFM, Heat Source, Mounted Location, Assessment
 */
export const AirHandlingUnitModel = types.model("AirHandlingUnit", {
  id: types.identifier,
  quantity: types.optional(types.number, 0),
  cfm: types.optional(types.number, 0),
  heatSource: types.optional(types.array(types.string), []), // N/A, Natural Gas, Boiler, Electric
  mounted: types.optional(types.array(types.string), []), // Closet, Ceiling, Wall, HVAC Room
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    update(data: {
      quantity?: number
      cfm?: number
      heatSource?: string[]
      mounted?: string[]
      assessment?: Record<string, any>
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.cfm !== undefined) self.cfm = data.cfm
      if (data.heatSource !== undefined) self.heatSource.replace(data.heatSource)
      if (data.mounted !== undefined) self.mounted.replace(data.mounted)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

/**
 * Exhaust Fan Model (Individual Unit)
 * Contains: Quantity, Location (no assessment per screenshot)
 */
export const ExhaustFanModel = types.model("ExhaustFan", {
  id: types.identifier,
  quantity: types.optional(types.number, 0),
  location: types.optional(types.array(types.string), []), // Roof-mounted, Wall-mounted
})
  .actions((self) => ({
    update(data: {
      quantity?: number
      location?: string[]
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.location !== undefined) self.location.replace(data.location)
    },
  }))

// ============================================
// ACCORDION MODELS
// Each accordion contains:
// - NotApplicable flag
// - Dynamic array of units (max 3)
// - Shared fields: observations, areas served, responsibilities
// ============================================

/**
 * Unit Heaters Accordion
 * Contains up to 3 unit heaters + shared fields
 */
export const UnitHeatersAccordionModel = types.model("UnitHeatersAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(UnitHeaterModel), []),
  
  // Shared fields at accordion level
  observationsIssues: types.optional(types.string, ""),
  areasServed: types.optional(types.string, ""),
  maintenanceResponsibility: types.optional(types.array(types.string), []), // Unk, Owner, Tenant, Varies
  replacementResponsibility: types.optional(types.array(types.string), []), // Unk, Owner, Tenant, Varies
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
      observationsIssues?: string
      areasServed?: string
      maintenanceResponsibility?: string[]
      replacementResponsibility?: string[]
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.observationsIssues !== undefined) self.observationsIssues = data.observationsIssues
      if (data.areasServed !== undefined) self.areasServed = data.areasServed
      if (data.maintenanceResponsibility !== undefined) self.maintenanceResponsibility.replace(data.maintenanceResponsibility)
      if (data.replacementResponsibility !== undefined) self.replacementResponsibility.replace(data.replacementResponsibility)
    },
    
    addUnit(
      type: string,
      quantity: number,
      capacityRange: string,
      heatSource: string[],
      mounted: string[],
    ) {
      if (self.units.length >= 3) {
        console.warn("Cannot add more than 3 Unit Heaters")
        return null
      }
      
      const id = `unitheat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        type,
        quantity,
        capacityRange,
        heatSource,
        mounted,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      type?: string
      quantity?: number
      capacityRange?: string
      heatSource?: string[]
      mounted?: string[]
      assessment?: Record<string, any>
    }) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) unit.update(data)
    },
  }))

/**
 * Air Handling Units Accordion
 * Contains up to 3 air handling units + shared fields
 */
export const AirHandlingUnitsAccordionModel = types.model("AirHandlingUnitsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(AirHandlingUnitModel), []),
  
  // Shared fields at accordion level
  observationsIssues: types.optional(types.string, ""),
  areasServed: types.optional(types.string, ""),
  maintenanceResponsibility: types.optional(types.array(types.string), []),
  replacementResponsibility: types.optional(types.array(types.string), []),
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
      observationsIssues?: string
      areasServed?: string
      maintenanceResponsibility?: string[]
      replacementResponsibility?: string[]
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.observationsIssues !== undefined) self.observationsIssues = data.observationsIssues
      if (data.areasServed !== undefined) self.areasServed = data.areasServed
      if (data.maintenanceResponsibility !== undefined) self.maintenanceResponsibility.replace(data.maintenanceResponsibility)
      if (data.replacementResponsibility !== undefined) self.replacementResponsibility.replace(data.replacementResponsibility)
    },
    
    addUnit(
      quantity: number,
      cfm: number,
      heatSource: string[],
      mounted: string[],
    ) {
      if (self.units.length >= 3) {
        console.warn("Cannot add more than 3 Air Handling Units")
        return null
      }
      
      const id = `airhandler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        quantity,
        cfm,
        heatSource,
        mounted,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      quantity?: number
      cfm?: number
      heatSource?: string[]
      mounted?: string[]
      assessment?: Record<string, any>
    }) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) unit.update(data)
    },
  }))

/**
 * Exhaust Fans Accordion
 * Contains up to 3 exhaust fans + shared fields
 */
export const ExhaustFansAccordionModel = types.model("ExhaustFansAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(ExhaustFanModel), []),
  
  // Shared fields at accordion level
  observationsIssues: types.optional(types.string, ""),
  areasServed: types.optional(types.string, ""),
  maintenanceResponsibility: types.optional(types.array(types.string), []),
  replacementResponsibility: types.optional(types.array(types.string), []),
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
      observationsIssues?: string
      areasServed?: string
      maintenanceResponsibility?: string[]
      replacementResponsibility?: string[]
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.observationsIssues !== undefined) self.observationsIssues = data.observationsIssues
      if (data.areasServed !== undefined) self.areasServed = data.areasServed
      if (data.maintenanceResponsibility !== undefined) self.maintenanceResponsibility.replace(data.maintenanceResponsibility)
      if (data.replacementResponsibility !== undefined) self.replacementResponsibility.replace(data.replacementResponsibility)
    },
    
    addUnit(
      quantity: number,
      location: string[],
    ) {
      if (self.units.length >= 3) {
        console.warn("Cannot add more than 3 Exhaust Fans")
        return null
      }
      
      const id = `exhaust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        quantity,
        location,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      quantity?: number
      location?: string[]
    }) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) unit.update(data)
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines all accordion models
// ============================================

export const MechanicalSystemsStep2 = types.model("MechanicalSystemsStep2", {
  unitHeaters: types.optional(UnitHeatersAccordionModel, {}),
  airHandlingUnits: types.optional(AirHandlingUnitsAccordionModel, {}),
  exhaustFans: types.optional(ExhaustFansAccordionModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateUnitHeaters(data: Parameters<typeof self.unitHeaters.update>[0]) {
      self.unitHeaters.update(data)
      self.lastModified = new Date()
    },
    
    updateAirHandlingUnits(data: Parameters<typeof self.airHandlingUnits.update>[0]) {
      self.airHandlingUnits.update(data)
      self.lastModified = new Date()
    },
    
    updateExhaustFans(data: Parameters<typeof self.exhaustFans.update>[0]) {
      self.exhaustFans.update(data)
      self.lastModified = new Date()
    },
    
    // Unit Heaters dynamic actions
    addUnitHeater(
      type: string,
      quantity: number,
      capacityRange: string,
      heatSource: string[],
      mounted: string[],
    ) {
      const id = self.unitHeaters.addUnit(type, quantity, capacityRange, heatSource, mounted)
      self.lastModified = new Date()
      return id
    },
    
    removeUnitHeater(id: string) {
      self.unitHeaters.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updateUnitHeater(id: string, data: {
      type?: string
      quantity?: number
      capacityRange?: string
      heatSource?: string[]
      mounted?: string[]
      assessment?: Record<string, any>
    }) {
      self.unitHeaters.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    // Air Handling Units dynamic actions
    addAirHandlingUnit(
      quantity: number,
      cfm: number,
      heatSource: string[],
      mounted: string[],
    ) {
      const id = self.airHandlingUnits.addUnit(quantity, cfm, heatSource, mounted)
      self.lastModified = new Date()
      return id
    },
    
    removeAirHandlingUnit(id: string) {
      self.airHandlingUnits.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updateAirHandlingUnit(id: string, data: {
      quantity?: number
      cfm?: number
      heatSource?: string[]
      mounted?: string[]
      assessment?: Record<string, any>
    }) {
      self.airHandlingUnits.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    // Exhaust Fans dynamic actions
    addExhaustFan(
      quantity: number,
      location: string[],
    ) {
      const id = self.exhaustFans.addUnit(quantity, location)
      self.lastModified = new Date()
      return id
    },
    
    removeExhaustFan(id: string) {
      self.exhaustFans.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updateExhaustFan(id: string, data: {
      quantity?: number
      location?: string[]
    }) {
      self.exhaustFans.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

