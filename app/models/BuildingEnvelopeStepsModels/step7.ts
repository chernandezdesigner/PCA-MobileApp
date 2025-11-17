// Building Stairs, Balconies & Patios Models
// Dynamic material selection with nested railing assessments

import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// NESTED RAILING MODEL (Shared by all accordions)
// Follows same pattern as step2.ts railing models
// ============================================

export const RailingDetailsModel = types.model("RailingDetailsModel", {
    railingType: types.optional(types.string, ""),
    balusterSpacing: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { 
        railingType?: string; 
        balusterSpacing?: string; 
        assessment?: Record<string, any> 
    }) {
        if (data.railingType !== undefined) self.railingType = data.railingType
        if (data.balusterSpacing !== undefined) self.balusterSpacing = data.balusterSpacing
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ============================================
// STAIRS EXTERIOR ACCORDION
// Simple static accordion with nested railing
// ============================================

export const StairsExteriorAccordionModel = types.model("StairsExteriorAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materialType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    // Railing option
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render nested railing details
    railingDetails: types.maybe(types.late(() => RailingDetailsModel)),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; materialType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.materialType !== undefined) self.materialType = data.materialType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

// ============================================
// STAIRS INTERIOR ACCORDION
// Simple static accordion with nested railing
// ============================================

export const StairsInteriorAccordionModel = types.model("StairsInteriorAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materialType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    railingDetails: types.maybe(types.late(() => RailingDetailsModel)),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; materialType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.materialType !== undefined) self.materialType = data.materialType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

// ============================================
// OPTIONAL ASSESSMENT ITEMS FOR BALCONIES
// Cantilever, Integral, Ext, Coating each have their own assessment
// ============================================

export const OptionalAssessmentItemModel = types.model("OptionalAssessmentItemModel", {
    applicable: types.optional(types.boolean, false),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { applicable?: boolean; assessment?: Record<string, any> }) {
        if (data.applicable !== undefined) self.applicable = data.applicable
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ============================================
// BALCONIES ACCORDION
// Dynamic material selection with nested railing
// Additional optional assessment items
// ============================================

export const BalconiesAccordionModel = types.model("BalconiesAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materials: types.map(ConditionAssessment),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    railingDetails: types.maybe(types.late(() => RailingDetailsModel)),
    // Additional assessment items
    cantilever: types.optional(OptionalAssessmentItemModel, {}),
    integral: types.optional(OptionalAssessmentItemModel, {}),
    ext: types.optional(OptionalAssessmentItemModel, {}),
    coating: types.optional(OptionalAssessmentItemModel, {}),
})
.actions((self) => ({
    updateNotApplicable(value: boolean) {
        self.NotApplicable = value
        if (value) {
            self.materials.clear()
        }
    },
    updateMaterial(materialType: string, assessment: any) {
        const existing = self.materials.get(materialType)
        if (existing) {
            Object.assign(existing, assessment)
        } else {
            self.materials.set(materialType, assessment)
        }
    },
    removeMaterial(materialType: string) {
        self.materials.delete(materialType)
    },
    clearMaterials() {
        self.materials.clear()
    },
    updateRailing(value: "yes" | "no") {
        self.railing = value
    },
    updateRailingDetails(data: any) {
        if (self.railingDetails) {
            self.railingDetails.update(data)
        }
    },
    updateCantilever(data: Parameters<typeof self.cantilever.update>[0]) {
        self.cantilever.update(data)
    },
    updateIntegral(data: Parameters<typeof self.integral.update>[0]) {
        self.integral.update(data)
    },
    updateExt(data: Parameters<typeof self.ext.update>[0]) {
        self.ext.update(data)
    },
    updateCoating(data: Parameters<typeof self.coating.update>[0]) {
        self.coating.update(data)
    },
}))

// ============================================
// PATIOS/PLAZA ACCORDION
// Dynamic material selection with nested railing
// ============================================

export const PatiosPlazaAccordionModel = types.model("PatiosPlazaAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materials: types.map(ConditionAssessment),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    railingDetails: types.maybe(types.late(() => RailingDetailsModel)),
})
.actions((self) => ({
    updateNotApplicable(value: boolean) {
        self.NotApplicable = value
        if (value) {
            self.materials.clear()
        }
    },
    updateMaterial(materialType: string, assessment: any) {
        const existing = self.materials.get(materialType)
        if (existing) {
            Object.assign(existing, assessment)
        } else {
            self.materials.set(materialType, assessment)
        }
    },
    removeMaterial(materialType: string) {
        self.materials.delete(materialType)
    },
    clearMaterials() {
        self.materials.clear()
    },
    updateRailing(value: "yes" | "no") {
        self.railing = value
    },
    updateRailingDetails(data: any) {
        if (self.railingDetails) {
            self.railingDetails.update(data)
        }
    },
}))

// ============================================
// MAIN STEP MODEL
// ============================================

export const BuildingEnvelopeStep7 = types.model("BuildingEnvelopeStep7", {
    stairsExterior: types.optional(StairsExteriorAccordionModel, {}),
    stairsInterior: types.optional(StairsInteriorAccordionModel, {}),
    balconies: types.optional(BalconiesAccordionModel, {}),
    patiosPlaza: types.optional(PatiosPlazaAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateStairsExterior(data: Parameters<typeof self.stairsExterior.update>[0]) {
        self.stairsExterior.update(data)
        self.lastModified = new Date()
    },
    updateStairsInterior(data: Parameters<typeof self.stairsInterior.update>[0]) {
        self.stairsInterior.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))