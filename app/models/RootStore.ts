import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AssessmentModel } from "./Assessment"

export const RootStore = types
.model("RootStore")
.props({
  assessments: types.optional(types.map(AssessmentModel), {}),
  activeAssessmentId: types.maybe(types.string),
})
.actions((self) => ({
  createAssessment(id: string) {
    if (!self.assessments.has(id)) {
      self.assessments.set(id, AssessmentModel.create({ id }))
    }
    self.activeAssessmentId = id
  },
  setActiveAssessment(id: string) {
    if (self.assessments.has(id)) self.activeAssessmentId = id
  },
  deleteAssessment(id: string) {
    self.assessments.delete(id)
    if (self.activeAssessmentId === id) {
      self.activeAssessmentId = undefined
    }
  },
  resetAll() {
    self.assessments.clear()
    self.activeAssessmentId = undefined
  },
}))
.views((self) => ({
  getAssessmentsList() {
    return Array.from(self.assessments.values())
  },
}))

export interface RootStoreInstance extends Instance<typeof RootStore> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStore> {}
