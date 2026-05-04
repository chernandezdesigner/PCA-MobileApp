import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ProjectSummaryStore } from "./ProjectSummaryStore"
import { SiteGroundsStore } from "./SiteGroundsStore"
import { BuildingEnvelopeStore } from "./BuildingEnvelopeStore"
import { MechanicalSystemsStore } from "./MechanicalSystemsStore"
import { InteriorConditionsStore } from "./InteriorConditionsStore"
import { PhotoStore } from "./PhotoStore"

export const AssessmentModel = types
  .model("Assessment", {
    id: types.identifier,
    supabaseId: types.optional(types.string, ""),
    status: types.optional(types.enumeration(["draft", "submitted", "synced"]), "draft"),
    // True when the user attempted to submit while offline.
    // Drives the "Sync Now" UI on the home screen.
    pendingSync: types.optional(types.boolean, false),
    createdAt: types.optional(types.Date, () => new Date()),
    updatedAt: types.optional(types.Date, () => new Date()),

    // Forms
    projectSummary: types.optional(ProjectSummaryStore, {}),
    siteGrounds: types.optional(SiteGroundsStore, {}),
    buildingEnvelope: types.optional(BuildingEnvelopeStore, {}),
    mechanicalSystems: types.optional(MechanicalSystemsStore, {}),
    interiorConditions: types.optional(InteriorConditionsStore, {}),

    // Photos
    photoStore: types.optional(PhotoStore, {}),
  })
  .actions((self) => ({
    touch() {
      self.updatedAt = new Date()
    },
    markAsSubmitted() {
      self.status = "submitted"
      self.pendingSync = false
      self.updatedAt = new Date()
    },
    markAsSynced() {
      self.status = "synced"
      self.pendingSync = false
      self.updatedAt = new Date()
    },
    markAsPendingSync() {
      self.pendingSync = true
      self.updatedAt = new Date()
    },
    clearPendingSync() {
      self.pendingSync = false
    },
    setSupabaseId(id: string) {
      self.supabaseId = id
    },
  }))

export interface AssessmentInstance extends Instance<typeof AssessmentModel> {}
export interface AssessmentIn extends SnapshotIn<typeof AssessmentModel> {}
export interface AssessmentOut extends SnapshotOut<typeof AssessmentModel> {}


