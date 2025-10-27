import { Drawer } from "react-native-drawer-layout"
import { AssessmentFormStackNavigator } from "./AssessmentFormStackNavigator"
import { SideDrawer } from "@/components/SideDrawer"
import { DrawerProvider, useDrawerControl } from "@/context/DrawerContext"

const AssessmentDrawer = () => {
  const { isOpen, openDrawer, closeDrawer } = useDrawerControl()

  return (
    <Drawer
      open={isOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
      drawerType="slide"
      drawerWidth={340}
      renderDrawerContent={() => (
        <SideDrawer 
          onNavigate={closeDrawer}
          onClose={closeDrawer}
        />
      )}
    >
      <AssessmentFormStackNavigator />
    </Drawer>
  )
}

export const AssessmentNavigator = () => {
  return (
    <DrawerProvider>
      <AssessmentDrawer />
    </DrawerProvider>
  )
}
