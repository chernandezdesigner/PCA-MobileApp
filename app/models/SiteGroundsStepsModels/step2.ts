import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"


export const TopographySlopeAccordionModel = types.model("TopographySlopeAccordionModel", {
    slopeType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { slopeType?: string; assessment?: Record<string, any> }) {
        if (data.slopeType !== undefined) self.slopeType = data.slopeType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const LandscapingAccordionModel = types.model("LandscapingAccordionModel", {
    landscapingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { landscapingType?: string; assessment?: Record<string, any> }) {
        if (data.landscapingType !== undefined) self.landscapingType = data.landscapingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RetainingWallsAccordionModel = types.model("RetainingWallsAccordionModel", {
    retainingWallsType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a single nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForRetainingWallsModel)),
    })
    .actions((self) => ({
        update(data: { retainingWallsType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.retainingWallsType !== undefined) self.retainingWallsType = data.retainingWallsType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

export const railingForRetainingWallsModel = types.model("railingForRetainingWallsModel", {
    railingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { railingType?: string; assessment?: Record<string, any> }) {
        if (data.railingType !== undefined) self.railingType = data.railingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const railingForScreenWallsModel = types.model("railingForScreenWallsModel", {
    railingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { railingType?: string; assessment?: Record<string, any> }) {
        if (data.railingType !== undefined) self.railingType = data.railingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ScreenWallsAccordionModel = types.model("ScreenWallsAccordionModel", {
    screenWallsType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a single nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForScreenWallsModel)),
    })
    .actions((self) => ({
        update(data: { screenWallsType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.screenWallsType !== undefined) self.screenWallsType = data.screenWallsType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

export const WaterFeaturesAccordionModel = types.model("WaterFeaturesAccordionModel", {
    waterFeaturesType: types.optional(types.string, ""),
    pumpLocation: types.optional(types.string, ""),
    pumpAge: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { waterFeaturesType?: string; pumpLocation?: string; pumpAge?: string; assessment?: Record<string, any> }) {
        if (data.waterFeaturesType !== undefined) self.waterFeaturesType = data.waterFeaturesType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.pumpLocation !== undefined) self.pumpLocation = data.pumpLocation
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