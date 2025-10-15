// app/models/SharedModels.ts
import { types } from "mobx-state-tree"

export const ConditionEnum = types.enumeration("ConditionEnum", ["good", "fair", "poor"])
export const RepairStatusEnum = types.enumeration("RepairStatusEnum", ["IR", "ST", "RR", "RM", "INV", "NA"])

export const ConditionAssessment = types.model("ConditionAssessment", {
  condition: types.optional(ConditionEnum, "good"),
  repairStatus: types.optional(RepairStatusEnum, "IR"),
  amountToRepair: types.optional(types.string, ""),
})