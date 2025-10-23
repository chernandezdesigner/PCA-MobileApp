import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const CarportsAccordionModel = types.model("CarportsAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const MaintenanceBldgAccordionModel = types.model("MaintenanceBldgAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const FirePumpBldgAccordionModel = types.model("FirePumpBldgAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const ResidentialGaragesAccordionModel = types.model("ResidentialGaragesAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GazeboPavilionAccordionModel = types.model("GazeboPavilionAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const GreenhousesAccordionModel = types.model("GreenhousesAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const LaundryBldgAccordionModel = types.model("LaundryBldgAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const WellPumpHouseAccordionModel = types.model("WellPumpHouseAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SewerPumpHouseAccordionModel = types.model("SewerPumpHouseAccordionModel", {
    NotApplicable: types.optional(types.boolean, false),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { NotApplicable?: boolean; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))


export const TenantResponsibilityChecklistModel = types.model("TenantResponsibilityChecklistModel", {
    tenantResponsibilityChecklist: types.optional(types.map(types.boolean), {}),
    })
    .actions((self) => ({
        update(data: { tenantResponsibilityChecklist?: Record<string, boolean> }) {
        if (data.tenantResponsibilityChecklist !== undefined) {
            self.tenantResponsibilityChecklist.clear()
            Object.entries(data.tenantResponsibilityChecklist).forEach(([key, value]) => {
                self.tenantResponsibilityChecklist.set(key, value)
            })
        }
    },
}))

export const OtherStructureAccordionModel = types
.model("OtherStructureAccordionModel")
.props({
    id: types.identifier,
    name: types.optional(types.string, ""),
    GeneralConstruction: types.optional(types.string, ""),
    RoofType: types.optional(types.string, ""),
    assessment: types.optional(ConditionAssessment, {}),
    })
    .actions((self) => ({
        update(data: { name?: string; GeneralConstruction?: string; RoofType?: string; assessment?: Record<string, any> }) {
        if (data.name !== undefined) self.name = data.name
        if (data.GeneralConstruction !== undefined) self.GeneralConstruction = data.GeneralConstruction
        if (data.RoofType !== undefined) self.RoofType = data.RoofType
        if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
}))

export const SiteGroundsStep4 = types.model("SiteGroundsStep4", {
    stepNotApplicable: types.optional(types.boolean, false),
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
    otherStructure: types.maybe(OtherStructureAccordionModel),
    comments: types.optional(types.string, ""),
    lastModified: types.optional(types.Date, () => new Date()),
})
.actions((self) => ({
    touch() {
        self.lastModified = new Date()
    },
    updateStepNotApplicable(data: boolean) {
        self.stepNotApplicable = data
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
    updateOtherStructure(data: any) {
        if (self.otherStructure) {
            self.otherStructure.update(data)
        }
        self.lastModified = new Date()
    },
    updateComments(data: string) {
        self.comments = data 
        self.lastModified = new Date()
    },
}))