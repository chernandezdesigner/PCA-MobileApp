import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ProjectSummaryStore } from "./ProjectSummaryStore"

export const AssessmentModel = types
  .model("Assessment", {
    id: types.identifier,
    status: types.optional(types.enumeration(["draft", "submitted", "synced"]), "draft"),
    createdAt: types.optional(types.Date, () => new Date()),
    updatedAt: types.optional(types.Date, () => new Date()),

    // Forms
    projectSummary: types.optional(ProjectSummaryStore, {}),
    // TODO: add additional forms as they are implemented
  })
  .actions((self) => ({
    touch() {
      self.updatedAt = new Date()
    },
  }))

export interface AssessmentInstance extends Instance<typeof AssessmentModel> {}
export interface AssessmentIn extends SnapshotIn<typeof AssessmentModel> {}
export interface AssessmentOut extends SnapshotOut<typeof AssessmentModel> {}


