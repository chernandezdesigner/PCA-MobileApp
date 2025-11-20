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

