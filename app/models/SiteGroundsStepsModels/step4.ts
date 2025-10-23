import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const CarportsAccordionModel = types.model("CarportsAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const MaintenanceBldgAccordionModel = types.model("MaintenanceBldgAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const FirePumpBldgAccordionModel = types.model("FirePumpBldgAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ResidentialGaragesAccordionModel = types.model("ResidentialGaragesAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GazeboPavilionAccordionModel = types.model("GazeboPavilionAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GreenhousesAccordionModel = types.model("GreenhousesAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const LaundryBldgAccordionModel = types.model("LaundryBldgAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const WellPumpHouseAccordionModel = types.model("WellPumpHouseAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SewerPumpHouseAccordionModel = types.model("SewerPumpHouseAccordionModel", {
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))


export const TenantResponsibilityChecklistModel = types.model("TenantResponsibilityChecklistModel", {
    tenantResponsibilityChecklist: types.optional(types.map(types.boolean), {}),
    })
    .actions((self) => ({
        update(data: { tenantResponsibilityChecklist?: Record<string, any> }) {
        if (data.tenantResponsibilityChecklist !== undefined) self.tenantResponsibilityChecklist = data.tenantResponsibilityChecklist
    },
}))

export const OtherStructureAccordionModel = types
.model("OtherStructureAccordionModel")
.props({
    id: types.identifier,
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SiteGroundsStep4 = types.model("SiteGroundsStep4", {
    carports: types.optional(CarportsAccordionModel, {}),
    maintenanceBldg: types.optional(MaintenanceBldgAccordionModel, {}),
    firePumpBldg: types.optional(FirePumpBldgAccordionModel, {}),
    residentialGarages: types.optional(ResidentialGaragesAccordionModel, {}),
    gazeboPavilion: types.optional(GazeboPavilionAccordionModel, {}),
    greenhouses: types.optional(GreenhousesAccordionModel, {}),
    laundryBldg: types.optional(LaundryBldgAccordionModel, {}),
    wellPumpHouse: types.optional(WellPumpHouseAccordionModel, {}),
    sewerPumpHouse: types.optional(SewerPumpHouseAccordionModel, {}),
    tenantResponsibilityChecklist: types.optional(TenantResponsibilityChecklistModel, {}),
    otherStructure: types.optional(OtherStructureAccordionModel, {}),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateCarports(data: Parameters<typeof self.carports.update>[0]) {
        self.carports.update(data)
        self.lastModified = new Date()
    },
    updateMaintenanceBldg(data: Parameters<typeof self.maintenanceBldg.update>[0]) {
        self.maintenanceBldg.update(data)
        self.lastModified = new Date()
    },
    updateFirePumpBldg(data: Parameters<typeof self.firePumpBldg.update>[0]) {
        self.firePumpBldg.update(data)
        self.lastModified = new Date()
    },
    updateResidentialGarages(data: Parameters<typeof self.residentialGarages.update>[0]) {
        self.residentialGarages.update(data)
        self.lastModified = new Date()
    },
    updateGazeboPavilion(data: Parameters<typeof self.gazeboPavilion.update>[0]) {
        self.gazeboPavilion.update(data)
        self.lastModified = new Date()
    },
    updateGreenhouses(data: Parameters<typeof self.greenhouses.update>[0]) {
        self.greenhouses.update(data)
        self.lastModified = new Date()
    },
    updateLaundryBldg(data: Parameters<typeof self.laundryBldg.update>[0]) {
        self.laundryBldg.update(data)
        self.lastModified = new Date()
    },
    updateWellPumpHouse(data: Parameters<typeof self.wellPumpHouse.update>[0]) {
        self.wellPumpHouse.update(data)
        self.lastModified = new Date()
    },
    updateSewerPumpHouse(data: Parameters<typeof self.sewerPumpHouse.update>[0]) {
        self.sewerPumpHouse.update(data)
        self.lastModified = new Date()
    },
    updateTenantResponsibilityChecklist(data: Parameters<typeof self.tenantResponsibilityChecklist.update>[0]) {
        self.tenantResponsibilityChecklist.update(data)
        self.lastModified = new Date()
    },
    updateOtherStructure(data: Parameters<typeof self.otherStructure.update>[0]) {
        self.otherStructure.update(data)
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data 
        self.lastModified = new Date()
    },
}))