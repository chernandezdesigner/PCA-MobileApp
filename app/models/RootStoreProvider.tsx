import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react"
import { onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreInstance, RootStoreSnapshot } from "./RootStore"
import * as storage from "@/utils/storage"
import throttle from "lodash.throttle"

const STORE_KEY = "rootStore.v1"

const RootStoreContext = createContext<RootStoreInstance | null>(null)

export const RootStoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const storeRef = useRef<RootStoreInstance | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const snapshot = storage.load<RootStoreSnapshot>(STORE_KEY)
    const migrated = migrateSnapshot(snapshot)
    storeRef.current = RootStore.create(migrated ?? {})

    const saveThrottled = throttle((snap: RootStoreSnapshot) => storage.save(STORE_KEY, snap), 750, { leading: true, trailing: true })
    const disposer = onSnapshot(storeRef.current, (snap) => {
      saveThrottled(snap)
    })

    setIsHydrated(true)
    return () => {
      disposer()
    }
  }, [])

  const value = useMemo<RootStoreInstance | null>(() => storeRef.current, [isHydrated])

  if (!isHydrated || !value) return null

  return <RootStoreContext.Provider value={value}>{children}</RootStoreContext.Provider>
}

export const useStores = () => {
  const context = useContext(RootStoreContext)
  if (!context) throw new Error("useStores must be used within a RootStoreProvider")
  return context
}


