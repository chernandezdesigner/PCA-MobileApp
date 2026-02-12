import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { InteriorConditionsStep1 } from "./InteriorConditionsStepModels/step1"
import { InteriorConditionsStep2 } from "./InteriorConditionsStepModels/step2"
import { InteriorConditionsStep3 } from "./InteriorConditionsStepModels/step3"
import { InteriorConditionsStep4 } from "./InteriorConditionsStepModels/step4"

/**
 * Interior Conditions Store - Form 5
 *
 * Combines all 4 steps of the Interior Conditions assessment:
 * - Step 1: Commercial Tenant Unit Finishes
 * - Step 2: Common Area Finishes
 * - Step 3: Mold & Moisture
 * - Step 4: Alternate Properties (Hotel, Apartment, Storage, Mobile Homes, Nursing Homes, Multi-Family)
 */
export const InteriorConditionsStore = types
  .model("InteriorConditionsStore")
  .props({
    step1: types.optional(InteriorConditionsStep1, {}),
    step2: types.optional(InteriorConditionsStep2, {}),
    step3: types.optional(InteriorConditionsStep3, {}),
    step4: types.optional(InteriorConditionsStep4, {}),

    currentStep: types.optional(types.number, 1),
    lastModified: types.optional(types.Date, () => new Date()),
  })
  .actions((self) => ({
    setCurrentStep(step: number) {
      if (step >= 1 && step <= 4) {
        self.currentStep = step
        self.lastModified = new Date()
      }
    },

    nextStep() {
      if (self.currentStep < 4) {
        self.currentStep += 1
        self.lastModified = new Date()
      }
    },

    previousStep() {
      if (self.currentStep > 1) {
        self.currentStep -= 1
        self.lastModified = new Date()
      }
    },

    touch() {
      self.lastModified = new Date()
    },

    clearAll() {
      // Reset all steps to initial state
      self.step1 = InteriorConditionsStep1.create({})
      self.step2 = InteriorConditionsStep2.create({})
      self.step3 = InteriorConditionsStep3.create({})
      self.step4 = InteriorConditionsStep4.create({})
      self.currentStep = 1
      self.lastModified = new Date()
    },
  }))
  .views((self) => ({
    get isFirstStep() {
      return self.currentStep === 1
    },

    get isLastStep() {
      return self.currentStep === 4
    },

    get progress() {
      return (self.currentStep / 4) * 100
    },

    get completionStatus() {
      // Can add logic to check if steps are completed
      return {
        step1: true, // Placeholder - implement actual completion logic
        step2: true,
        step3: true,
        step4: true,
      }
    },
  }))

export interface InteriorConditionsStoreInstance extends Instance<typeof InteriorConditionsStore> {}
export interface InteriorConditionsStoreSnapshot extends SnapshotOut<typeof InteriorConditionsStore> {}
