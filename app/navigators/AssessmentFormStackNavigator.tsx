import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProjectSummaryStep1Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep1Screen"
import { ProjectSummaryStep2Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep2Screen"
import { ProjectSummaryStep3Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep3Screen"
import { ProjectSummaryStep4Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep4Screen"
import { SiteGroundsStep1Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep1Screen"
import { SiteGroundsStep2Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep2Screen"
import { SiteGroundsStep3Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep3Screen"
import { SiteGroundsStep4Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep4Screen"

export type AssessmentFormStackParamList = {
  // Project Summary
  ProjectSummaryStep1: undefined
  ProjectSummaryStep2: undefined
  ProjectSummaryStep3: undefined
  ProjectSummaryStep4: undefined
  // Site Grounds
  SiteGroundsStep1: undefined
  SiteGroundsStep2: undefined
  SiteGroundsStep3: undefined
  SiteGroundsStep4: undefined
}

const Stack = createNativeStackNavigator<AssessmentFormStackParamList>()

export const AssessmentFormStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Allow per-navigation transition via route params
        // e.g., navigation.navigate("Step2", { transition: "slide_from_right" })
        // Fallback to default native animation
        animation: (route as any)?.params?.transition,
      })}
    >
      {/* Project Summary */}
      <Stack.Screen name="ProjectSummaryStep1" component={ProjectSummaryStep1Screen} />
      <Stack.Screen name="ProjectSummaryStep2" component={ProjectSummaryStep2Screen} />
      <Stack.Screen name="ProjectSummaryStep3" component={ProjectSummaryStep3Screen} />
      <Stack.Screen name="ProjectSummaryStep4" component={ProjectSummaryStep4Screen} />
      
      {/* Site Grounds */}
      <Stack.Screen name="SiteGroundsStep1" component={SiteGroundsStep1Screen} />
      <Stack.Screen name="SiteGroundsStep2" component={SiteGroundsStep2Screen} />
      <Stack.Screen name="SiteGroundsStep3" component={SiteGroundsStep3Screen} />
      <Stack.Screen name="SiteGroundsStep4" component={SiteGroundsStep4Screen} />
    </Stack.Navigator>
  )
}

