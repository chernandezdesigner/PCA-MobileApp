import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const FoundationSubstructureAccordionModel = types.model("FoundationSubstructureAccordionModel", {
    foundationType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { foundationType?: string; assessment?: Record<string, any> }) {
        if (data.foundationType !== undefined) self.foundationType = data.foundationType
        if (data.assessment !== undefined) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BasementAccordionModel = types.model("BasementAccordionModel", {
    basementType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { basementType?: string; assessment?: Record<string, any> }) {
        if (data.basementType !== undefined) self.basementType = data.basementType
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