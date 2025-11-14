import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const WallsLateralAccordionModel = types.model("WallsLateralAccordionModel", {
    wallsLateralType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { wallsLateralType?: string; assessment?: Record<string, any> }) {
        if (data.wallsLateralType !== undefined) self.wallsLateralType = data.wallsLateralType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GroundFloorDeckingAccordionModel = types.model("GroundFloorDeckingAccordionModel", {
    groundFloorDeckingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { groundFloorDeckingType?: string; assessment?: Record<string, any> }) {
        if (data.groundFloorDeckingType !== undefined) self.groundFloorDeckingType = data.groundFloorDeckingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const UpperFloorDeckingAccordionModel = types.model("UpperFloorDeckingAccordionModel", {
    upperFloorDeckingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { upperFloorDeckingType?: string; assessment?: Record<string, any> }) {
        if (data.upperFloorDeckingType !== undefined) self.upperFloorDeckingType = data.upperFloorDeckingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const MezzanineAccordionModel = types.model("MezzanineAccordionModel", {
    mezzanineType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { mezzanineType?: string; assessment?: Record<string, any> }) {
        if (data.mezzanineType !== undefined) self.mezzanineType = data.mezzanineType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ask about roof framing types setup

export const SheathingAccordionModel = types.model("SheathingAccordionModel", {
    sheathingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { sheathingType?: string; assessment?: Record<string, any> }) {
        if (data.sheathingType !== undefined) self.sheathingType = data.sheathingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

BuildingEnvelopeStep2 = types.model("BuildingEnvelopeStep2", {
    wallsLateral: types.optional(WallsLateralAccordionModel, {}),
    groundFloorDecking: types.optional(GroundFloorDeckingAccordionModel, {}),
    upperFloorDecking: types.optional(UpperFloorDeckingAccordionModel, {}),
    mezzanine: types.optional(MezzanineAccordionModel, {}),
    sheathing: types.optional(SheathingAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateWallsLateral(data: Parameters<typeof self.wallsLateral.update>[0]) {
        self.wallsLateral.update(data)
        self.lastModified = new Date()
    },
    updateGroundFloorDecking(data: Parameters<typeof self.groundFloorDecking.update>[0]) {
        self.groundFloorDecking.update(data)
        self.lastModified = new Date()
    },
    updateUpperFloorDecking(data: Parameters<typeof self.upperFloorDecking.update>[0]) {
        self.upperFloorDecking.update(data)
        self.lastModified = new Date()
    },
    updateMezzanine(data: Parameters<typeof self.mezzanine.update>[0]) {
        self.mezzanine.update(data)
        self.lastModified = new Date()
    },
    updateSheathing(data: Parameters<typeof self.sheathing.update>[0]) {
        self.sheathing.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))