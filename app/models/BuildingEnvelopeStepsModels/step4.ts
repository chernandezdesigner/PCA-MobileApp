import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const MaterialAccordionModel = types.model("MaterialAccordionModel", {
    materials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { materials?: string[]; assessment?: Record<string, any> }) {
        if (data.materials !== undefined) self.materials.replace(data.materials)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SidingAccordionModel = types.model("SidingAccordionModel", {
    siding: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { siding?: string[]; assessment?: Record<string, any> }) {
        if (data.siding !== undefined) self.siding.replace(data.siding)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SoffitAccordionModel = types.model("SoffitAccordionModel", {
    soffit: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { soffit?: string[]; assessment?: Record<string, any> }) {
        if (data.soffit !== undefined) self.soffit.replace(data.soffit)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SealantAccordionModel = types.model("SealantAccordionModel", {
    sealant: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { sealant?: string[]; assessment?: Record<string, any> }) {
        if (data.sealant !== undefined) self.sealant.replace(data.sealant)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const CurtainWallAccordionModel = types.model("CurtainWallAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    glazing: types.optional(types.array(types.string), []),
    spandrels: types.optional(types.array(types.string), []),
    mullions: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; glazing?: string[]; spandrels?: string[]; mullions?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.glazing !== undefined) self.glazing.replace(data.glazing)
        if (data.spandrels !== undefined) self.spandrels.replace(data.spandrels)
        if (data.mullions !== undefined) self.mullions.replace(data.mullions)
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