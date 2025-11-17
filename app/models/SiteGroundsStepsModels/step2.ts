import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"


export const TopographySlopeAccordionModel = types.model("TopographySlopeAccordionModel", {
    topographySlopes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { topographySlopes?: string[]; assessment?: Record<string, any> }) {
        if (data.topographySlopes !== undefined) self.topographySlopes.replace(data.topographySlopes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const LandscapingAccordionModel = types.model("LandscapingAccordionModel", {
    landscaping: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { landscaping?: string[]; assessment?: Record<string, any> }) {
        if (data.landscaping !== undefined) self.landscaping.replace(data.landscaping)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RetainingWallsAccordionModel = types.model("RetainingWallsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    retainingWallMaterials: types.optional(types.array(types.string), []),
    otherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a single nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForRetainingWallsModel)),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; retainingWallMaterials?: string[]; otherType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.retainingWallMaterials !== undefined) self.retainingWallMaterials.replace(data.retainingWallMaterials)
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

export const railingForRetainingWallsModel = types.model("railingForRetainingWallsModel", {
    railingMaterials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { railingMaterials?: string[]; assessment?: Record<string, any> }) {
        if (data.railingMaterials !== undefined) self.railingMaterials.replace(data.railingMaterials)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const railingForScreenWallsModel = types.model("railingForScreenWallsModel", {
    railingMaterials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { railingMaterials?: string[]; assessment?: Record<string, any> }) {
        if (data.railingMaterials !== undefined) self.railingMaterials.replace(data.railingMaterials)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ScreenWallsAccordionModel = types.model("ScreenWallsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    screenWallMaterials: types.optional(types.array(types.string), []),
    otherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a single nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForScreenWallsModel)),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; screenWallMaterials?: string[]; otherType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.screenWallMaterials !== undefined) self.screenWallMaterials.replace(data.screenWallMaterials)
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

export const WaterFeaturesAccordionModel = types.model("WaterFeaturesAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    waterFeatures: types.optional(types.array(types.string), []),
    pumpLocations: types.optional(types.array(types.string), []),
    pumpAge: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; waterFeatures?: string[]; pumpLocations?: string[]; pumpAge?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.waterFeatures !== undefined) self.waterFeatures.replace(data.waterFeatures)
        if (data.pumpLocations !== undefined) self.pumpLocations.replace(data.pumpLocations)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.pumpAge !== undefined) self.pumpAge = data.pumpAge
    },
}))

export const SiteGroundsStep2 = types
.model("SiteGroundsStep2", {
    topographySlope: types.optional(TopographySlopeAccordionModel, {}),
    landscaping: types.optional(LandscapingAccordionModel, {}),
    retainingWalls: types.optional(RetainingWallsAccordionModel, {}),
    screenWalls: types.optional(ScreenWallsAccordionModel, {}),
    waterFeatures: types.optional(WaterFeaturesAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateTopographySlope(data: Parameters<typeof self.topographySlope.update>[0]) {
        self.topographySlope.update(data)
        self.lastModified = new Date()
    },
    updateLandscaping(data: Parameters<typeof self.landscaping.update>[0]) {
        self.landscaping.update(data)
        self.lastModified = new Date()
    },
    updateRetainingWalls(data: Parameters<typeof self.retainingWalls.update>[0]) {
        self.retainingWalls.update(data)
        self.lastModified = new Date()
    },
    updateScreenWalls(data: Parameters<typeof self.screenWalls.update>[0]) {
        self.screenWalls.update(data)
        self.lastModified = new Date()
    },
    updateWaterFeatures(data: Parameters<typeof self.waterFeatures.update>[0]) {
        self.waterFeatures.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data 
        self.lastModified = new Date()
    },
}))