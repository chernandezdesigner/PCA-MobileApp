import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const SignageAccordionModel = types.model("SignageAccordionModel", {
    signageType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { signageType?: string; assessment?: Record<string, any> }) {
        if (data.signageType !== undefined) self.signageType = data.signageType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const LotLightingAccordionModel = types.model("LotLightingAccordionModel", {
    lotLightingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),    
    })
    .actions((self) => ({
        update(data: { lotLightingType?: string; assessment?: Record<string, any> }) {
        if (data.lotLightingType !== undefined) self.lotLightingType = data.lotLightingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BldgLightingAccordionModel = types.model("BldgLightingAccordionModel", {
    bldgLightingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { bldgLightingType?: string; assessment?: Record<string, any> }) {
        if (data.bldgLightingType !== undefined) self.bldgLightingType = data.bldgLightingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SiteFencingAccordionModel = types.model("SiteFencingAccordionModel", {
    siteFencingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { siteFencingType?: string; assessment?: Record<string, any> }) {
        if (data.siteFencingType !== undefined) self.siteFencingType = data.siteFencingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const DumpsterAccordionModel = types.model("DumpsterAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    enclosureType: types.optional(types.string, ""),
    gateType: types.optional(types.string, ""),
    otherType: types.optional(types.string, ""),
    location: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; enclosureType?: string; gateType?: string; otherType?: string; location?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.enclosureType !== undefined) self.enclosureType = data.enclosureType
        if (data.gateType !== undefined) self.gateType = data.gateType
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.location !== undefined) self.location = data.location
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RecreationalFacilitiesAccordionModel = types.model("RecreationalFacilitiesAccordionModel", {
    recreationalFacilitiesType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { recreationalFacilitiesType?: string; assessment?: Record<string, any> }) {
        if (data.recreationalFacilitiesType !== undefined) self.recreationalFacilitiesType = data.recreationalFacilitiesType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const CompactorsAccordionModel = types.model("CompactorsAccordionModel", {
    compactorsType: types.optional(types.string, ""),
    location: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { compactorsType?: string; location?: string; assessment?: Record<string, any> }) {
        if (data.compactorsType !== undefined) self.compactorsType = data.compactorsType
        if (data.location !== undefined) self.location = data.location
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BridgesAccordionModel = types.model("BridgesAccordionModel", {
    bridgesType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a single nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForBridgesModel)),
    })
    .actions((self) => ({
        update(data: { bridgesType?: string; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.bridgesType !== undefined) self.bridgesType = data.bridgesType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

export const railingForBridgesModel = types.model("railingForBridgesModel", {
    railingType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { railingType?: string; assessment?: Record<string, any> }) {
        if (data.railingType !== undefined) self.railingType = data.railingType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SiteGroundsStep3 = types
.model("SiteGroundsStep3", {
    signage: types.optional(SignageAccordionModel, {}),
    lotLighting: types.optional(LotLightingAccordionModel, {}),
    bldgLighting: types.optional(BldgLightingAccordionModel, {}),
    siteFencing: types.optional(SiteFencingAccordionModel, {}),
    dumpster: types.optional(DumpsterAccordionModel, {}),
    recreationalFacilities: types.optional(RecreationalFacilitiesAccordionModel, {}),
    compactors: types.optional(CompactorsAccordionModel, {}),
    bridges: types.optional(BridgesAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateSignage(data: Parameters<typeof self.signage.update>[0]) {
        self.signage.update(data)
        self.lastModified = new Date()
    },
    updateLotLighting(data: Parameters<typeof self.lotLighting.update>[0]) {
        self.lotLighting.update(data)
        self.lastModified = new Date()
    },
    updateBldgLighting(data: Parameters<typeof self.bldgLighting.update>[0]) {
        self.bldgLighting.update(data)
        self.lastModified = new Date()
    },
    updateSiteFencing(data: Parameters<typeof self.siteFencing.update>[0]) {
        self.siteFencing.update(data)
        self.lastModified = new Date()
    },
    updateDumpster(data: Parameters<typeof self.dumpster.update>[0]) {
        self.dumpster.update(data)
        self.lastModified = new Date()
    },
    updateRecreationalFacilities(data: Parameters<typeof self.recreationalFacilities.update>[0]) {
        self.recreationalFacilities.update(data)
        self.lastModified = new Date()
    },
    updateCompactors(data: Parameters<typeof self.compactors.update>[0]) {
        self.compactors.update(data)
        self.lastModified = new Date()
    },
    updateBridges(data: Parameters<typeof self.bridges.update>[0]) {
        self.bridges.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data 
        self.lastModified = new Date()
    },
}))