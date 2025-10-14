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
    storeRef.current = RootStore.create(snapshot ?? {})
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

  const value = useMemo(() => storeRef.current, [isHydrated])

  if (!isHydrated || !value) return null

  return <RootStoreContext.Provider value={value}>{children}</RootStoreContext.Provider>
}

export const useStores = () => {
  const context = useContext(RootStoreContext)
  if (!context) throw new Error("useStores must be used within a RootStoreProvider")
  return context
}


