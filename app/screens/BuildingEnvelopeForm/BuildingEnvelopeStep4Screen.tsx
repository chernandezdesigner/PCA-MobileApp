import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep4ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep4"> {}

export const BuildingEnvelopeStep4Screen: FC<BuildingEnvelopeStep4ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep4" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
