import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const MaterialAccordionModel = types.model("MaterialAccordionModel", {
    materialType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { materialType?: string; assessment?: Record<string, any> }) {
        if (data.materialType !== undefined) self.materialType = data.materialType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SidingAccordionModel = types.model("SidingAccordionModel", {
    sidingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { sidingType?: string; assessment?: Record<string, any> }) {
        if (data.sidingType !== undefined) self.sidingType = data.sidingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SoffitAccordionModel = types.model("SoffitAccordionModel", {
    soffitType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { soffitType?: string; assessment?: Record<string, any> }) {
        if (data.soffitType !== undefined) self.soffitType = data.soffitType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SealantAccordionModel = types.model("SealantAccordionModel", {
    sealantType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { sealantType?: string; assessment?: Record<string, any> }) {
        if (data.sealantType !== undefined) self.sealantType = data.sealantType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const CurtainWallAccordionModel = types.model("CurtainWallAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GlazingType: types.optional(types.string, ""),
    SpandrelsType: types.optional(types.string, ""),
    MullionsType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; GlazingType?: string; SpandrelsType?: string; MullionsType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GlazingType !== undefined) self.GlazingType = data.GlazingType
        if (data.SpandrelsType !== undefined) self.SpandrelsType = data.SpandrelsType
        if (data.MullionsType !== undefined) self.MullionsType = data.MullionsType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const FacadeOrdinanceAccordionModel = types.model("FacadeOrdinanceAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    DateLastFacadeInspection: types.optional(types.Date, () => new Date()),
    OutstandingRepair: types.optional(types.boolean, false),
    FacadeInspectionReport: types.optional(types.string, ""),
    FrequencyOfInspection: types.optional(types.string, ""),
    DateOfNextInspection: types.optional(types.Date, () => new Date()),
    OrdinanceCodeNumber: types.optional(types.string, ""),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; DateLastFacadeInspection?: Date; OutstandingRepair?: boolean; FacadeInspectionReport?: string; FrequencyOfInspection?: string; DateOfNextInspection?: Date; OrdinanceCodeNumber?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.DateLastFacadeInspection !== undefined) self.DateLastFacadeInspection = data.DateLastFacadeInspection
        if (data.OutstandingRepair !== undefined) self.OutstandingRepair = data.OutstandingRepair
        if (data.FacadeInspectionReport !== undefined) self.FacadeInspectionReport = data.FacadeInspectionReport
        if (data.FrequencyOfInspection !== undefined) self.FrequencyOfInspection = data.FrequencyOfInspection
        if (data.DateOfNextInspection !== undefined) self.DateOfNextInspection = data.DateOfNextInspection
        if (data.OrdinanceCodeNumber !== undefined) self.OrdinanceCodeNumber = data.OrdinanceCodeNumber
    },
}))

export const BuildingEnvelopeStep4 = types.model("BuildingEnvelopeStep4", {
    lastTimePainted: types.optional(types.Date, () => new Date()),
    material: types.optional(MaterialAccordionModel, {}),
    siding: types.optional(SidingAccordionModel, {}),
    soffit: types.optional(SoffitAccordionModel, {}),
    sealant: types.optional(SealantAccordionModel, {}),
    curtainWall: types.optional(CurtainWallAccordionModel, {}),
    facadeOrdinance: types.optional(FacadeOrdinanceAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateLastTimePainted(data: Date) {
        self.lastTimePainted = data
        self.lastModified = new Date()
    },
    updateMaterial(data: Parameters<typeof self.material.update>[0]) {
        self.material.update(data)
        self.lastModified = new Date()
    },
    updateSiding(data: Parameters<typeof self.siding.update>[0]) {
        self.siding.update(data)
        self.lastModified = new Date()
    },
    updateSoffit(data: Parameters<typeof self.soffit.update>[0]) {
        self.soffit.update(data)
        self.lastModified = new Date()
    },
    updateSealant(data: Parameters<typeof self.sealant.update>[0]) {
        self.sealant.update(data)
        self.lastModified = new Date()
    },
    updateCurtainWall(data: Parameters<typeof self.curtainWall.update>[0]) {
        self.curtainWall.update(data)
        self.lastModified = new Date()
    },
    updateFacadeOrdinance(data: Parameters<typeof self.facadeOrdinance.update>[0]) {
        self.facadeOrdinance.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))