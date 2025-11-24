import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProjectSummaryStep1Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep1Screen"
import { ProjectSummaryStep2Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep2Screen"
import { ProjectSummaryStep3Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep3Screen"
import { ProjectSummaryStep4Screen } from "@/screens/ProjectSummaryForm/ProjectSummaryStep4Screen"
import { SiteGroundsStep1Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep1Screen"
import { SiteGroundsStep2Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep2Screen"
import { SiteGroundsStep3Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep3Screen"
import { SiteGroundsStep4Screen } from "@/screens/SiteGroundsForm/SiteGroundsStep4Screen"
import { BuildingEnvelopeStep1Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep1Screen"
import { BuildingEnvelopeStep2Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep2Screen"
import { BuildingEnvelopeStep3Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep3Screen"
import { BuildingEnvelopeStep4Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep4Screen"
import { BuildingEnvelopeStep5Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep5Screen"
import { BuildingEnvelopeStep6Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep6Screen"
import { BuildingEnvelopeStep7Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep7Screen"
import { BuildingEnvelopeStep8Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep8Screen"
import { BuildingEnvelopeStep9Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep9Screen"
import { BuildingEnvelopeStep10Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep10Screen"

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
  // Building Envelope
  BuildingEnvelopeStep1: undefined
  BuildingEnvelopeStep2: undefined
  BuildingEnvelopeStep3: undefined
  BuildingEnvelopeStep4: undefined
  BuildingEnvelopeStep5: undefined
  BuildingEnvelopeStep6: undefined
  BuildingEnvelopeStep7: undefined
  BuildingEnvelopeStep8: undefined
  BuildingEnvelopeStep9: undefined
  BuildingEnvelopeStep10: undefined
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
      
      {/* Building Envelope */}
      <Stack.Screen name="BuildingEnvelopeStep1" component={BuildingEnvelopeStep1Screen} />
      <Stack.Screen name="BuildingEnvelopeStep2" component={BuildingEnvelopeStep2Screen} />
      <Stack.Screen name="BuildingEnvelopeStep3" component={BuildingEnvelopeStep3Screen} />
      <Stack.Screen name="BuildingEnvelopeStep4" component={BuildingEnvelopeStep4Screen} />
      <Stack.Screen name="BuildingEnvelopeStep5" component={BuildingEnvelopeStep5Screen} />
      <Stack.Screen name="BuildingEnvelopeStep6" component={BuildingEnvelopeStep6Screen} />
      <Stack.Screen name="BuildingEnvelopeStep7" component={BuildingEnvelopeStep7Screen} />
      <Stack.Screen name="BuildingEnvelopeStep8" component={BuildingEnvelopeStep8Screen} />
      <Stack.Screen name="BuildingEnvelopeStep9" component={BuildingEnvelopeStep9Screen} />
      <Stack.Screen name="BuildingEnvelopeStep10" component={BuildingEnvelopeStep10Screen} />
    </Stack.Navigator>
  )
}

