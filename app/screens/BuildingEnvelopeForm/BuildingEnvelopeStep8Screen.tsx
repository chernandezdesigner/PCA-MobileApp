import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep8ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep8"> {}

export const BuildingEnvelopeStep8Screen: FC<BuildingEnvelopeStep8ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep8" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
