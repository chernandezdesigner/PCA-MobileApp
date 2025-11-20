import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const WallsLateralAccordionModel = types.model("WallsLateralAccordionModel", {
    lateralWalls: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { lateralWalls?: string[]; assessment?: Record<string, any> }) {
        if (data.lateralWalls !== undefined) self.lateralWalls.replace(data.lateralWalls)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GroundFloorDeckingAccordionModel = types.model("GroundFloorDeckingAccordionModel", {
    groundFloorDecking: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { groundFloorDecking?: string[]; assessment?: Record<string, any> }) {
        if (data.groundFloorDecking !== undefined) self.groundFloorDecking.replace(data.groundFloorDecking)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const UpperFloorDeckingAccordionModel = types.model("UpperFloorDeckingAccordionModel", {
    upperFloorDecking: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { upperFloorDecking?: string[]; assessment?: Record<string, any> }) {
        if (data.upperFloorDecking !== undefined) self.upperFloorDecking.replace(data.upperFloorDecking)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const MezzanineAccordionModel = types.model("MezzanineAccordionModel", {
    mezzanine: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { mezzanine?: string[]; assessment?: Record<string, any> }) {
        if (data.mezzanine !== undefined) self.mezzanine.replace(data.mezzanine)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

// ask about roof framing types setup

export const SheathingAccordionModel = types.model("SheathingAccordionModel", {
    sheathing: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { sheathing?: string[]; assessment?: Record<string, any> }) {
        if (data.sheathing !== undefined) self.sheathing.replace(data.sheathing)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BuildingEnvelopeStep2 = types.model("BuildingEnvelopeStep2", {
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