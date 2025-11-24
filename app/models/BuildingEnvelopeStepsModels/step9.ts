import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const DoorsAccordionModel = types.model("DoorsAccordionModel", {
    doorTypes: types.optional(types.array(types.string), []),
    handleTypes: types.optional(types.array(types.string), []),
    operationTypes: types.optional(types.array(types.string), []),
    frameTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { doorTypes?: string[]; handleTypes?: string[]; operationTypes?: string[]; frameTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.doorTypes !== undefined) self.doorTypes.replace(data.doorTypes)
        if (data.handleTypes !== undefined) self.handleTypes.replace(data.handleTypes)
        if (data.operationTypes !== undefined) self.operationTypes.replace(data.operationTypes)
        if (data.frameTypes !== undefined) self.frameTypes.replace(data.frameTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ServiceDoorsAccordionModel = types.model("ServiceDoorsAccordionModel", {
    doorTypes: types.optional(types.array(types.string), []),
    handleTypes: types.optional(types.array(types.string), []),
    operationTypes: types.optional(types.array(types.string), []),
    frameTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { doorTypes?: string[]; handleTypes?: string[]; operationTypes?: string[]; frameTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.doorTypes !== undefined) self.doorTypes.replace(data.doorTypes)
        if (data.handleTypes !== undefined) self.handleTypes.replace(data.handleTypes)
        if (data.operationTypes !== undefined) self.operationTypes.replace(data.operationTypes)
        if (data.frameTypes !== undefined) self.frameTypes.replace(data.frameTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const HardWareTypeAccordionModel = types.model("HardWareTypeAccordionModel", {
    hardwareTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { hardwareTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.hardwareTypes !== undefined) self.hardwareTypes.replace(data.hardwareTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BalconyPatioDoorAccordionModel = types.model("BalconyPatioDoorAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    doorTypes: types.optional(types.array(types.string), []),
    glazing: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; doorTypes?: string[]; glazing?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.doorTypes !== undefined) self.doorTypes.replace(data.doorTypes)
        if (data.glazing !== undefined) self.glazing.replace(data.glazing)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const OverheadDoorAccordionModel = types.model("OverheadDoorAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    material: types.optional(types.array(types.string), []),
    style: types.optional(types.array(types.string), []),
    operation: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; material?: string[]; style?: string[]; operation?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.material !== undefined) self.material.replace(data.material)
        if (data.style !== undefined) self.style.replace(data.style)
        if (data.operation !== undefined) self.operation.replace(data.operation)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const DockEquipmentAccordionModel = types.model("DockEquipmentAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    equipment: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; equipment?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.equipment !== undefined) self.equipment.replace(data.equipment)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BuildingEnvelopeStep9 = types.model("BuildingEnvelopeStep9", {
    doors: types.optional(DoorsAccordionModel, {}),
    serviceDoors: types.optional(ServiceDoorsAccordionModel, {}),
    hardwareType: types.optional(HardWareTypeAccordionModel, {}),
    balconyPatioDoor: types.optional(BalconyPatioDoorAccordionModel, {}),
    overheadDoor: types.optional(OverheadDoorAccordionModel, {}),
    dockEquipment: types.optional(DockEquipmentAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateDoors(data: Parameters<typeof self.doors.update>[0]) {
        self.doors.update(data)
        self.lastModified = new Date()
    },
    updateServiceDoors(data: Parameters<typeof self.serviceDoors.update>[0]) {
        self.serviceDoors.update(data)
        self.lastModified = new Date()
    },
    updateHardwareType(data: Parameters<typeof self.hardwareType.update>[0]) {
        self.hardwareType.update(data)
        self.lastModified = new Date()
    },
    updateBalconyPatioDoor(data: Parameters<typeof self.balconyPatioDoor.update>[0]) {
        self.balconyPatioDoor.update(data)
        self.lastModified = new Date()
    },
    updateOverheadDoor(data: Parameters<typeof self.overheadDoor.update>[0]) {
        self.overheadDoor.update(data)
        self.lastModified = new Date()
    },
    updateDockEquipment(data: Parameters<typeof self.dockEquipment.update>[0]) {
        self.dockEquipment.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))
