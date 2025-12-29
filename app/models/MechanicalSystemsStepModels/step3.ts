import { types, destroy } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// CHILLERS & COOLING TOWERS - Step 3
// ============================================

// ============================================
// INDIVIDUAL UNIT MODELS
// Each unit has technical specs + assessment + observations/areas served PER UNIT
// NO shared fields at accordion level
// ============================================

/**
 * Chiller Model (Individual Unit)
 * Contains: All technical specs + assessment + observations/areas served per unit
 */
export const ChillerModel = types.model("Chiller", {
  id: types.identifier,
  quantity: types.optional(types.number, 0),
  capacityTons: types.optional(types.number, 0),
  yearInstall: types.optional(types.number, 0),
  yearRebuild: types.optional(types.number, 0),
  manufacturerIdLocation: types.optional(types.string, ""),
  chillerType: types.optional(types.array(types.string), []), // Reciprocating, Centrifugal, Scroll, Rotary
  coolingMethod: types.optional(types.array(types.string), []), // Single-effect, Double-effect, Air-cooled, Water-cooled
  chillerH2oPumps: types.optional(types.string, ""), // Pump details
  refrigerant: types.optional(types.array(types.string), []), // R-14, R-22, R-125, R-134A, etc.
  assessment: types.optional(ConditionAssessment, {}),
  
  // Per-unit fields (not shared at accordion level)
  observations: types.optional(types.string, ""),
  areasServed: types.optional(types.string, ""),
})
  .actions((self) => ({
    update(data: {
      quantity?: number
      capacityTons?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      chillerType?: string[]
      coolingMethod?: string[]
      chillerH2oPumps?: string
      refrigerant?: string[]
      assessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacityTons !== undefined) self.capacityTons = data.capacityTons
      if (data.yearInstall !== undefined) self.yearInstall = data.yearInstall
      if (data.yearRebuild !== undefined) self.yearRebuild = data.yearRebuild
      if (data.manufacturerIdLocation !== undefined) self.manufacturerIdLocation = data.manufacturerIdLocation
      if (data.chillerType !== undefined) self.chillerType.replace(data.chillerType)
      if (data.coolingMethod !== undefined) self.coolingMethod.replace(data.coolingMethod)
      if (data.chillerH2oPumps !== undefined) self.chillerH2oPumps = data.chillerH2oPumps
      if (data.refrigerant !== undefined) self.refrigerant.replace(data.refrigerant)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.areasServed !== undefined) self.areasServed = data.areasServed
    },
  }))

/**
 * Cooling Tower Model (Individual Unit)
 * Contains: All technical specs + assessment + observations/areas served per unit
 */
export const CoolingTowerModel = types.model("CoolingTower", {
  id: types.identifier,
  quantity: types.optional(types.number, 0),
  capacityTons: types.optional(types.number, 0),
  yearInstall: types.optional(types.number, 0),
  yearRebuild: types.optional(types.number, 0),
  manufacturerIdLocation: types.optional(types.string, ""),
  towerType: types.optional(types.array(types.string), []), // Open-loop (wet), Closed-loop (fluid coolers)
  condensedH2oPumps: types.optional(types.string, ""), // Pump details
  refrigerant: types.optional(types.array(types.string), []), // R-14, R-22, R-125, R-134A, etc.
  assessment: types.optional(ConditionAssessment, {}),
  
  // Per-unit fields (not shared at accordion level)
  observations: types.optional(types.string, ""),
  areasServed: types.optional(types.string, ""),
})
  .actions((self) => ({
    update(data: {
      quantity?: number
      capacityTons?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      towerType?: string[]
      condensedH2oPumps?: string
      refrigerant?: string[]
      assessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.capacityTons !== undefined) self.capacityTons = data.capacityTons
      if (data.yearInstall !== undefined) self.yearInstall = data.yearInstall
      if (data.yearRebuild !== undefined) self.yearRebuild = data.yearRebuild
      if (data.manufacturerIdLocation !== undefined) self.manufacturerIdLocation = data.manufacturerIdLocation
      if (data.towerType !== undefined) self.towerType.replace(data.towerType)
      if (data.condensedH2oPumps !== undefined) self.condensedH2oPumps = data.condensedH2oPumps
      if (data.refrigerant !== undefined) self.refrigerant.replace(data.refrigerant)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.observations !== undefined) self.observations = data.observations
      if (data.areasServed !== undefined) self.areasServed = data.areasServed
    },
  }))

