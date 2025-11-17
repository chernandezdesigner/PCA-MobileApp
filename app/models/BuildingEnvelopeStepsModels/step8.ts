//windows models
import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const WindowsTypeAccordionModel = types.model("WindowsTypeAccordionModel", {
    windowsTypeChecklist: types.optional(types.map(types.boolean), {}),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    // Update individual window type (like updateDocumentChecklist pattern)
    updateWindowType(windowType: string, checked: boolean) {
        self.windowsTypeChecklist.set(windowType, checked)
    },
    // Update the overall assessment for all checked window types
    updateAssessment(data: Record<string, any>) {
        Object.assign(self.assessment as any, data)
    },
    // Clear all window types
    clearWindowTypes() {
        self.windowsTypeChecklist.clear()
    },
}))

export const GlazingAndPanesAccordionModel = types.model("GlazingAndPanesAccordionModel", {
    glazingType: types.optional(types.string, ""),
    panesType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { glazingType?: string; panesType?: string; assessment?: Record<string, any> }) {
        if (data.glazingType !== undefined) self.glazingType = data.glazingType
        if (data.panesType !== undefined) self.panesType = data.panesType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const FrameTypeAccordionModel = types.model("FrameTypeAccordionModel", {
    frameType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
})
.actions((self) => ({
    update(data: { frameType?: string; assessment?: Record<string, any> }) {
        if (data.frameType !== undefined) self.frameType = data.frameType
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
    // Window types are updated directly via windowsType.updateWindowType()
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