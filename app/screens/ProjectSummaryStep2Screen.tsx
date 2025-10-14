import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface ProjectSummaryStep2ScreenProps extends AppStackScreenProps<"ProjectSummaryStep2"> {}

export const ProjectSummaryStep2Screen: FC<ProjectSummaryStep2ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="projectSummaryStep2" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