function migrateSnapshot(snapshot?: RootStoreSnapshot | null): RootStoreSnapshot | undefined {
  if (!snapshot) return undefined
  const copy: any = JSON.parse(JSON.stringify(snapshot))
  const assessments = copy.assessments
  if (assessments && typeof assessments === "object") {
    Object.values(assessments).forEach((a: any) => {
      const ps = a?.projectSummary
      if (!ps) return
      // documents: array -> map<string, boolean>
      if (Array.isArray(ps.documents)) {
        const mapObj: Record<string, boolean> = {}
        ps.documents.forEach((d: any) => {
          const id = d?.type || d?.id
          if (id) mapObj[id] = !!d?.provided
        })
        ps.documents = mapObj
      }
      // materials: array -> map<string, { provided, comments }>
      if (Array.isArray(ps.problematicMaterials)) {
        const mapObj: Record<string, { provided: boolean; comments: string }> = {}
        ps.problematicMaterials.forEach((m: any) => {
          const id = m?.id
          if (id) mapObj[id] = { provided: !!m?.provided, comments: m?.comments ?? "" }
        })
        ps.problematicMaterials = mapObj
      }
      
      // Migrate Site Grounds Step 1: surfaceTo string -> array
      const sg1 = a?.siteGrounds?.step1
      if (sg1) {
        // Convert surfaceTo from string to array
        if (typeof sg1.surfaceTo === "string") {
          sg1.surfaceTo = sg1.surfaceTo ? [sg1.surfaceTo] : []
        }
        // Convert old checklist map to drainageFeatures array
        if (sg1.checklist && typeof sg1.checklist === "object") {
          const features: string[] = []
          Object.entries(sg1.checklist).forEach(([key, value]: [string, any]) => {
            if (value?.checked) {
              features.push(key)
            }
          })
          sg1.drainageFeatures = features
          delete sg1.checklist
        }
      }
      
      // Migrate Site Grounds Step 2: string fields -> arrays
      const sg2 = a?.siteGrounds?.step2
      if (sg2) {
        // Topography Slope
        if (sg2.topographySlope && typeof sg2.topographySlope.slopeType === "string") {
          sg2.topographySlope.topographySlopes = sg2.topographySlope.slopeType ? [sg2.topographySlope.slopeType] : []
          delete sg2.topographySlope.slopeType
        }
        
        // Landscaping
        if (sg2.landscaping && typeof sg2.landscaping.landscapingType === "string") {
          sg2.landscaping.landscaping = sg2.landscaping.landscapingType ? [sg2.landscaping.landscapingType] : []
          delete sg2.landscaping.landscapingType
        }
        
        // Retaining Walls
        if (sg2.retainingWalls && typeof sg2.retainingWalls.retainingWallsType === "string") {
          sg2.retainingWalls.retainingWallMaterials = sg2.retainingWalls.retainingWallsType ? [sg2.retainingWalls.retainingWallsType] : []
          delete sg2.retainingWalls.retainingWallsType
        }
        if (sg2.retainingWalls?.railingDetails && typeof sg2.retainingWalls.railingDetails.railingType === "string") {
          sg2.retainingWalls.railingDetails.railingMaterials = sg2.retainingWalls.railingDetails.railingType ? [sg2.retainingWalls.railingDetails.railingType] : []
          delete sg2.retainingWalls.railingDetails.railingType
        }
        
        // Screen Walls
        if (sg2.screenWalls && typeof sg2.screenWalls.screenWallsType === "string") {
          sg2.screenWalls.screenWallMaterials = sg2.screenWalls.screenWallsType ? [sg2.screenWalls.screenWallsType] : []
          delete sg2.screenWalls.screenWallsType
        }
        if (sg2.screenWalls?.railingDetails && typeof sg2.screenWalls.railingDetails.railingType === "string") {
          sg2.screenWalls.railingDetails.railingMaterials = sg2.screenWalls.railingDetails.railingType ? [sg2.screenWalls.railingDetails.railingType] : []
          delete sg2.screenWalls.railingDetails.railingType
        }
        
        // Water Features
        if (sg2.waterFeatures && typeof sg2.waterFeatures.waterFeaturesType === "string") {
          sg2.waterFeatures.waterFeatures = sg2.waterFeatures.waterFeaturesType ? [sg2.waterFeatures.waterFeaturesType] : []
          delete sg2.waterFeatures.waterFeaturesType
        }
        if (sg2.waterFeatures && typeof sg2.waterFeatures.pumpLocation === "string") {
          sg2.waterFeatures.pumpLocations = sg2.waterFeatures.pumpLocation ? [sg2.waterFeatures.pumpLocation] : []
          delete sg2.waterFeatures.pumpLocation
        }
      }
      
      // Migrate Site Grounds Step 3: string fields -> arrays
      const sg3 = a?.siteGrounds?.step3
      if (sg3) {
        // Signage
        if (sg3.signage && typeof sg3.signage.signageType === "string") {
          sg3.signage.signageTypes = sg3.signage.signageType ? [sg3.signage.signageType] : []
          delete sg3.signage.signageType
        }
        
        // Lot Lighting
        if (sg3.lotLighting && typeof sg3.lotLighting.lotLightingType === "string") {
          sg3.lotLighting.lotLightingTypes = sg3.lotLighting.lotLightingType ? [sg3.lotLighting.lotLightingType] : []
          delete sg3.lotLighting.lotLightingType
        }
        
        // Building Lighting
        if (sg3.bldgLighting && typeof sg3.bldgLighting.bldgLightingType === "string") {
          sg3.bldgLighting.bldgLightingTypes = sg3.bldgLighting.bldgLightingType ? [sg3.bldgLighting.bldgLightingType] : []
          delete sg3.bldgLighting.bldgLightingType
        }
        
        // Site Fencing
        if (sg3.siteFencing && typeof sg3.siteFencing.siteFencingType === "string") {
          sg3.siteFencing.siteFencingMaterials = sg3.siteFencing.siteFencingType ? [sg3.siteFencing.siteFencingType] : []
          delete sg3.siteFencing.siteFencingType
        }
        
        // Dumpster
        if (sg3.dumpster && typeof sg3.dumpster.enclosureType === "string") {
          sg3.dumpster.enclosureMaterials = sg3.dumpster.enclosureType ? [sg3.dumpster.enclosureType] : []
          delete sg3.dumpster.enclosureType
        }
        if (sg3.dumpster && typeof sg3.dumpster.gateType === "string") {
          sg3.dumpster.gateMaterials = sg3.dumpster.gateType ? [sg3.dumpster.gateType] : []
          delete sg3.dumpster.gateType
        }
        
        // Recreational Facilities
        if (sg3.recreationalFacilities && typeof sg3.recreationalFacilities.recreationalFacilitiesType === "string") {
          sg3.recreationalFacilities.recreationalFacilities = sg3.recreationalFacilities.recreationalFacilitiesType ? [sg3.recreationalFacilities.recreationalFacilitiesType] : []
          delete sg3.recreationalFacilities.recreationalFacilitiesType
        }
        
        // Bridges
        if (sg3.bridges && typeof sg3.bridges.bridgesType === "string") {
          sg3.bridges.bridgeMaterials = sg3.bridges.bridgesType ? [sg3.bridges.bridgesType] : []
          delete sg3.bridges.bridgesType
        }
        if (sg3.bridges?.railingDetails && typeof sg3.bridges.railingDetails.railingType === "string") {
          sg3.bridges.railingDetails.railingMaterials = sg3.bridges.railingDetails.railingType ? [sg3.bridges.railingDetails.railingType] : []
          delete sg3.bridges.railingDetails.railingType
        }
      }
      
      // Migrate Site Grounds Step 4: GeneralConstruction string -> array for all structures
      const sg4 = a?.siteGrounds?.step4
      if (sg4) {
        const structures = [
          'carports', 'maintenanceBldg', 'firePumpBldg', 'residentialGarages',
          'gazeboPavilion', 'greenhouses', 'laundryBldg', 'wellPumpHouse', 'sewerPumpHouse'
        ]
        structures.forEach(key => {
          const structure = sg4[key]
          if (structure && typeof structure.GeneralConstruction === "string") {
            structure.GeneralConstruction = structure.GeneralConstruction ? [structure.GeneralConstruction] : []
          }
        })
        // Also handle otherStructure if it exists
        if (sg4.otherStructure && typeof sg4.otherStructure.GeneralConstruction === "string") {
          sg4.otherStructure.GeneralConstruction = sg4.otherStructure.GeneralConstruction ? [sg4.otherStructure.GeneralConstruction] : []
        }
      }
    })
  }
  return copy as RootStoreSnapshot
}


