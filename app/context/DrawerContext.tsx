import { createContext, useContext, useState, ReactNode } from "react"

interface DrawerContextValue {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)
  const toggleDrawer = () => setIsOpen((prev) => !prev)

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawerControl = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error("useDrawerControl must be used within DrawerProvider")
  }
  return context
}

