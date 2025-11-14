// app/models/SharedModels.ts
import { types } from "mobx-state-tree"

export const ConditionEnum = types.enumeration("ConditionEnum", ["good", "fair", "poor"])
export const RepairStatusEnum = types.enumeration("RepairStatusEnum", ["IR", "ST", "RR", "RM", "INV", "NA"])

export const ConditionAssessment = types.model("ConditionAssessment", {
  condition: types.maybe(ConditionEnum),
  repairStatus: types.maybe(RepairStatusEnum),
  amountToRepair: types.optional(types.string, ""),
})

export const RepairAssessment = types.model("RepairAssessment", {
  repairStatus: types.maybe(RepairStatusEnum),
  amountToRepair: types.optional(types.string, ""),
})