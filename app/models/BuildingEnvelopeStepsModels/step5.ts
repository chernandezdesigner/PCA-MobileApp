// Parking, Paving, Sidewalks Models
// Dynamic material selection with condition assessments

import { types } from "mobx-state-tree"
import { ConditionAssessment, ConditionAssessmentwithEffAge } from "../SharedModels"

// ============================================
// BASIC INFORMATION ACCORDION
// Parking counts, ADA compliance info
// ============================================

export const BasicInformationAccordionModel = types.model("BasicInformationAccordionModel", {
    amountOfParkingSpaces: types.optional(types.number, 0),
    openLotSpaces: types.optional(types.number, 0),
    carportSpaces: types.optional(types.number, 0),
    garageSpaces: types.optional(types.number, 0),
    tuckUnder: types.optional(types.boolean, false),
    regADASpaces: types.optional(types.number, 0),
    vanSpaces: types.optional(types.number, 0),
    ADASignage: types.optional(types.boolean, false),
    missingADASigns: types.optional(types.number, 0),
    ADAVanSignage: types.optional(types.boolean, false),
    missingADAVanSigns: types.optional(types.number, 0),
    ADARampSignage: types.optional(types.enumeration("ADARampSignage", ["Yes", "No", "Not Applicable"]), "Not Applicable"),
    other: types.optional(types.string, ""),
    publicAccess: types.optional(types.enumeration("PublicAccess", ["Yes", "No", "Not Applicable"]), "Not Applicable"),
    whereNeeded: types.optional(types.string, ""),
})
.actions((self) => ({
    update(data: { 
        amountOfParkingSpaces?: number; 
        openLotSpaces?: number; 
        carportSpaces?: number; 
        garageSpaces?: number; 
        tuckUnder?: boolean; 
        regADASpaces?: number; 
        vanSpaces?: number; 
        ADASignage?: boolean; 
        missingADASigns?: number; 
        ADAVanSignage?: boolean; 
        missingADAVanSigns?: number; 
        ADARampSignage?: "Yes" | "No" | "Not Applicable"; 
        other?: string; 
        publicAccess?: "Yes" | "No" | "Not Applicable"; 
        whereNeeded?: string;
    }) {
        if (data.amountOfParkingSpaces !== undefined) self.amountOfParkingSpaces = data.amountOfParkingSpaces
        if (data.openLotSpaces !== undefined) self.openLotSpaces = data.openLotSpaces
        if (data.carportSpaces !== undefined) self.carportSpaces = data.carportSpaces
        if (data.garageSpaces !== undefined) self.garageSpaces = data.garageSpaces
        if (data.tuckUnder !== undefined) self.tuckUnder = data.tuckUnder
        if (data.regADASpaces !== undefined) self.regADASpaces = data.regADASpaces
        if (data.vanSpaces !== undefined) self.vanSpaces = data.vanSpaces
        if (data.ADASignage !== undefined) self.ADASignage = data.ADASignage
        if (data.missingADASigns !== undefined) self.missingADASigns = data.missingADASigns
        if (data.ADAVanSignage !== undefined) self.ADAVanSignage = data.ADAVanSignage
        if (data.missingADAVanSigns !== undefined) self.missingADAVanSigns = data.missingADAVanSigns
        if (data.ADARampSignage !== undefined) self.ADARampSignage = data.ADARampSignage
        if (data.other !== undefined) self.other = data.other
        if (data.publicAccess !== undefined) self.publicAccess = data.publicAccess
        if (data.whereNeeded !== undefined) self.whereNeeded = data.whereNeeded
    }
}))

// ============================================
// PAVEMENT ACCORDION
// Dynamic material selection with assessments
// ============================================

export const PavementAccordionModel = types.model("PavementAccordionModel", {
    // Map structure: key = material type (e.g., "Gravel", "Asphalt"), value = assessment
    materials: types.map(ConditionAssessmentwithEffAge),
})
.actions((self) => ({
    // Add or update a material with its assessment
    updateMaterial(materialType: string, assessment: any) {
        const existing = self.materials.get(materialType)
        if (existing) {
            Object.assign(existing, assessment)
        } else {
            self.materials.set(materialType, assessment)
        }
    },
    // Remove a material type (when unchecked)
    removeMaterial(materialType: string) {
        self.materials.delete(materialType)
    },
    // Clear all materials
    clearMaterials() {
        self.materials.clear()
    },
}))

// ============================================
// ENTRANCE APRONS ACCORDION
// ============================================

export const EntranceApronsAccordionModel = types.model("EntranceApronsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materials: types.map(ConditionAssessmentwithEffAge),
})
.actions((self) => ({
    updateNotApplicable(value: boolean) {
        self.NotApplicable = value
        if (value) {
            self.materials.clear() // Clear all when N/A
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
}))

// ============================================
// CURBING ACCORDION
// ============================================

export const CurbingAccordionModel = types.model("CurbingAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materials: types.map(ConditionAssessmentwithEffAge),
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
}))

// ============================================
// NESTED RAILING MODEL FOR SIDEWALKS/WALKWAYS
// ============================================

export const railingForSidewalksModel = types.model("railingForSidewalksModel", {
    railingTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { railingTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.railingTypes !== undefined) self.railingTypes.replace(data.railingTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ============================================
// SIDEWALKS/WALKWAYS ACCORDION
// ============================================

export const SidewalksWalkwaysAccordionModel = types.model("SidewalksWalkwaysAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    materials: types.map(ConditionAssessmentwithEffAge),
    // Material checkboxes: Metal, Wood, Vinyl
    materialCheckboxes: types.optional(types.map(types.boolean), {}),
    // Railing option
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForSidewalksModel)),
})
.actions((self) => ({
    updateNotApplicable(value: boolean) {
        self.NotApplicable = value
        if (value) {
            self.materials.clear()
            self.materialCheckboxes.clear()
        }
    },
    updateMaterialCheckbox(material: string, checked: boolean) {
        if (checked) {
            self.materialCheckboxes.set(material, true)
        } else {
            self.materialCheckboxes.delete(material)
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
// NESTED RAILING MODEL FOR STEPS/STAIRS
// ============================================

export const railingForStepsStairsModel = types.model("railingForStepsStairsModel", {
    railingTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { railingTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.railingTypes !== undefined) self.railingTypes.replace(data.railingTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ============================================
// STEPS/STAIRS/EXTENSION OF WALKWAYS ACCORDION
// ============================================

export const StepsStairsAccordionModel = types.model("StepsStairsAccordionModel", {
    materials: types.map(ConditionAssessmentwithEffAge),
    // Material options with Y/N: Metal, Wood, Vinyl, Granite, Steel, Wood
    materialOptions: types.optional(types.map(types.boolean), {}),
    // Railing option
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForStepsStairsModel)),
})
.actions((self) => ({
    updateMaterialOption(material: string, value: boolean) {
        self.materialOptions.set(material, value)
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

export const BuildingEnvelopeStep5 = types.model("BuildingEnvelopeStep5", {
    basicInformation: types.optional(BasicInformationAccordionModel, {}),
    pavement: types.optional(PavementAccordionModel, {}),
    entranceAprons: types.optional(EntranceApronsAccordionModel, {}),
    curbing: types.optional(CurbingAccordionModel, {}),
    sidewalksWalkways: types.optional(SidewalksWalkwaysAccordionModel, {}),
    stepsStairs: types.optional(StepsStairsAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateBasicInformation(data: Parameters<typeof self.basicInformation.update>[0]) {
        self.basicInformation.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))