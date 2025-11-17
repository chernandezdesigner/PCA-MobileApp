// Building Envelope Step 3 & Step 3B: Primary and Secondary Roofing
// Both steps share the same accordion models and structure
// Step 3B includes a NotApplicable flag at the step level

import { types } from "mobx-state-tree"
import { ConditionAssessment, RepairAssessment } from "../SharedModels"

// ============================================
// SHARED ACCORDION MODELS (Used by both roofs)
// ============================================

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

export const ShinglesAccordionModel = types.model("ShinglesAccordionModel", {
    shinglesType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { shinglesType?: string; assessment?: Record<string, any> }) {
        if (data.shinglesType !== undefined) self.shinglesType = data.shinglesType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SecondaryRoofAccordionModel = types.model("SecondaryRoofAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    secondaryRoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; secondaryRoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.secondaryRoofType !== undefined) self.secondaryRoofType = data.secondaryRoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ParapetsAccordionModel = types.model("ParapetsAccordionModel", {
    parapetsType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { parapetsType?: string; assessment?: Record<string, any> }) {
        if (data.parapetsType !== undefined) self.parapetsType = data.parapetsType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RoofLeaksAccordionModel = types.model("RoofLeaksAccordionModel", {
    where: types.optional(types.string, ""),
    assessment: types.optional(RepairAssessment, {}),
})
.actions((self) => ({
    update(data: { where?: string; assessment?: Record<string, any> }) {
        if (data.where !== undefined) self.where = data.where
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const FlashingAccordionModel = types.model("FlashingAccordionModel", {
    flashingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { flashingType?: string; assessment?: Record<string, any> }) {
        if (data.flashingType !== undefined) self.flashingType = data.flashingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const CurbMountedAccordionModel = types.model("CurbMountedAccordionModel", {
    curbMountedType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { curbMountedType?: string; assessment?: Record<string, any> }) {
        if (data.curbMountedType !== undefined) self.curbMountedType = data.curbMountedType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RoofStructuresAccordionModel = types.model("RoofStructuresAccordionModel", {
    roofStructuresType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { roofStructuresType?: string; assessment?: Record<string, any> }) {
        if (data.roofStructuresType !== undefined) self.roofStructuresType = data.roofStructuresType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

//todo: add models for attics



export const MechScreenAccordionModel = types.model("MechScreenAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const DrainageAccordionModel = types.model("DrainageAccordionModel", {
    drainageType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { drainageType?: string; assessment?: Record<string, any> }) {
        if (data.drainageType !== undefined) self.drainageType = data.drainageType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const InsulationAccordionModel = types.model("InsulationAccordionModel", {
    insulationType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { insulationType?: string; assessment?: Record<string, any> }) {
        if (data.insulationType !== undefined) self.insulationType = data.insulationType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ============================================
// SHARED PROPERTIES OBJECT
// Common fields used by both Primary and Secondary Roof steps
// ============================================

const RoofingSharedProperties = {
    warranty: types.optional(types.boolean, false),
    materialLabor: types.optional(types.boolean, false),
    remainingYears: types.optional(types.number, 0),
    roofType: types.optional(types.string, ""),
    otherType: types.optional(types.string, ""),
    
    material: types.optional(MaterialAccordionModel, {}),
    shingles: types.optional(ShinglesAccordionModel, {}),
    secondaryRoof: types.optional(SecondaryRoofAccordionModel, {}),
    parapets: types.optional(ParapetsAccordionModel, {}),
    roofLeaks: types.optional(RoofLeaksAccordionModel, {}),
    flashing: types.optional(FlashingAccordionModel, {}),
    curbMounted: types.optional(CurbMountedAccordionModel, {}),
    roofStructures: types.optional(RoofStructuresAccordionModel, {}),
    mechScreen: types.optional(MechScreenAccordionModel, {}),
    drainage: types.optional(DrainageAccordionModel, {}),
    insulation: types.optional(InsulationAccordionModel, {}),
    
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
}

// ============================================
// SHARED ACTIONS FACTORY
// Returns common actions for roofing steps
// ============================================

const createRoofingActions = (self: any) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateWarranty(value: boolean) {
        self.warranty = value
        self.lastModified = new Date()
    },
    updateMaterialLabor(value: boolean) {
        self.materialLabor = value
        self.lastModified = new Date()
    },
    updateRemainingYears(value: number) {
        self.remainingYears = value
        self.lastModified = new Date()
    },
    updateRoofType(value: string) {
        self.roofType = value
        self.lastModified = new Date()
    },
    updateOtherType(value: string) {
        self.otherType = value
        self.lastModified = new Date()
    },
    updateMaterial(data: Parameters<typeof self.material.update>[0]) {
        self.material.update(data)
        self.lastModified = new Date()
    },
    updateShingles(data: Parameters<typeof self.shingles.update>[0]) {
        self.shingles.update(data)
        self.lastModified = new Date()
    },
    updateSecondaryRoof(data: Parameters<typeof self.secondaryRoof.update>[0]) {
        self.secondaryRoof.update(data)
        self.lastModified = new Date()
    },
    updateParapets(data: Parameters<typeof self.parapets.update>[0]) {
        self.parapets.update(data)
        self.lastModified = new Date()
    },
    updateRoofLeaks(data: Parameters<typeof self.roofLeaks.update>[0]) {
        self.roofLeaks.update(data)
        self.lastModified = new Date()
    },
    updateFlashing(data: Parameters<typeof self.flashing.update>[0]) {
        self.flashing.update(data)
        self.lastModified = new Date()
    },
    updateCurbMounted(data: Parameters<typeof self.curbMounted.update>[0]) {
        self.curbMounted.update(data)
        self.lastModified = new Date()
    },
    updateRoofStructures(data: Parameters<typeof self.roofStructures.update>[0]) {
        self.roofStructures.update(data)
        self.lastModified = new Date()
    },
    updateMechScreen(data: Parameters<typeof self.mechScreen.update>[0]) {
        self.mechScreen.update(data)
        self.lastModified = new Date()
    },
    updateDrainage(data: Parameters<typeof self.drainage.update>[0]) {
        self.drainage.update(data)
        self.lastModified = new Date()
    },
    updateInsulation(data: Parameters<typeof self.insulation.update>[0]) {
        self.insulation.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
})

// ============================================
// STEP 3: PRIMARY ROOF
// ============================================

export const BuildingEnvelopeStep3 = types
    .model("BuildingEnvelopeStep3", RoofingSharedProperties)
    .actions(createRoofingActions)

// ============================================
// STEP 3B: SECONDARY ROOF
// Includes NotApplicable flag at step level
// ============================================

export const BuildingEnvelopeStep3B = types
    .model("BuildingEnvelopeStep3B", {
        stepNotApplicable: types.optional(types.boolean, false),
        ...RoofingSharedProperties,
    })
    .actions((self) => ({
        ...createRoofingActions(self),
        updateStepNotApplicable(value: boolean) {
            self.stepNotApplicable = value
            self.lastModified = new Date()
        },
    }))