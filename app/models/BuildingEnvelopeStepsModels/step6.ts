import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const StructureAccordionModel = types.model("StructureAccordionModel", {
    structureType: types.optional(types.string, ""),
    otherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { structureType?: string; otherType?: string; assessment?: Record<string, any> }) {
        if (data.structureType !== undefined) self.structureType = data.structureType
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const DeckingAccordionModel = types.model("DeckingAccordionModel", {
    deckingType: types.optional(types.string, ""),
    otherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { deckingType?: string; otherType?: string; assessment?: Record<string, any> }) {
        if (data.deckingType !== undefined) self.deckingType = data.deckingType
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ExpansionJointsMaterialsAccordionModel = types.model("ExpansionJointsMaterialsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    Rubber: types.optional(types.boolean, false),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; Rubber?: boolean; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.Rubber !== undefined) self.Rubber = data.Rubber
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const PerimeterWallAccordionModel = types.model("PerimeterWallAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    PerimeterWallType: types.optional(types.string, ""),
    OtherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; PerimeterWallType?: string; OtherType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.PerimeterWallType !== undefined) self.PerimeterWallType = data.PerimeterWallType
        if (data.OtherType !== undefined) self.OtherType = data.OtherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const TrafficCoatingAccordionModel = types.model("TrafficCoatingAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    TrafficCoatingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; TrafficCoatingType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.TrafficCoatingType !== undefined) self.TrafficCoatingType = data.TrafficCoatingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BuildingEnvelopeStep6 = types.model("BuildingEnvelopeStep6", {
    stepNotApplicable: types.optional(types.boolean, false),
    structure: types.optional(StructureAccordionModel, {}),
    decking: types.optional(DeckingAccordionModel, {}),
    expansionJointsMaterials: types.optional(ExpansionJointsMaterialsAccordionModel, {}),
    perimeterWall: types.optional(PerimeterWallAccordionModel, {}),
    trafficCoating: types.optional(TrafficCoatingAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateStepNotApplicable(value: boolean) {
        self.stepNotApplicable = value
        self.lastModified = new Date()
    },
    updateStructure(data: Parameters<typeof self.structure.update>[0]) {
        self.structure.update(data)
        self.lastModified = new Date()
    },
    updateDecking(data: Parameters<typeof self.decking.update>[0]) {
        self.decking.update(data)
        self.lastModified = new Date()
    },
    updateExpansionJointsMaterials(data: Parameters<typeof self.expansionJointsMaterials.update>[0]) {
        self.expansionJointsMaterials.update(data)
        self.lastModified = new Date()
    },
    updatePerimeterWall(data: Parameters<typeof self.perimeterWall.update>[0]) {
        self.perimeterWall.update(data)
        self.lastModified = new Date()
    },
    updateTrafficCoating(data: Parameters<typeof self.trafficCoating.update>[0]) {
        self.trafficCoating.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))
