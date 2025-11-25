// Building Envelope Step 3 & Step 3B: Primary and Secondary Roofing
// Both steps share the same accordion models and structure
// Step 3B includes a NotApplicable flag at the step level

import { types } from "mobx-state-tree"
import { ConditionAssessment, RepairAssessment } from "../SharedModels"

// ============================================
// SHARED ACCORDION MODELS (Used by both roofs)
// ============================================

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

export const ShinglesAccordionModel = types.model("ShinglesAccordionModel", {
    shingles: types.optional(types.array(types.string), []),
    otherSpecification: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { shingles?: string[]; otherSpecification?: string; assessment?: Record<string, any> }) {
        if (data.shingles !== undefined) self.shingles.replace(data.shingles)
        if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SecondaryRoofAccordionModel = types.model("SecondaryRoofAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    secondaryRoof: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; secondaryRoof?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.secondaryRoof !== undefined) self.secondaryRoof.replace(data.secondaryRoof)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ParapetsAccordionModel = types.model("ParapetsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { NotApplicable?: boolean; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
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
    flashing: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { flashing?: string[]; assessment?: Record<string, any> }) {
        if (data.flashing !== undefined) self.flashing.replace(data.flashing)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const CurbMountedAccordionModel = types.model("CurbMountedAccordionModel", {
    curbMounted: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { curbMounted?: string[]; assessment?: Record<string, any> }) {
        if (data.curbMounted !== undefined) self.curbMounted.replace(data.curbMounted)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RoofStructuresAccordionModel = types.model("RoofStructuresAccordionModel", {
    roofStructures: types.optional(types.array(types.string), []),
    otherSpecification: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { roofStructures?: string[]; otherSpecification?: string; assessment?: Record<string, any> }) {
        if (data.roofStructures !== undefined) self.roofStructures.replace(data.roofStructures)
        if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
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
    drainage: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { drainage?: string[]; assessment?: Record<string, any> }) {
        if (data.drainage !== undefined) self.drainage.replace(data.drainage)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const InsulationAccordionModel = types.model("InsulationAccordionModel", {
    insulation: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { insulation?: string[]; assessment?: Record<string, any> }) {
        if (data.insulation !== undefined) self.insulation.replace(data.insulation)
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