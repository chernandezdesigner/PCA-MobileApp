import { types, destroy } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// ELEVATORS AND CONVEYING SYSTEMS - Step 8
// ============================================

// ============================================
// ELEVATOR MODEL (Reusable for Passenger & Service)
// ============================================

export const ElevatorModel = types.model("Elevator", {
  id: types.identifier,
  type: types.optional(types.array(types.string), []), // Hydraulic, Traction
  quantity: types.optional(types.number, 0),
  manufacturer: types.optional(types.string, ""),
  machineryLocation: types.optional(types.array(types.string), []), // Penthouse, Base
  speed: types.optional(types.number, 0),
  capacity: types.optional(types.number, 0),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    update(data: {
      type?: string[]
      quantity?: number
      manufacturer?: string
      machineryLocation?: string[]
      speed?: number
      capacity?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.type !== undefined) self.type.replace(data.type)
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.manufacturer !== undefined) self.manufacturer = data.manufacturer
      if (data.machineryLocation !== undefined) self.machineryLocation.replace(data.machineryLocation)
      if (data.speed !== undefined) self.speed = data.speed
      if (data.capacity !== undefined) self.capacity = data.capacity
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// PASSENGER ELEVATORS ACCORDION
// ============================================

export const PassengerElevatorsAccordionModel = types.model("PassengerElevatorsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  elevators: types.optional(types.array(ElevatorModel), []),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
    },
    
    addElevator(
      type: string[],
      quantity: number,
      manufacturer: string,
      machineryLocation: string[],
      speed: number,
      capacity: number,
    ) {
      if (self.elevators.length >= 5) {
        console.warn("Cannot add more than 5 Passenger Elevators")
        return null
      }
      
      const id = `passenger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.elevators.push({
        id,
        type,
        quantity,
        manufacturer,
        machineryLocation,
        speed,
        capacity,
      } as any)
      return id
    },
    
    removeElevator(id: string) {
      const elevator = self.elevators.find((e) => (e as any).id === id)
      if (elevator) destroy(elevator)
    },
    
    updateElevator(id: string, data: {
      type?: string[]
      quantity?: number
      manufacturer?: string
      machineryLocation?: string[]
      speed?: number
      capacity?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      const elevator = self.elevators.find((e) => (e as any).id === id)
      if (elevator) elevator.update(data)
    },
  }))

// ============================================
// SERVICE ELEVATORS ACCORDION
// ============================================

export const ServiceElevatorsAccordionModel = types.model("ServiceElevatorsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  elevators: types.optional(types.array(ElevatorModel), []),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
    },
    
    addElevator(
      type: string[],
      quantity: number,
      manufacturer: string,
      machineryLocation: string[],
      speed: number,
      capacity: number,
    ) {
      if (self.elevators.length >= 5) {
        console.warn("Cannot add more than 5 Service Elevators")
        return null
      }
      
      const id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      self.elevators.push({
        id,
        type,
        quantity,
        manufacturer,
        machineryLocation,
        speed,
        capacity,
      } as any)
      return id
    },
    
    removeElevator(id: string) {
      const elevator = self.elevators.find((e) => (e as any).id === id)
      if (elevator) destroy(elevator)
    },
    
    updateElevator(id: string, data: {
      type?: string[]
      quantity?: number
      manufacturer?: string
      machineryLocation?: string[]
      speed?: number
      capacity?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      const elevator = self.elevators.find((e) => (e as any).id === id)
      if (elevator) elevator.update(data)
    },
  }))

// ============================================
// ESCALATORS ACCORDION
// ============================================

export const EscalatorsAccordionModel = types.model("EscalatorsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  quantity: types.optional(types.number, 0),
  manufacturer: types.optional(types.string, ""),
  elevatorControlsCompliant: types.optional(types.boolean, false), // No/Yes
  telephoneForEmergency: types.optional(types.boolean, false), // No/Yes
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      quantity?: number
      manufacturer?: string
      elevatorControlsCompliant?: boolean
      telephoneForEmergency?: boolean
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.manufacturer !== undefined) self.manufacturer = data.manufacturer
      if (data.elevatorControlsCompliant !== undefined) self.elevatorControlsCompliant = data.elevatorControlsCompliant
      if (data.telephoneForEmergency !== undefined) self.telephoneForEmergency = data.telephoneForEmergency
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// CAB FINISHES ACCORDION
// ============================================

export const CabFinishesAccordionModel = types.model("CabFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  lights: types.optional(types.array(types.string), []), // Surface, Recessed
  floor: types.optional(types.array(types.string), []), // Carpet, VCT, CT, Other
  floorOtherSpecification: types.optional(types.string, ""), // For "Other" floor type
  safetyStops: types.optional(types.array(types.string), []), // Infrared, Mechanical
  wall: types.optional(types.array(types.string), []), // P-Lam, SS Metal, Wood Lam
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      lights?: string[]
      floor?: string[]
      floorOtherSpecification?: string
      safetyStops?: string[]
      wall?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.lights !== undefined) self.lights.replace(data.lights)
      if (data.floor !== undefined) self.floor.replace(data.floor)
      if (data.floorOtherSpecification !== undefined) self.floorOtherSpecification = data.floorOtherSpecification
      if (data.safetyStops !== undefined) self.safetyStops.replace(data.safetyStops)
      if (data.wall !== undefined) self.wall.replace(data.wall)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// MAIN STEP MODEL
// ============================================

export const MechanicalSystemsStep8 = types.model("MechanicalSystemsStep8", {
  // Top-level fields
  lastInspection: types.optional(types.string, ""),
  inspectionCertificates: types.optional(types.array(types.string), []), // cab, office
  
  // Accordions
  passengerElevators: types.optional(PassengerElevatorsAccordionModel, {}),
  serviceElevators: types.optional(ServiceElevatorsAccordionModel, {}),
  escalators: types.optional(EscalatorsAccordionModel, {}),
  cabFinishes: types.optional(CabFinishesAccordionModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateTopLevel(data: {
      lastInspection?: string
      inspectionCertificates?: string[]
    }) {
      if (data.lastInspection !== undefined) self.lastInspection = data.lastInspection
      if (data.inspectionCertificates !== undefined) self.inspectionCertificates.replace(data.inspectionCertificates)
      self.lastModified = new Date()
    },
    
    // ============================================
    // PASSENGER ELEVATORS ACCORDION - Actions
    // ============================================
    
    updatePassengerElevatorsAccordion(data: {
      NotApplicable?: boolean
    }) {
      self.passengerElevators.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    addPassengerElevator(
      type: string[],
      quantity: number,
      manufacturer: string,
      machineryLocation: string[],
      speed: number,
      capacity: number,
    ) {
      const id = self.passengerElevators.addElevator(
        type,
        quantity,
        manufacturer,
        machineryLocation,
        speed,
        capacity,
      )
      self.lastModified = new Date()
      return id
    },
    
    removePassengerElevator(id: string) {
      self.passengerElevators.removeElevator(id)
      self.lastModified = new Date()
    },
    
    updatePassengerElevator(id: string, data: {
      type?: string[]
      quantity?: number
      manufacturer?: string
      machineryLocation?: string[]
      speed?: number
      capacity?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.passengerElevators.updateElevator(id, data)
      self.lastModified = new Date()
    },
    
    // ============================================
    // SERVICE ELEVATORS ACCORDION - Actions
    // ============================================
    
    updateServiceElevatorsAccordion(data: {
      NotApplicable?: boolean
    }) {
      self.serviceElevators.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    addServiceElevator(
      type: string[],
      quantity: number,
      manufacturer: string,
      machineryLocation: string[],
      speed: number,
      capacity: number,
    ) {
      const id = self.serviceElevators.addElevator(
        type,
        quantity,
        manufacturer,
        machineryLocation,
        speed,
        capacity,
      )
      self.lastModified = new Date()
      return id
    },
    
    removeServiceElevator(id: string) {
      self.serviceElevators.removeElevator(id)
      self.lastModified = new Date()
    },
    
    updateServiceElevator(id: string, data: {
      type?: string[]
      quantity?: number
      manufacturer?: string
      machineryLocation?: string[]
      speed?: number
      capacity?: number
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.serviceElevators.updateElevator(id, data)
      self.lastModified = new Date()
    },
    
    // ============================================
    // ESCALATORS ACCORDION - Actions
    // ============================================
    
    updateEscalatorsAccordion(data: {
      NotApplicable?: boolean
      quantity?: number
      manufacturer?: string
      elevatorControlsCompliant?: boolean
      telephoneForEmergency?: boolean
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.escalators.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    // ============================================
    // CAB FINISHES ACCORDION - Actions
    // ============================================
    
    updateCabFinishesAccordion(data: {
      NotApplicable?: boolean
      lights?: string[]
      floor?: string[]
      floorOtherSpecification?: string
      safetyStops?: string[]
      wall?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.cabFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

