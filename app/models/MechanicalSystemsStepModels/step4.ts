import { types, destroy } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// BOILERS - Step 4
// ============================================

// ============================================
// INDIVIDUAL UNIT MODELS
// Each boiler has technical specs + assessment + water pumps (with separate manufacturer & assessment)
// Observations/Areas Served are PER UNIT
// ============================================

/**
 * Boiler Model (Used for both Heat Boilers and Plumbing Water Boilers)
 * Contains: All technical specs + assessment + water pumps details + observations/areas served per unit
 */
export const BoilerModel = types.model("Boiler", {
  id: types.identifier,
  quantity: types.optional(types.number, 0),
  capacityBTU: types.optional(types.number, 0),
  yearInstall: types.optional(types.number, 0),
  yearRebuild: types.optional(types.number, 0),
  
  // Boiler-specific fields
  manufacturerIdLocation: types.optional(types.string, ""),
  boilerType: types.optional(types.array(types.string), []), // Steam, Water
  fuelType: types.optional(types.array(types.string), []), // N/A, Natural Gas, Electric, Heating Oil
  assessment: types.optional(ConditionAssessment, {}),
  
  // Water Pumps (separate component with own manufacturer & assessment)
  waterPumpsManufacturerIdLocation: types.optional(types.string, ""),
  waterPumpsAssessment: types.optional(ConditionAssessment, {}),
  
  // Per-unit fields (not shared at accordion level)
  observations: types.optional(types.string, ""),
  areasServed: types.optional(types.string, ""),
})
  .actions((self) => ({
    update(data: {
      quantity?: number
      capacityBTU?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      boilerType?: string[]
      fuelType?: string[]
      assessment?: Record<string, any>
      waterPumpsManufacturerIdLocation?: string
      waterPumpsAssessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacityBTU !== undefined) self.capacityBTU = data.capacityBTU
      if (data.yearInstall !== undefined) self.yearInstall = data.yearInstall
      if (data.yearRebuild !== undefined) self.yearRebuild = data.yearRebuild
      if (data.manufacturerIdLocation !== undefined) self.manufacturerIdLocation = data.manufacturerIdLocation
      if (data.boilerType !== undefined) self.boilerType.replace(data.boilerType)
      if (data.fuelType !== undefined) self.fuelType.replace(data.fuelType)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.waterPumpsManufacturerIdLocation !== undefined) self.waterPumpsManufacturerIdLocation = data.waterPumpsManufacturerIdLocation
      if (data.waterPumpsAssessment) Object.assign(self.waterPumpsAssessment as any, data.waterPumpsAssessment)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.areasServed !== undefined) self.areasServed = data.areasServed
    },
  }))

// ============================================
// ACCORDION MODELS
// Each accordion contains:
// - NotApplicable flag
// - Dynamic array of boilers (max 2)
// - NO shared fields (observations/areas are per unit)
// ============================================

/**
 * Heat Boilers Accordion
 * Contains up to 2 heat boilers (no shared fields)
 */
export const HeatBoilersAccordionModel = types.model("HeatBoilersAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(BoilerModel), () => [
    BoilerModel.create({
      id: `heatboiler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quantity: 0,
      capacityBTU: 0,
      yearInstall: 0,
      yearRebuild: 0,
      manufacturerIdLocation: "",
      boilerType: [],
      fuelType: [],
      waterPumpsManufacturerIdLocation: "",
      observations: "",
      areasServed: "",
    }),
  ]),
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
    },
    
    addUnit(
      quantity: number,
      capacityBTU: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      boilerType: string[],
      fuelType: string[],
      waterPumpsManufacturerIdLocation: string,
    ) {
      if (self.units.length >= 2) {
        console.warn("Cannot add more than 2 Heat Boilers")
        return null
      }
      
      const id = `heatboiler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        quantity,
        capacityBTU,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        boilerType,
        fuelType,
        waterPumpsManufacturerIdLocation,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      quantity?: number
      capacityBTU?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      boilerType?: string[]
      fuelType?: string[]
      assessment?: Record<string, any>
      waterPumpsManufacturerIdLocation?: string
      waterPumpsAssessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) unit.update(data)
    },
  }))

