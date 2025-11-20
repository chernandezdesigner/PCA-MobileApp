import { types } from "mobx-state-tree";
import { ConditionAssessment } from "../SharedModels";


export const SwimmingPoolAccordionModel = types.model("SwimmingPoolAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    constructionTypes: types.optional(types.array(types.string), []),
    heaterTypes: types.optional(types.array(types.string), []),
    location: types.optional(types.string, ""),
    virginiaGraemeBakerCompliance: types.optional(types.boolean, false),
    repairedreplaced: types.optional(types.boolean, false),
    repairedreplacedyear: types.optional(types.number, 0),
    assessment: types.optional(ConditionAssessment, {}),

    deckTypes: types.optional(types.array(types.string), []),
    deckAssessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; constructionTypes?: string[]; heaterTypes?: string[]; location?: string; virginiaGraemeBakerCompliance?: boolean; repairedreplaced?: boolean; repairedreplacedyear?: number; assessment?: Record<string, any>; deckTypes?: string[]; deckAssessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.constructionTypes !== undefined) self.constructionTypes.replace(data.constructionTypes)
        if (data.heaterTypes !== undefined) self.heaterTypes.replace(data.heaterTypes)
        if (data.location !== undefined) self.location = data.location
        if (data.virginiaGraemeBakerCompliance !== undefined) self.virginiaGraemeBakerCompliance = data.virginiaGraemeBakerCompliance
        if (data.repairedreplaced !== undefined) self.repairedreplaced = data.repairedreplaced
        if (data.repairedreplacedyear !== undefined) self.repairedreplacedyear = data.repairedreplacedyear
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.deckTypes !== undefined) self.deckTypes.replace(data.deckTypes)
        if (data.deckAssessment) Object.assign(self.deckAssessment as any, data.deckAssessment)
    },
}))

export const SpaAccordionModel = types.model("SpaAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    constructionTypes: types.optional(types.array(types.string), []),
    heaterTypes: types.optional(types.array(types.string), []),
    location: types.optional(types.string, ""),
    virginiaGraemeBakerCompliance: types.optional(types.boolean, false),
    repairedreplaced: types.optional(types.boolean, false),
    repairedreplacedyear: types.optional(types.number, 0),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; constructionTypes?: string[]; heaterTypes?: string[]; location?: string; virginiaGraemeBakerCompliance?: boolean; repairedreplaced?: boolean; repairedreplacedyear?: number; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.constructionTypes !== undefined) self.constructionTypes.replace(data.constructionTypes)
        if (data.heaterTypes !== undefined) self.heaterTypes.replace(data.heaterTypes)
        if (data.location !== undefined) self.location = data.location
        if (data.virginiaGraemeBakerCompliance !== undefined) self.virginiaGraemeBakerCompliance = data.virginiaGraemeBakerCompliance
        if (data.repairedreplaced !== undefined) self.repairedreplaced = data.repairedreplaced
        if (data.repairedreplacedyear !== undefined) self.repairedreplacedyear = data.repairedreplacedyear
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BuildingEnvelopeStep10 = types.model("BuildingEnvelopeStep10", {
    stepNotApplicable: types.optional(types.boolean, false),
    swimmingPool: types.optional(SwimmingPoolAccordionModel, {}),
    spa: types.optional(SpaAccordionModel, {}),
    residenceOrPublic: types.optional(types.string, ""),
    adaCompliantRestroom: types.optional(types.string, ""),
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
    updateSwimmingPool(data: Parameters<typeof self.swimmingPool.update>[0]) {
        self.swimmingPool.update(data)
        self.lastModified = new Date()
    },
    updateSpa(data: Parameters<typeof self.spa.update>[0]) {
        self.spa.update(data)
        self.lastModified = new Date()
    },
    updateResidenceOrPublic(value: string) {
        self.residenceOrPublic = value
        self.lastModified = new Date()
    },
    updateAdaCompliantRestroom(value: string) {
        self.adaCompliantRestroom = value
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))