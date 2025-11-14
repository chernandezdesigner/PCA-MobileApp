import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProjectSummaryStep1Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep1Screen"
import { ProjectSummaryStep2Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep2Screen"
import { ProjectSummaryStep3Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep3Screen"
import { ProjectSummaryStep4Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep4Screen"

export type ProjectSummaryFormNavigatorParamList = {
  ProjectSummaryStep1: undefined
  ProjectSummaryStep2: undefined
  ProjectSummaryStep3: undefined
  ProjectSummaryStep4: undefined
}

const Stack = createNativeStackNavigator<ProjectSummaryFormNavigatorParamList>()
export const ProjectSummaryFormNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectSummaryStep1" component={ProjectSummaryStep1Screen} />
      <Stack.Screen name="ProjectSummaryStep2" component={ProjectSummaryStep2Screen} />
      <Stack.Screen name="ProjectSummaryStep3" component={ProjectSummaryStep3Screen} />
      <Stack.Screen name="ProjectSummaryStep4" component={ProjectSummaryStep4Screen} />
    </Stack.Navigator>
  )
}
