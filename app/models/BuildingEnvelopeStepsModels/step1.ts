import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const FoundationSubstructureAccordionModel = types.model("FoundationSubstructureAccordionModel", {
    foundationTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { foundationTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.foundationTypes !== undefined) self.foundationTypes.replace(data.foundationTypes)
        if (data.assessment !== undefined) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BasementAccordionModel = types.model("BasementAccordionModel", {
    basementTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { basementTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.basementTypes !== undefined) self.basementTypes.replace(data.basementTypes)
        if (data.assessment !== undefined) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BuildingEnvelopeStep1 = types.model("BuildingEnvelopeStep1", {
    foundationSubstructure: types.optional(FoundationSubstructureAccordionModel, {}),
    basement: types.optional(BasementAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateFoundationSubstructure(data: Parameters<typeof self.foundationSubstructure.update>[0]) {
        self.foundationSubstructure.update(data)
        self.lastModified = new Date()
    },
    updateBasement(data: Parameters<typeof self.basement.update>[0]) {
        self.basement.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))