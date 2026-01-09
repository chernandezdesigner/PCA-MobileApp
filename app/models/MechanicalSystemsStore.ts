import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { MechanicalSystemsStep1 } from "./MechanicalSystemsStepModels/step1"
import { MechanicalSystemsStep2 } from "./MechanicalSystemsStepModels/step2"
import { MechanicalSystemsStep3 } from "./MechanicalSystemsStepModels/step3"
import { MechanicalSystemsStep4 } from "./MechanicalSystemsStepModels/step4"
import { MechanicalSystemsStep5 } from "./MechanicalSystemsStepModels/step5"
import { MechanicalSystemsStep6 } from "./MechanicalSystemsStepModels/step6"
import { MechanicalSystemsStep7 } from "./MechanicalSystemsStepModels/step7"
import { MechanicalSystemsStep8 } from "./MechanicalSystemsStepModels/step8"
import { MechanicalSystemsStep9 } from "./MechanicalSystemsStepModels/step9"

/**
 * Mechanical Systems Store - Form 4
 * 
 * Combines all 9 steps of the Mechanical Systems assessment:
 * - Step 1: HVAC Individual Units (Packaged, Split Systems, Furnaces, etc.)
 * - Step 2: Misc Units (Unit Heaters, Air Handling Units, Exhaust Fans)
 * - Step 3: Chillers & Cooling Towers
 * - Step 4: Boilers (Heat & Plumbing Water)
 * - Step 5: Plumbing Systems (Domestic Piping, Water Meter, Waste, Gas)
 * - Step 6: Water Heaters (Common Area & Tenant Spaces)
 * - Step 7: Electrical (Transformers, Main, Tenant, Generators)
 * - Step 8: Elevators & Conveying Systems
 * - Step 9: Fire Protection
 */
export const MechanicalSystemsStore = types
  .model("MechanicalSystemsStore")
  .props({
    step1: types.optional(MechanicalSystemsStep1, {}),
    step2: types.optional(MechanicalSystemsStep2, {}),
    step3: types.optional(MechanicalSystemsStep3, {}),
    step4: types.optional(MechanicalSystemsStep4, {}),
    step5: types.optional(MechanicalSystemsStep5, {}),
    step6: types.optional(MechanicalSystemsStep6, {}),
    step7: types.optional(MechanicalSystemsStep7, {}),
    step8: types.optional(MechanicalSystemsStep8, {}),
    step9: types.optional(MechanicalSystemsStep9, {}),
    
    currentStep: types.optional(types.number, 1),
    lastModified: types.optional(types.Date, () => new Date()),
  })
  .actions((self) => ({
    setCurrentStep(step: number) {
      if (step >= 1 && step <= 9) {
        self.currentStep = step
        self.lastModified = new Date()
      }
    },
    
    nextStep() {
      if (self.currentStep < 9) {
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
      self.step1 = MechanicalSystemsStep1.create({})
      self.step2 = MechanicalSystemsStep2.create({})
      self.step3 = MechanicalSystemsStep3.create({})
      self.step4 = MechanicalSystemsStep4.create({})
      self.step5 = MechanicalSystemsStep5.create({})
      self.step6 = MechanicalSystemsStep6.create({})
      self.step7 = MechanicalSystemsStep7.create({})
      self.step8 = MechanicalSystemsStep8.create({})
      self.step9 = MechanicalSystemsStep9.create({})
      self.currentStep = 1
      self.lastModified = new Date()
    },
  }))
  .views((self) => ({
    get isFirstStep() {
      return self.currentStep === 1
    },
    
    get isLastStep() {
      return self.currentStep === 9
    },
    
    get progress() {
      return (self.currentStep / 9) * 100
    },
    
    get completionStatus() {
      // Can add logic to check if steps are completed
      return {
        step1: true, // Placeholder - implement actual completion logic
        step2: true,
        step3: true,
        step4: true,
        step5: true,
        step6: true,
        step7: true,
        step8: true,
        step9: true,
      }
    },
  }))

export interface MechanicalSystemsStoreInstance extends Instance<typeof MechanicalSystemsStore> {}
export interface MechanicalSystemsStoreSnapshot extends SnapshotOut<typeof MechanicalSystemsStore> {}

