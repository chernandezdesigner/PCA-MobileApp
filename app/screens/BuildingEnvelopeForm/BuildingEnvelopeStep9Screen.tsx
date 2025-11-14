import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep9ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep9"> {}

export const BuildingEnvelopeStep9Screen: FC<BuildingEnvelopeStep9ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep9" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
