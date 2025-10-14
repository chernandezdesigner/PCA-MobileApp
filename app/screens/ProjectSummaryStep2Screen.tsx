import { FC } from "react"
import { ViewStyle } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface ProjectSummaryStep2ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep2"> {}

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
