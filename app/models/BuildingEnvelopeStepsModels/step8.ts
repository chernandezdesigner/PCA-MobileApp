//windows models
import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const WindowsTypeAccordionModel = types.model("WindowsTypeAccordionModel", {
    windowTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { windowTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.windowTypes !== undefined) self.windowTypes.replace(data.windowTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GlazingAndPanesAccordionModel = types.model("GlazingAndPanesAccordionModel", {
    glazing: types.optional(types.array(types.string), []),
    panes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { glazing?: string[]; panes?: string[]; assessment?: Record<string, any> }) {
        if (data.glazing !== undefined) self.glazing.replace(data.glazing)
        if (data.panes !== undefined) self.panes.replace(data.panes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const FrameTypeAccordionModel = types.model("FrameTypeAccordionModel", {
    frameTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { frameTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.frameTypes !== undefined) self.frameTypes.replace(data.frameTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BuildingEnvelopeStep8 = types.model("BuildingEnvelopeStep8", {
    windowsType: types.optional(WindowsTypeAccordionModel, {}),
    glazingAndPanes: types.optional(GlazingAndPanesAccordionModel, {}),
    frameType: types.optional(FrameTypeAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateWindowsType(data: Parameters<typeof self.windowsType.update>[0]) {
        self.windowsType.update(data)
        self.lastModified = new Date()
    },
    updateGlazingAndPanes(data: Parameters<typeof self.glazingAndPanes.update>[0]) {
        self.glazingAndPanes.update(data)
        self.lastModified = new Date()
    },
    updateFrameType(data: Parameters<typeof self.frameType.update>[0]) {
        self.frameType.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data
        self.lastModified = new Date()
    },
}))