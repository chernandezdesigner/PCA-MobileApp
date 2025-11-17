//doors models

import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const DoorsAccordionModel = types.model("DoorsAccordionModel", {
    doorType: types.optional(types.string, ""),
    handleType: types.optional(types.enumeration("handleType", ["Lever", "Knob"]), "Lever"),
    exitDevice: types.optional(types.enumeration("exitDevice", ["PushPull", "Panic"]), "PushPull"),
    FrameType: types.optional(types.enumeration("FrameType", ["Wood", "Metal"]), "Wood"),
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
