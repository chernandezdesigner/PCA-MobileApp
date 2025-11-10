import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ProjectSummaryStore } from "./ProjectSummaryStore"
import { SiteGroundsStore } from "./SiteGroundsStore"

export const AssessmentModel = types
  .model("Assessment", {
    id: types.identifier,
    status: types.optional(types.enumeration(["draft", "submitted", "synced"]), "draft"),
    createdAt: types.optional(types.Date, () => new Date()),
    updatedAt: types.optional(types.Date, () => new Date()),

    // Forms
    projectSummary: types.optional(ProjectSummaryStore, {}),
    siteGrounds: types.optional(SiteGroundsStore, {}),
  })
  .actions((self) => ({
    touch() {
      self.updatedAt = new Date()
    },
    markAsSubmitted() {
      self.status = "submitted"
      self.updatedAt = new Date()
    },
    markAsSynced() {
      self.status = "synced"
      self.updatedAt = new Date()
    },
  }))

export interface AssessmentInstance extends Instance<typeof AssessmentModel> {}
export interface AssessmentIn extends SnapshotIn<typeof AssessmentModel> {}
export interface AssessmentOut extends SnapshotOut<typeof AssessmentModel> {}


