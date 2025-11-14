import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep6ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep6"> {}

export const BuildingEnvelopeStep6Screen: FC<BuildingEnvelopeStep6ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep6" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
