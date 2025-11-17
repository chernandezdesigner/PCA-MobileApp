//doors models incomplete will circle back to this after questions.

import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const DoorsAccordionModel = types.model("DoorsAccordionModel", {
    doorType: types.optional(types.string, ""),
    handleType: types.optional(types.enumeration("handleType", ["Lever", "Knob"]), "Lever"),
    exitDevice: types.optional(types.enumeration("exitDevice", ["PushPull", "Panic"]), "PushPull"),
    FrameType: types.optional(types.enumeration("FrameType", ["Wood", "Metal"]), "Wood"),
    //other options questions
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { doorType?: string; handleType?: "Lever" | "Knob"; exitDevice?: "PushPull" | "Panic"; assessment?: Record<string, any> }) {
        if (data.doorType !== undefined) self.doorType = data.doorType
        if (data.handleType !== undefined) self.handleType = data.handleType
        if (data.exitDevice !== undefined) self.exitDevice = data.exitDevice
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ServiceDoorsAccordionModel = types.model("ServiceDoorsAccordionModel", {
    doorType: types.optional(types.string, ""),
    handleType: types.optional(types.enumeration("handleType", ["Lever", "Knob"]), "Lever"),
    exitDevice: types.optional(types.enumeration("exitDevice", ["PushPull", "Panic"]), "PushPull"),
    FrameType: types.optional(types.enumeration("FrameType", ["Wood", "Metal"]), "Wood"),
    //other options questions
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { doorType?: string; handleType?: "Lever" | "Knob"; exitDevice?: "PushPull" | "Panic"; assessment?: Record<string, any> }) {
        if (data.doorType !== undefined) self.doorType = data.doorType
        if (data.handleType !== undefined) self.handleType = data.handleType
        if (data.exitDevice !== undefined) self.exitDevice = data.exitDevice
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const HardWareTypeAccordionModel = types.model("HardWareTypeAccordionModel", {
    hardwareType: types.optional(types.enumeration("hardwareType", ["Commercial Grade", "Residential Grade"]), "Commercial Grade"),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { hardwareType?: "Commercial Grade" | "Residential Grade"; assessment?: Record<string, any> }) {
        if (data.hardwareType !== undefined) self.hardwareType = data.hardwareType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

