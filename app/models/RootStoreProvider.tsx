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
    // Ensure there is always an active assessment
    if (storeRef.current && !storeRef.current.activeAssessmentId) {
      const id = `assessment_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      storeRef.current.createAssessment(id)
    }

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
    })
  }
  return copy as RootStoreSnapshot
}


