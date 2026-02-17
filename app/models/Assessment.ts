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
    status: types.optional(types.enumeration(["draft", "submitted", "synced"]), "draft"),
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


