import { types, destroy } from "mobx-state-tree"
import { 
  HVACUnitBaseModel, 
  FurnaceBaseModel, 
  HVACUnitBaseModelWithoutRefrigerantAndOtherSpec,
  UnitManufacturerAndSpecificsModel,
} from "../SharedModels"

// ============================================
// HVAC Individual Units - Step 1
// Following BuildingEnvelopeStep3 pattern (Option 2: Factory with .named())
// ============================================

// ============================================
// INDIVIDUAL UNIT MODELS
// Extend base models with additional actions
// ============================================

/**
 * Standard HVAC Unit Model Factory
 * Used by: Packaged Units, Split Condenser, Split Heat Pump
 * Extends HVACUnitBaseModel (which already has assessment field & update actions)
 */
const createHVACUnitModel = (modelName: string) => 
  HVACUnitBaseModel.named(modelName)
    .actions((self) => ({
      // Extend the base update action with all other fields
      updateUnit(data: {
        quantity?: number
        capacityRangeTons?: string
        totalCapacityTons?: number
        age0to10Tons?: number
        age11to20Tons?: number
        age21PlusTons?: number
        refrigerantType?: string
        refrigerantOtherSpec?: string
        heatSource?: string
        maintenanceResponsibility?: string
        replacementResponsibility?: string
        assessment?: Record<string, any>
      }) {
        if (data.quantity !== undefined) self.quantity = data.quantity
        if (data.capacityRangeTons !== undefined) self.capacityRangeTons = data.capacityRangeTons
        if (data.totalCapacityTons !== undefined) self.totalCapacityTons = data.totalCapacityTons
        if (data.age0to10Tons !== undefined) self.age0to10Tons = data.age0to10Tons
        if (data.age11to20Tons !== undefined) self.age11to20Tons = data.age11to20Tons
        if (data.age21PlusTons !== undefined) self.age21PlusTons = data.age21PlusTons
        if (data.refrigerantType !== undefined) self.refrigerantType = data.refrigerantType
        if (data.refrigerantOtherSpec !== undefined) self.refrigerantOtherSpec = data.refrigerantOtherSpec
        if (data.heatSource !== undefined) self.heatSource = data.heatSource
        if (data.maintenanceResponsibility !== undefined) self.maintenanceResponsibility = data.maintenanceResponsibility
        if (data.replacementResponsibility !== undefined) self.replacementResponsibility = data.replacementResponsibility
        // Assessment uses inherited update() action from base model
        if (data.assessment) self.update({ assessment: data.assessment })
      },
    }))

/**
 * HVAC Unit Model Factory (Without Refrigerant)
 * Used by: Air Handler, PTACs, Window Units
 * Simpler - no refrigerant or heat source fields
 */
const createHVACUnitModelWithoutRefrigerant = (modelName: string) => 
  HVACUnitBaseModelWithoutRefrigerantAndOtherSpec.named(modelName)
    .actions((self) => ({
      updateUnit(data: {
        quantity?: number
        capacityRangeTons?: string
        totalCapacityTons?: number
        age0to10Tons?: number
        age11to20Tons?: number
        age21PlusTons?: number
        heatSource?: string
        assessment?: Record<string, any>
      }) {
        if (data.quantity !== undefined) self.quantity = data.quantity
        if (data.capacityRangeTons !== undefined) self.capacityRangeTons = data.capacityRangeTons
        if (data.totalCapacityTons !== undefined) self.totalCapacityTons = data.totalCapacityTons
        if (data.age0to10Tons !== undefined) self.age0to10Tons = data.age0to10Tons
        if (data.age11to20Tons !== undefined) self.age11to20Tons = data.age11to20Tons
        if (data.age21PlusTons !== undefined) self.age21PlusTons = data.age21PlusTons
        if (data.assessment) self.update({ assessment: data.assessment })
      },
    }))

/**
 * Furnace Unit Model
 * Different structure - has location instead of refrigerant
 */
const FurnaceUnitModel = FurnaceBaseModel.named("FurnaceUnit")
  .actions((self) => ({
    updateUnit(data: {
      quantity?: number
      location?: string
      heatSource?: string
      maintenanceResponsibility?: string
      replacementResponsibility?: string
    }) {
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.location !== undefined) self.location = data.location
      if (data.heatSource !== undefined) self.heatSource = data.heatSource
      if (data.maintenanceResponsibility !== undefined) self.maintenanceResponsibility = data.maintenanceResponsibility
      if (data.replacementResponsibility !== undefined) self.replacementResponsibility = data.replacementResponsibility
    },
  }))

