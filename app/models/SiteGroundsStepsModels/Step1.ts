import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// Checklist item model for drainage features
export const ChecklistItemModel = types.model("ChecklistItemModel", {
    checked: types.optional(types.boolean, false),
    comments: types.optional(types.string, ""),
})

export const DrainageErosionStep1Model = types.model("DrainageErosionStep1Model", {
    // Main condition assessment
    assessment: types.optional(ConditionAssessment, {}),
    
    // Underground to municipal storm system (yes/no)
    undergroundToMunicipalStormSystem: types.optional(types.boolean, false),
    
    // Surface drainage destination
    surfaceTo: types.optional(types.string, ""),
    
    // Checklist items: Concrete swales, Surface drains, Curb inlets, Adjacent property
    checklist: types.optional(
        types.map(ChecklistItemModel),
        {},
    ),
    
    // Overall comments
    comments: types.optional(types.string, ""),
    
    // Track modifications
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    updateAssessment(data: { condition?: string; repairStatus?: string; amountToRepair?: string }) {
        if (data.condition !== undefined) (self.assessment as any).condition = data.condition
        if (data.repairStatus !== undefined) (self.assessment as any).repairStatus = data.repairStatus
        if (data.amountToRepair !== undefined) (self.assessment as any).amountToRepair = data.amountToRepair
        self.lastModified = new Date()
    },
    
    updateUndergroundToMunicipalStormSystem(value: boolean) {
        self.undergroundToMunicipalStormSystem = value
        self.lastModified = new Date()
    },
    
    updateSurfaceTo(value: string) {
        self.surfaceTo = value
        self.lastModified = new Date()
    },
    
    updateChecklistItem(id: string, checked: boolean, comments?: string) {
        const existing = self.checklist.get(id)
        if (existing) {
            self.checklist.set(id, { 
                checked, 
                comments: comments !== undefined ? comments : existing.comments 
            })
        } else {
            self.checklist.set(id, { checked, comments: comments ?? "" })
        }
        self.lastModified = new Date()
    },
    
    updateComments(value: string) {
        self.comments = value
        self.lastModified = new Date()
    },
    
    // Bulk update method
    update(data: {
        assessment?: Record<string, any>
        undergroundToMunicipalStormSystem?: boolean
        surfaceTo?: string
        checklist?: Record<string, { checked: boolean; comments?: string }>
        comments?: string
    }) {
        if (data.assessment) {
            Object.assign(self.assessment as any, data.assessment)
        }
        if (data.undergroundToMunicipalStormSystem !== undefined) {
            self.undergroundToMunicipalStormSystem = data.undergroundToMunicipalStormSystem
        }
        if (data.surfaceTo !== undefined) {
            self.surfaceTo = data.surfaceTo
        }
        if (data.checklist) {
            Object.entries(data.checklist).forEach(([key, value]) => {
                self.checklist.set(key, value as any)
            })
        }
        if (data.comments !== undefined) {
            self.comments = data.comments
        }
        self.lastModified = new Date()
    },
}))