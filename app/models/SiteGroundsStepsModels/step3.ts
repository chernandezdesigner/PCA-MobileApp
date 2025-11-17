import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const SignageAccordionModel = types.model("SignageAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    signageTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; signageTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.signageTypes !== undefined) self.signageTypes.replace(data.signageTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const LotLightingAccordionModel = types.model("LotLightingAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    lotLightingTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),    
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; lotLightingTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.lotLightingTypes !== undefined) self.lotLightingTypes.replace(data.lotLightingTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BldgLightingAccordionModel = types.model("BldgLightingAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    bldgLightingTypes: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; bldgLightingTypes?: string[]; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.bldgLightingTypes !== undefined) self.bldgLightingTypes.replace(data.bldgLightingTypes)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SiteFencingAccordionModel = types.model("SiteFencingAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    siteFencingMaterials: types.optional(types.array(types.string), []),
    otherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; siteFencingMaterials?: string[]; otherType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.siteFencingMaterials !== undefined) self.siteFencingMaterials.replace(data.siteFencingMaterials)
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const DumpsterAccordionModel = types.model("DumpsterAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    enclosureMaterials: types.optional(types.array(types.string), []),
    gateMaterials: types.optional(types.array(types.string), []),
    otherType: types.optional(types.string, ""),
    location: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; enclosureMaterials?: string[]; gateMaterials?: string[]; otherType?: string; location?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.enclosureMaterials !== undefined) self.enclosureMaterials.replace(data.enclosureMaterials)
        if (data.gateMaterials !== undefined) self.gateMaterials.replace(data.gateMaterials)
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.location !== undefined) self.location = data.location
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const RecreationalFacilitiesAccordionModel = types.model("RecreationalFacilitiesAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    recreationalFacilities: types.optional(types.array(types.string), []),
    otherType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; recreationalFacilities?: string[]; otherType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.recreationalFacilities !== undefined) self.recreationalFacilities.replace(data.recreationalFacilities)
        if (data.otherType !== undefined) self.otherType = data.otherType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const CompactorsAccordionModel = types.model("CompactorsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    tenantOwned: types.optional(types.enumeration("tenantOwned", ["yes", "no"]), "no"),
    location: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; tenantOwned?: "yes" | "no"; location?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.tenantOwned !== undefined) self.tenantOwned = data.tenantOwned
        if (data.location !== undefined) self.location = data.location
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const BridgesAccordionModel = types.model("BridgesAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    bridgeMaterials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    railing: types.optional(types.enumeration("railing", ["yes", "no"]), "no"),
    // When railing is "yes", we render a single nested assessment block for railings
    railingDetails: types.maybe(types.late(() => railingForBridgesModel)),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; bridgeMaterials?: string[]; assessment?: Record<string, any>; railing?: "yes" | "no"; railingDetails?: any }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.bridgeMaterials !== undefined) self.bridgeMaterials.replace(data.bridgeMaterials)
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
        if (data.railing !== undefined) self.railing = data.railing
        if (data.railingDetails !== undefined) (self as any).railingDetails = data.railingDetails as any
    },
}))

export const railingForBridgesModel = types.model("railingForBridgesModel", {
    railingMaterials: types.optional(types.array(types.string), []),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { railingMaterials?: string[]; assessment?: Record<string, any> }) {
        if (data.railingMaterials !== undefined) self.railingMaterials.replace(data.railingMaterials)
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