// ============================================
// ACCORDION MODELS
// Each accordion groups related unit types
// ============================================

/**
 * Packaged Units Accordion
 * Contains: Grade-mounted Rooftop, Rooftop
 */
export const PackagedUnitsAccordionModel = types.model("PackagedUnitsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  gradeMountedRooftop: types.optional(createHVACUnitModel("PackagedGradeMounted"), {}),
  rooftop: types.optional(createHVACUnitModel("PackagedRooftop"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      gradeMountedRooftop?: Record<string, any>
      rooftop?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.gradeMountedRooftop) self.gradeMountedRooftop.updateUnit(data.gradeMountedRooftop)
      if (data.rooftop) self.rooftop.updateUnit(data.rooftop)
    },
  }))

/**
 * Split Systems - Condenser Cooling Accordion
 * Contains: Pad-mounted Rooftop, Rooftop
 */
export const SplitSystemCondenserAccordionModel = types.model("SplitSystemCondenserAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  padMountedRooftop: types.optional(createHVACUnitModel("CondenserPadMounted"), {}),
  rooftop: types.optional(createHVACUnitModel("CondenserRooftop"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      padMountedRooftop?: Record<string, any>
      rooftop?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.padMountedRooftop) self.padMountedRooftop.updateUnit(data.padMountedRooftop)
      if (data.rooftop) self.rooftop.updateUnit(data.rooftop)
    },
  }))

/**
 * Furnaces Accordion
 * Single furnace entry (different structure - has location not refrigerant)
 */
export const FurnaceAccordionModel = types.model("FurnaceAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  furnace: types.optional(FurnaceUnitModel, {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      furnace?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.furnace) self.furnace.updateUnit(data.furnace)
    },
  }))

/**
 * Split Systems - Heat Pump Accordion
 * Contains: Pad-mounted Rooftop, Rooftop
 */
export const SplitSystemHeatPumpAccordionModel = types.model("SplitSystemHeatPumpAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  padMountedRooftop: types.optional(createHVACUnitModel("HeatPumpPadMounted"), {}),
  rooftop: types.optional(createHVACUnitModel("HeatPumpRooftop"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      padMountedRooftop?: Record<string, any>
      rooftop?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.padMountedRooftop) self.padMountedRooftop.updateUnit(data.padMountedRooftop)
      if (data.rooftop) self.rooftop.updateUnit(data.rooftop)
    },
  }))

/**
 * Air Handler Accordion
 * Single entry - no refrigerant
 */
export const AirHandlerAccordionModel = types.model("AirHandlerAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  airHandler: types.optional(createHVACUnitModelWithoutRefrigerant("AirHandler"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      airHandler?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.airHandler) self.airHandler.updateUnit(data.airHandler)
    },
  }))

/**
 * Owner PTACs Accordion
 * Single entry - no refrigerant
 */
export const OwnerPTACsAccordionModel = types.model("OwnerPTACsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  ownerPTACs: types.optional(createHVACUnitModelWithoutRefrigerant("OwnerPTACs"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      ownerPTACs?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.ownerPTACs) self.ownerPTACs.updateUnit(data.ownerPTACs)
    },
  }))

/**
 * Tenant PTACs Accordion
 * Single entry - no refrigerant
 */
export const TenantPTACsAccordionModel = types.model("TenantPTACsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  tenantPTACs: types.optional(createHVACUnitModelWithoutRefrigerant("TenantPTACs"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      tenantPTACs?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.tenantPTACs) self.tenantPTACs.updateUnit(data.tenantPTACs)
    },
  }))

/**
 * Window Units (Owner) Accordion
 * Single entry - no refrigerant
 */
export const WindowUnitsOwnerAccordionModel = types.model("WindowUnitsOwnerAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  windowUnitsOwner: types.optional(createHVACUnitModelWithoutRefrigerant("WindowUnitsOwner"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      windowUnitsOwner?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.windowUnitsOwner) self.windowUnitsOwner.updateUnit(data.windowUnitsOwner)
    },
  }))

/**
 * Window Units (Tenant) Accordion
 * Single entry - no refrigerant
 */
export const WindowUnitsTenantAccordionModel = types.model("WindowUnitsTenantAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  windowUnitsTenant: types.optional(createHVACUnitModelWithoutRefrigerant("WindowUnitsTenant"), {}),
})
  .actions((self) => ({
    update(data: { 
      NotApplicable?: boolean
      windowUnitsTenant?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.windowUnitsTenant) self.windowUnitsTenant.updateUnit(data.windowUnitsTenant)
    },
  }))