/**
 * Plumbing Water Boilers Accordion
 * Contains up to 2 plumbing water boilers (no shared fields)
 */
export const PlumbingWaterBoilersAccordionModel = types.model("PlumbingWaterBoilersAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(BoilerModel), () => [
    BoilerModel.create({
      id: `plumbingboiler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quantity: 0,
      capacityBTU: 0,
      yearInstall: 0,
      yearRebuild: 0,
      manufacturerIdLocation: "",
      boilerType: [],
      fuelType: [],
      waterPumpsManufacturerIdLocation: "",
      observations: "",
      areasServed: "",
    }),
  ]),
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
    },
    
    addUnit(
      quantity: number,
      capacityBTU: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      boilerType: string[],
      fuelType: string[],
      waterPumpsManufacturerIdLocation: string,
    ) {
      if (self.units.length >= 2) {
        console.warn("Cannot add more than 2 Plumbing Water Boilers")
        return null
      }
      
      const id = `plumbingboiler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        quantity,
        capacityBTU,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        boilerType,
        fuelType,
        waterPumpsManufacturerIdLocation,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      quantity?: number
      capacityBTU?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      boilerType?: string[]
      fuelType?: string[]
      assessment?: Record<string, any>
      waterPumpsManufacturerIdLocation?: string
      waterPumpsAssessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) unit.update(data)
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines all accordion models
// ============================================

export const MechanicalSystemsStep4 = types.model("MechanicalSystemsStep4", {
  heatBoilers: types.optional(HeatBoilersAccordionModel, {}),
  plumbingWaterBoilers: types.optional(PlumbingWaterBoilersAccordionModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateHeatBoilers(data: Parameters<typeof self.heatBoilers.update>[0]) {
      self.heatBoilers.update(data)
      self.lastModified = new Date()
    },
    
    updatePlumbingWaterBoilers(data: Parameters<typeof self.plumbingWaterBoilers.update>[0]) {
      self.plumbingWaterBoilers.update(data)
      self.lastModified = new Date()
    },
    
    // Heat Boilers dynamic actions
    addHeatBoiler(
      quantity: number,
      capacityBTU: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      boilerType: string[],
      fuelType: string[],
      waterPumpsManufacturerIdLocation: string,
    ) {
      const id = self.heatBoilers.addUnit(
        quantity,
        capacityBTU,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        boilerType,
        fuelType,
        waterPumpsManufacturerIdLocation,
      )
      self.lastModified = new Date()
      return id
    },
    
    removeHeatBoiler(id: string) {
      self.heatBoilers.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updateHeatBoiler(id: string, data: {
      quantity?: number
      capacityBTU?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      boilerType?: string[]
      fuelType?: string[]
      assessment?: Record<string, any>
      waterPumpsManufacturerIdLocation?: string
      waterPumpsAssessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      self.heatBoilers.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    // Plumbing Water Boilers dynamic actions
    addPlumbingWaterBoiler(
      quantity: number,
      capacityBTU: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      boilerType: string[],
      fuelType: string[],
      waterPumpsManufacturerIdLocation: string,
    ) {
      const id = self.plumbingWaterBoilers.addUnit(
        quantity,
        capacityBTU,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        boilerType,
        fuelType,
        waterPumpsManufacturerIdLocation,
      )
      self.lastModified = new Date()
      return id
    },
    
    removePlumbingWaterBoiler(id: string) {
      self.plumbingWaterBoilers.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updatePlumbingWaterBoiler(id: string, data: {
      quantity?: number
      capacityBTU?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      boilerType?: string[]
      fuelType?: string[]
      assessment?: Record<string, any>
      waterPumpsManufacturerIdLocation?: string
      waterPumpsAssessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      self.plumbingWaterBoilers.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

