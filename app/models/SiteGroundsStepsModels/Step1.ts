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
    
    // Surface drainage destinations (multi-select)
    surfaceTo: types.optional(types.array(types.string), []),
    
    // Drainage features (multi-select without comments)
    drainageFeatures: types.optional(types.array(types.string), []),
    
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
    
    toggleSurfaceTo(id: string) {
        if (self.surfaceTo.includes(id)) {
            self.surfaceTo.remove(id)
        } else {
            self.surfaceTo.push(id)
        }
        self.lastModified = new Date()
    },
    
    toggleDrainageFeature(id: string) {
        if (self.drainageFeatures.includes(id)) {
            self.drainageFeatures.remove(id)
        } else {
            self.drainageFeatures.push(id)
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
        surfaceTo?: string[]
        drainageFeatures?: string[]
        comments?: string
    }) {
        if (data.assessment) {
            Object.assign(self.assessment as any, data.assessment)
        }
        if (data.undergroundToMunicipalStormSystem !== undefined) {
            self.undergroundToMunicipalStormSystem = data.undergroundToMunicipalStormSystem
        }
        if (data.surfaceTo !== undefined) {
            self.surfaceTo.replace(data.surfaceTo)
        }
        if (data.drainageFeatures !== undefined) {
            self.drainageFeatures.replace(data.drainageFeatures)
        }
        if (data.comments !== undefined) {
            self.comments = data.comments
        }
        self.lastModified = new Date()
    },
}))