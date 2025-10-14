import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ProjectSummaryStore } from "./ProjectSummaryStore"

export const RootStore = types
.model("RootStore")
.props({
  projectSummaryStore: types.optional(ProjectSummaryStore, {}),
})
.actions((self) => ({
  resetAll() {
    self.projectSummaryStore = ProjectSummaryStore.create({})
  },
}))

export interface RootStoreInstance extends Instance<typeof RootStore> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStore> {}
