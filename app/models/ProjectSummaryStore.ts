import { Instance, SnapshotOut, types, destroy } from "mobx-state-tree"

export const PersonnelInterviewedModel = types
.model("PersonnelInterviewed")
.props({
    id: types.identifier,
    name: types.string,
    title: types.string,
    yearsAtProperty: types.optional(types.number, 0),
    phoneNumber: types.optional(types.string, ""),
})

export const CommercialTenantModel = types
.model("CommercialTenant")
.props({
    id: types.identifier,
    name: types.string,
    addressOrUnit: types.string,
    accessed: types.optional(types.boolean, false),
})

// Problematic materials are stored as a map keyed by id with provided/comments values



export const ProjectSummaryStore = types
.model("ProjectSummaryStore")
.props({
    //step 1
    projectName: types.optional(types.string, ""),
    projectNumber: types.optional(types.string, ""),
    propertyAddress: types.optional(types.string, ""),
    propertyCity: types.optional(types.string, ""),
    propertyState: types.optional(types.string, ""),
    propertyZip: types.optional(types.string, ""),
    weather: types.optional(types.string, ""),
    temperature: types.optional(types.number, 0),
    inspectionDate: types.optional(types.Date, () => new Date()),
    inspectionTime: types.optional(types.string, ""),
    inspectorName: types.optional(types.string, ""),
    inspectorNumber: types.optional(types.string, ""),
    surroundingProperties: types.optional(types.string, ""),
    currentStep: types.optional(types.number, 1),
    lastModified: types.optional(types.Date, () => new Date()),

    //step 2
    acreage: types.optional(types.number, 0),
    numberSignDown: types.optional(types.number, 0),
    yearRenovated: types.optional(types.number, 0),
    numberOfBuildings: types.optional(types.number, 0),
    netSqFt: types.optional(types.number, 0),
    numberOfUnits: types.optional(types.number, 0),
    GSF: types.optional(types.number, 0),
    numberOfVacantUnits: types.optional(types.number, 0),
    yearBuilt: types.optional(types.number, 0),
    leaseType: types.optional(types.string, ""),
    recentCapitalImprovements: types.optional(types.string, ""),

    //step 3
    // Persist only user selection state: document id -> provided
    documents: types.optional(types.map(types.boolean), {}),
    personnelInterviewed: types.optional(types.array(PersonnelInterviewedModel), []),
    commercialTenants: types.optional(types.array(CommercialTenantModel), []),
    
    //step 4
    // Persist only user state per material id
    problematicMaterials: types.optional(
        types.map(
            types.model({
                provided: types.optional(types.boolean, false),
                comments: types.optional(types.string, ""),
            }),
        ),
        {},
    ),
    domesticWater: types.optional(types.string, ""),
    domesticSewage: types.optional(types.string, ""),
    stormWaterDrainage: types.optional(types.string, ""),
    electricity: types.optional(types.string, ""),
    naturalGas: types.optional(types.string, ""),
    heatingOil: types.optional(types.string, ""),
    propane: types.optional(types.string, ""),
    wellSystem: types.optional(types.string, ""),
    septicSystem: types.optional(types.string, ""),
    wastewaterTreatmentPlant: types.optional(types.string, ""),

})
.actions(self => {
    return ({
        updateDocumentChecklist: (id: string, provided: boolean) => {
            self.documents.set(id, provided)
            self.lastModified = new Date()
        },

        addPersonnel(name: string, title: string, yearsAtProperty: number, phoneNumber: string) {
            const id = `personnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            self.personnelInterviewed.push({
                id,
                name: name,
                title: title,
                yearsAtProperty: yearsAtProperty,
                phoneNumber: phoneNumber,
            })
            self.lastModified = new Date()
            return id
        },
        removePersonnel(id: string) {
            const personnel = self.personnelInterviewed.find(personnel => personnel.id === id)
            if (personnel) {
                destroy(personnel)
                self.lastModified = new Date()
            }
        },
        addCommercialTenant(name: string, addressOrUnit: string, accessed: boolean) {
            const id = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            self.commercialTenants.push({
                id,
                name: name,
                addressOrUnit: addressOrUnit,
                accessed: accessed,
            })
            self.lastModified = new Date()
            return id
        },
        removeCommercialTenant(id: string) {
            const tenant = self.commercialTenants.find(tenant => tenant.id === id)
            if (tenant) {
                destroy(tenant)
                self.lastModified = new Date()
            }
        },
        updateProblematicMaterial: (id: string, provided: boolean, comments: string) => {
            const current = self.problematicMaterials.get(id)
            if (current) {
                self.problematicMaterials.set(id, { provided, comments })
            } else {
                self.problematicMaterials.set(id, { provided, comments })
            }
            self.lastModified = new Date()
        },
        updateStep1: (data: Partial<{ projectName: string; projectNumber: string; propertyAddress: string; propertyCity: string; propertyState: string; propertyZip: string; weather: string; temperature: number; inspectionDate: Date; inspectionTime: string; inspectorName: string; inspectorNumber: string; surroundingProperties: string }>) => {
            Object.assign(self, data)
            self.lastModified = new Date()
        },
        updateStep2: (data: Partial<{ acreage: number; numberSignDown: number; yearRenovated: number; numberOfBuildings: number; netSqFt: number; numberOfUnits: number; GSF: number; numberOfVacantUnits: number; yearBuilt: number; leaseType: string; recentCapitalImprovements: string }>) => {
            Object.assign(self, data)
            self.lastModified = new Date()
        },
        updateStep4Utilities: (data: Partial<{ domesticWater: string; domesticSewage: string; stormWaterDrainage: string; electricity: string; naturalGas: string; heatingOil: string; propane: string; wellSystem: string; septicSystem: string; wastewaterTreatmentPlant: string }>) => {
            Object.assign(self, data)
            self.lastModified = new Date()
        },
        updatePersonnel: (id: string, data: Partial<{ name: string; title: string; yearsAtProperty: number; phoneNumber: string }>) => {
            const personnel = self.personnelInterviewed.find(p => p.id === id)
            if (personnel) {
                Object.assign(personnel, data)
                self.lastModified = new Date()
            }
        },
        updateCommercialTenant: (id: string, data: Partial<{ name: string; addressOrUnit: string; accessed: boolean }>) => {
            const tenant = self.commercialTenants.find(t => t.id === id)
            if (tenant) {
                Object.assign(tenant, data)
                self.lastModified = new Date()
            }
        },
        clearForm: () => {
            self.projectName = ""
            self.projectNumber = ""
            self.propertyAddress = ""
            self.propertyCity = ""
            self.propertyState = ""
            self.propertyZip = ""
            self.weather = ""
            self.temperature = 0
            self.inspectionDate = new Date()
            self.inspectionTime = ""
            self.inspectorName = ""
            self.inspectorNumber = ""
            self.surroundingProperties = ""

            self.acreage = 0
            self.numberSignDown = 0
            self.yearRenovated = 0
            self.numberOfBuildings = 0
            self.netSqFt = 0
            self.numberOfUnits = 0
            self.GSF = 0
            self.numberOfVacantUnits = 0
            self.yearBuilt = 0
            self.leaseType = ""
            self.recentCapitalImprovements = ""

            self.documents.clear()
            self.personnelInterviewed.clear()
            self.commercialTenants.clear()
            self.problematicMaterials.clear()

            self.domesticWater = ""
            self.domesticSewage = ""
            self.stormWaterDrainage = ""
            self.electricity = ""
            self.naturalGas = ""
            self.heatingOil = ""
            self.propane = ""
            self.wellSystem = ""
            self.septicSystem = ""
            self.wastewaterTreatmentPlant = ""
            self.currentStep = 1
            self.lastModified = new Date()
        },
    })
})

export interface ProjectSummaryStore extends Instance<typeof ProjectSummaryStore> {}
export interface PersonnelInterviewed extends Instance<typeof PersonnelInterviewedModel> {}
export interface CommercialTenant extends Instance<typeof CommercialTenantModel> {}