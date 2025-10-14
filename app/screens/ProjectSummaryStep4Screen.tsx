import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface ProjectSummaryStep4ScreenProps extends AppStackScreenProps<"ProjectSummaryStep4"> {}

export const ProjectSummaryStep4Screen: FC<ProjectSummaryStep4ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="projectSummaryStep4" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
