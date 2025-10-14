import { Instance, SnapshotOut, types, destroy } from "mobx-state-tree"


export const DocumentChecklistModel = types
.model("DocumentChecklistItem")
.props({
    type: types.identifier,
    label: types.string,
    provided: types.optional(types.boolean, false),
})

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

export const ProblematicMaterialsModel = types
.model("ProblematicMaterials")
.props({
    id: types.identifier,
    name: types.string,
    provided: types.optional(types.boolean, false),
    comments: types.optional(types.string, ""),
})



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
    otherStructures: types.optional(types.string, ""),
    numberOfUnits: types.optional(types.number, 0),
    GSF: types.optional(types.number, 0),
    numberOfVacantUnits: types.optional(types.number, 0),
    yearBuilt: types.optional(types.number, 0),
    leaseType: types.optional(types.string, ""),
    recentCapitalImprovements: types.optional(types.string, ""),

    //step 3
    documents: types.optional(types.array(DocumentChecklistModel), []),
    personnelInterviewed: types.optional(types.array(PersonnelInterviewedModel), []),
    commercialTenants: types.optional(types.array(CommercialTenantModel), []),
    
    //step 4
    problematicMaterials: types.optional(types.array(ProblematicMaterialsModel), []),
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
    const initializeDocumentsChecklist = () => {
        const defaultDocuments = [
            { type: "ADASurvey", label: "ADA Survey", provided: false },
            { type: "ALTASurvey", label: "ALTA Survey", provided: false },
            { type: "CapExPlan", label: "CapEx Plan", provided: false },
            { type: "CapExHistory", label: "CapEx History", provided: false },
            { type: "SitePlansSurveys", label: "Site Plans / Surveys", provided: false },
            { type: "BuildingPlans", label: "Building Plans", provided: false },
            { type: "FloorPlans", label: "Floor Plans", provided: false },
            { type: "RoofWarranty", label: "Roof Warranty", provided: false },
            { type: "Warranties", label: "Warranties", provided: false },
            { type: "CertificateOfOccupancy", label: "Certificate of Occupancy", provided: false },
            { type: "MarketingBrochure", label: "Marketing Brochure", provided: false },
            { type: "EquipmentInventory", label: "Equipment Inventory", provided: false },
            { type: "FireDepartmentInspection", label: "Fire Department Inspection", provided: false },
            { type: "FireAlarmInspection", label: "Fire Alarm Inspection", provided: false },
            { type: "FireSprinklerInspection", label: "Fire Sprinkler Inspection", provided: false },
            { type: "ElevatorCertificates", label: "Elevator Certificates", provided: false },
            { type: "BoilerPermits", label: "Boiler Permits", provided: false },
            { type: "OccupancySummary", label: "Occupancy Summary", provided: false },
            { type: "PendingRepairProposals", label: "Pending Repair Proposals", provided: false },
            { type: "PreviousPCAReports", label: "Previous PCA Reports", provided: false },
            { type: "RentRollTenantList", label: "Rent Roll / Tenant List", provided: false },
            { type: "UnitTypeAndQuantityList", label: "Unit Type and Quantity List", provided: false },
            { type: "VendorList", label: "Vendor List", provided: false },
            { type: "HealthcareInspection", label: "Healthcare Inspection", provided: false },
            { type: "Other", label: "Other", provided: false },
        ]
        defaultDocuments.forEach(document => {
            self.documents.push(document)
        })
    }

    const initializeProblematicMaterials = () => {
        const defaultProblematicMaterials = [
            { id: "frtPlywood", name: "FRT Plywood", provided: false, comments: "" },
            { id: "compositeWoodSiding", name: "Composite Wood Siding", provided: false, comments: "" },
            { id: "eifs", name: "EIFS", provided: false, comments: "" },
            { id: "chineseDrywall", name: "Chinese Drywall", provided: false, comments: "" },
            { id: "lessThan60AMPElectricService", name: "Less than 60 AMP Electric Service", provided: false, comments: "" },
            { id: "aluminumBranchWiring", name: "Aluminum Branch Wiring", provided: false, comments: "" },
            { id: "fusedElectricalSubpanels", name: "Fused Electrical sub-panels", provided: false, comments: "" },
            { id: "recalledBreakerPanels", name: "Recalled Breaker Panels", provided: false, comments: "" },
            { id: "polybutyleneWaterPiping", name: "Polybutylene Water Piping", provided: false, comments: "" },
            { id: "galvanizedSteelWaterPiping", name: "Galvanized Steel Water Piping", provided: false, comments: "" },
            { id: "leadPipingFittings", name: "Lead Piping / Fittings", provided: false, comments: "" },
            { id: "absSanitarySewerLines", name: "ABS Sanitary Sewer Lines", provided: false, comments: "" },
            { id: "recalledFireSprinkelerHeads", name: "Recalled Fire Sprinkeler Heads", provided: false, comments: "" },
            { id: "recalledInWallElectricHeaters", name: "Recalled In-wall Electric Heaters", provided: false, comments: "" },
        ]
        defaultProblematicMaterials.forEach(material => {
            self.problematicMaterials.push(material)
        })
    }

    return ({
        afterCreate: () => {
            if (self.documents.length === 0) {
                initializeDocumentsChecklist()
            }
            if (self.problematicMaterials.length === 0) {
                initializeProblematicMaterials()
            }
        },
        initializeDocumentsChecklist,
        updateDocumentChecklist: (type: string, provided: boolean) => {
            const document = self.documents.find(document => document.type === type)
            if (document) {
                document.provided = provided
                self.lastModified = new Date()
            }
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
        initializeProblematicMaterials,
        updateProblematicMaterial: (id: string, provided: boolean, comments: string) => {
            const material = self.problematicMaterials.find(material => material.id === id)
            if (material) {
                material.provided = provided
                material.comments = comments
                self.lastModified = new Date()
            }
        },
        updateStep1: (data: Partial<{ projectName: string; projectNumber: string; propertyAddress: string; propertyCity: string; propertyState: string; propertyZip: string; weather: string; temperature: number; inspectorName: string; inspectorNumber: string; surroundingProperties: string }>) => {
            Object.assign(self, data)
            self.lastModified = new Date()
        },
        updateStep2: (data: Partial<{ acreage: number; numberSignDown: number; yearRenovated: number; numberOfBuildings: number; netSqFt: number; otherStructures: string; numberOfUnits: number; GSF: number; numberOfVacantUnits: number; yearBuilt: number; leaseType: string; recentCapitalImprovements: string }>) => {
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
            self.inspectorName = ""
            self.inspectorNumber = ""
            self.surroundingProperties = ""

            self.acreage = 0
            self.numberSignDown = 0
            self.yearRenovated = 0
            self.numberOfBuildings = 0
            self.netSqFt = 0
            self.otherStructures = ""
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

            initializeDocumentsChecklist()
            initializeProblematicMaterials()
            self.currentStep = 1
            self.lastModified = new Date()
        },
    })
})

export interface ProjectSummaryStore extends Instance<typeof ProjectSummaryStore> {}
export interface DocumentChecklistItem extends Instance<typeof DocumentChecklistModel> {}
export interface PersonnelInterviewed extends Instance<typeof PersonnelInterviewedModel> {}
export interface CommercialTenant extends Instance<typeof CommercialTenantModel> {}
export interface ProblematicMaterials extends Instance<typeof ProblematicMaterialsModel> {}