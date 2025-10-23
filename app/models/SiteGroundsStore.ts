import { types } from "mobx-state-tree"
import { SiteGroundsStep2 } from "./SiteGroundsStepsModels/step2"
import { SiteGroundsStep3 } from "./SiteGroundsStepsModels/step3"
// import { DrainageErosionStep1Model } from "./SiteGroundsStepsModels/Step1" // uncomment when Step1 is ready


export const SiteGroundsStore = types
.model("SiteGroundsStore")
.props({
    // step1: types.optional(DrainageErosionStep1Model, {}),
    step2: types.optional(SiteGroundsStep2, {}),
    step3: types.optional(SiteGroundsStep3, {}),
    currentStep: types.optional(types.number, 1),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    goToStep(step: number) {
        self.currentStep = step
        self.lastModified = new Date()
    },
    touch() {
        self.lastModified = new Date()
    },
}))