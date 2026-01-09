import React from "react"
import { observer } from "mobx-react-lite"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"

export const MechanicalSystemsStep9Screen = observer(function MechanicalSystemsStep9Screen() {
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  
  return (
    <Screen style={{ flex: 1, justifyContent: "center", alignItems: "center" }} preset="fixed">
      <Text preset="heading" text="MechanicalSystemsStep9Screen" />
      <Text preset="subheading" text="Fire Protection - To Be Built" />
      
      <StickyFooterNav
        onBack={() => {
          // @ts-expect-error route params for animation
          navigation.navigate("MechanicalSystemsStep8" as never, { transition: "slide_from_left" } as never)
        }}
        onNext={openDrawer}
        nextButtonText="Next Form"
        showCamera={true}
      />
    </Screen>
  )
})

