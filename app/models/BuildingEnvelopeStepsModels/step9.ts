//doors models incomplete will circle back to this after questions.

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

export const BuildingEnvelopeStep9 = types.model("BuildingEnvelopeStep9", {
    doors: types.optional(DoorsAccordionModel, {}),
    serviceDoors: types.optional(ServiceDoorsAccordionModel, {}),
    hardwareType: types.optional(HardWareTypeAccordionModel, {}),
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
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))