// ============================================
// ACCORDION MODELS
// Each accordion contains:
// - NotApplicable flag
// - Dynamic array of units (max 3)
// - NO shared fields (observations/areas are per unit)
// ============================================

/**
 * Chillers Accordion
 * Contains up to 3 chillers (no shared fields)
 */
export const ChillersAccordionModel = types.model("ChillersAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(ChillerModel), []),
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
    },
    
    addUnit(
      quantity: number,
      capacityTons: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      chillerType: string[],
      coolingMethod: string[],
      chillerH2oPumps: string,
      refrigerant: string[],
    ) {
      if (self.units.length >= 3) {
        console.warn("Cannot add more than 3 Chillers")
        return null
      }
      
      const id = `chiller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        quantity,
        capacityTons,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        chillerType,
        coolingMethod,
        chillerH2oPumps,
        refrigerant,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      quantity?: number
      capacityTons?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      chillerType?: string[]
      coolingMethod?: string[]
      chillerH2oPumps?: string
      refrigerant?: string[]
      assessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) unit.update(data)
    },
  }))

/**
 * Cooling Towers Accordion
 * Contains up to 3 cooling towers (no shared fields)
 */
export const CoolingTowersAccordionModel = types.model("CoolingTowersAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  units: types.optional(types.array(CoolingTowerModel), []),
})
  .actions((self) => ({
    update(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
    },
    
    addUnit(
      quantity: number,
      capacityTons: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      towerType: string[],
      condensedH2oPumps: string,
      refrigerant: string[],
    ) {
      if (self.units.length >= 3) {
        console.warn("Cannot add more than 3 Cooling Towers")
        return null
      }
      
      const id = `coolingtower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.units.push({
        id,
        quantity,
        capacityTons,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        towerType,
        condensedH2oPumps,
        refrigerant,
      } as any)
      return id
    },
    
    removeUnit(id: string) {
      const unit = self.units.find((u) => (u as any).id === id)
      if (unit) destroy(unit)
    },
    
    updateUnit(id: string, data: {
      quantity?: number
      capacityTons?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      towerType?: string[]
      condensedH2oPumps?: string
      refrigerant?: string[]
      assessment?: Record<string, any>
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

export const MechanicalSystemsStep3 = types.model("MechanicalSystemsStep3", {
  chillers: types.optional(ChillersAccordionModel, {}),
  coolingTowers: types.optional(CoolingTowersAccordionModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateChillers(data: Parameters<typeof self.chillers.update>[0]) {
      self.chillers.update(data)
      self.lastModified = new Date()
    },
    
    updateCoolingTowers(data: Parameters<typeof self.coolingTowers.update>[0]) {
      self.coolingTowers.update(data)
      self.lastModified = new Date()
    },
    
    // Chillers dynamic actions
    addChiller(
      quantity: number,
      capacityTons: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      chillerType: string[],
      coolingMethod: string[],
      chillerH2oPumps: string,
      refrigerant: string[],
    ) {
      const id = self.chillers.addUnit(
        quantity,
        capacityTons,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        chillerType,
        coolingMethod,
        chillerH2oPumps,
        refrigerant,
      )
      self.lastModified = new Date()
      return id
    },
    
    removeChiller(id: string) {
      self.chillers.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updateChiller(id: string, data: {
      quantity?: number
      capacityTons?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      chillerType?: string[]
      coolingMethod?: string[]
      chillerH2oPumps?: string
      refrigerant?: string[]
      assessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      self.chillers.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    // Cooling Towers dynamic actions
    addCoolingTower(
      quantity: number,
      capacityTons: number,
      yearInstall: number,
      yearRebuild: number,
      manufacturerIdLocation: string,
      towerType: string[],
      condensedH2oPumps: string,
      refrigerant: string[],
    ) {
      const id = self.coolingTowers.addUnit(
        quantity,
        capacityTons,
        yearInstall,
        yearRebuild,
        manufacturerIdLocation,
        towerType,
        condensedH2oPumps,
        refrigerant,
      )
      self.lastModified = new Date()
      return id
    },
    
    removeCoolingTower(id: string) {
      self.coolingTowers.removeUnit(id)
      self.lastModified = new Date()
    },
    
    updateCoolingTower(id: string, data: {
      quantity?: number
      capacityTons?: number
      yearInstall?: number
      yearRebuild?: number
      manufacturerIdLocation?: string
      towerType?: string[]
      condensedH2oPumps?: string
      refrigerant?: string[]
      assessment?: Record<string, any>
      observations?: string
      areasServed?: string
    }) {
      self.coolingTowers.updateUnit(id, data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

