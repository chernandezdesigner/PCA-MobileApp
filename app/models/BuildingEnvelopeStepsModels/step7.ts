// Building Stairs, Balconies & Patios Models
// Dynamic material selection with nested railing assessments

import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// NESTED RAILING MODEL (Shared by all accordions)
// Follows same pattern as step2.ts railing models
// ============================================

export const RailingDetailsModel = types.model("RailingDetailsModel", {
    railingTypes: types.optional(types.array(types.string), []),
    balusterSpacing: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { 
        railingTypes?: string[]; 
        balusterSpacing?: string; 
        assessment?: Record<string, any> 
    }) {
        if (data.railingTypes !== undefined) self.railingTypes.replace(data.railingTypes)
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
    materials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    // Railing option
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render nested railing details
    railingDetails: types.maybe(types.late(() => RailingDetailsModel)),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; materials?: string[]; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.materials !== undefined) self.materials.replace(data.materials)
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
    materials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    railingDetails: types.maybe(types.late(() => RailingDetailsModel)),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; materials?: string[]; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.materials !== undefined) self.materials.replace(data.materials)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

// ============================================
// BALCONY BALUSTER SPACING ACCORDION
// For balcony-specific baluster spacing options
// ============================================

export const BalconyBalusterSpacingAccordionModel = types.model("BalconyBalusterSpacingAccordionModel", {
    balusterSpacing: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { balusterSpacing?: string[]; assessment?: Record<string, any> }) {
        if (data.balusterSpacing !== undefined) self.balusterSpacing.replace(data.balusterSpacing)
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
    // Balcony-specific baluster spacing with nested assessment
    balconyBalusterSpacing: types.optional(BalconyBalusterSpacingAccordionModel, {}),
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
    updateBalconyBalusterSpacing(data: Parameters<typeof self.balconyBalusterSpacing.update>[0]) {
        self.balconyBalusterSpacing.update(data)
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