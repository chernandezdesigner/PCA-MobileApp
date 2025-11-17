import { types } from "mobx-state-tree"
import { BuildingEnvelopeStep1 } from "./BuildingEnvelopeStepsModels/step1"
import { BuildingEnvelopeStep2 } from "./BuildingEnvelopeStepsModels/step2"
import { BuildingEnvelopeStep3, BuildingEnvelopeStep3B } from "./BuildingEnvelopeStepsModels/step3"
import { BuildingEnvelopeStep4 } from "./BuildingEnvelopeStepsModels/step4"
import { BuildingEnvelopeStep5 } from "./BuildingEnvelopeStepsModels/step5"
import { BuildingEnvelopeStep6 } from "./BuildingEnvelopeStepsModels/step6"
import { BuildingEnvelopeStep7 } from "./BuildingEnvelopeStepsModels/step7"
import { BuildingEnvelopeStep10 } from "./BuildingEnvelopeStepsModels/step10"

export const BuildingEnvelopeStore = types
  .model("BuildingEnvelopeStore")
  .props({
    step1: types.optional(BuildingEnvelopeStep1, {}),
    step2: types.optional(BuildingEnvelopeStep2, {}),
    step3: types.optional(BuildingEnvelopeStep3, {}),
    step3B: types.optional(BuildingEnvelopeStep3B, {}),
    step4: types.optional(BuildingEnvelopeStep4, {}),
    step5: types.optional(BuildingEnvelopeStep5, {}),
    step6: types.optional(BuildingEnvelopeStep6, {}),
    step7: types.optional(BuildingEnvelopeStep7, {}),
    // TODO: Add step8, step9 when implemented
    step10: types.optional(BuildingEnvelopeStep10, {}),
    currentStep: types.optional(types.string, "step1"),
    lastModified: types.optional(types.Date, () => new Date()),
  })
  .actions((self) => ({
    goToStep(step: string) {
      self.currentStep = step
      self.lastModified = new Date()
    },
    touch() {
      self.lastModified = new Date()
    },
  }))