// ============================================
// MAIN STEP MODEL
// Combines all accordion models
// ============================================

export const MechanicalSystemsStep1 = types.model("MechanicalSystemsStep1", {
  packagedUnits: types.optional(PackagedUnitsAccordionModel, {}),
  splitSystemCondenser: types.optional(SplitSystemCondenserAccordionModel, {}),
  furnace: types.optional(FurnaceAccordionModel, {}),
  splitSystemHeatPump: types.optional(SplitSystemHeatPumpAccordionModel, {}),
  airHandler: types.optional(AirHandlerAccordionModel, {}),
  ownerPTACs: types.optional(OwnerPTACsAccordionModel, {}),
  tenantPTACs: types.optional(TenantPTACsAccordionModel, {}),
  windowUnitsOwner: types.optional(WindowUnitsOwnerAccordionModel, {}),
  windowUnitsTenant: types.optional(WindowUnitsTenantAccordionModel, {}),
  
  // Dynamic list for Unit Manufacturer & Specifics (like Personnel Interviewed pattern)
  // Initialize with 1 empty entry by default
  unitManufacturerSpecifics: types.optional(types.array(UnitManufacturerAndSpecificsModel), () => [{
    id: `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    manufacturer: "",
    quantity: 0,
    tenantSpace: "",
    approxTonnage: 0,
    approxAge: 0,
    type: "",
  }]),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    updatePackagedUnits(data: Parameters<typeof self.packagedUnits.update>[0]) {
      self.packagedUnits.update(data)
      self.lastModified = new Date()
    },
    updateSplitSystemCondenser(data: Parameters<typeof self.splitSystemCondenser.update>[0]) {
      self.splitSystemCondenser.update(data)
      self.lastModified = new Date()
    },
    updateFurnace(data: Parameters<typeof self.furnace.update>[0]) {
      self.furnace.update(data)
      self.lastModified = new Date()
    },
    updateSplitSystemHeatPump(data: Parameters<typeof self.splitSystemHeatPump.update>[0]) {
      self.splitSystemHeatPump.update(data)
      self.lastModified = new Date()
    },
    updateAirHandler(data: Parameters<typeof self.airHandler.update>[0]) {
      self.airHandler.update(data)
      self.lastModified = new Date()
    },
    updateOwnerPTACs(data: Parameters<typeof self.ownerPTACs.update>[0]) {
      self.ownerPTACs.update(data)
      self.lastModified = new Date()
    },
    updateTenantPTACs(data: Parameters<typeof self.tenantPTACs.update>[0]) {
      self.tenantPTACs.update(data)
      self.lastModified = new Date()
    },
    updateWindowUnitsOwner(data: Parameters<typeof self.windowUnitsOwner.update>[0]) {
      self.windowUnitsOwner.update(data)
      self.lastModified = new Date()
    },
    updateWindowUnitsTenant(data: Parameters<typeof self.windowUnitsTenant.update>[0]) {
      self.windowUnitsTenant.update(data)
      self.lastModified = new Date()
    },
    
    // Dynamic Unit Manufacturer & Specifics actions (like Personnel Interviewed)
    addUnitManufacturerSpecific(
      manufacturer: string,
      quantity: number,
      tenantSpace: string,
      approxTonnage: number,
      approxAge: number,
      type: string,
    ) {
      // Max limit: 30 units
      if (self.unitManufacturerSpecifics.length >= 30) {
        console.warn("Cannot add more than 30 HVAC unit specifications")
        return null
      }
      
      const id = `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.unitManufacturerSpecifics.push({
        id,
        manufacturer,
        quantity,
        tenantSpace,
        approxTonnage,
        approxAge,
        type,
      } as any)
      self.lastModified = new Date()
      return id
    },
    removeUnitManufacturerSpecific(id: string) {
      const unit = self.unitManufacturerSpecifics.find((u) => (u as any).id === id)
      if (unit) {
        destroy(unit)
        self.lastModified = new Date()
      }
    },
    updateUnitManufacturerSpecific(
      id: string,
      data: Partial<{
        manufacturer: string
        quantity: number
        tenantSpace: string
        approxTonnage: number
        approxAge: number
        type: string
      }>,
    ) {
      const unit = self.unitManufacturerSpecifics.find((u) => (u as any).id === id)
      if (unit) {
        unit.update(data)
        self.lastModified = new Date()
      }
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))
