import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AssessmentFormStackParamList } from "@/navigators/AssessmentFormStackNavigator"
import { useStores } from "@/models/RootStoreProvider"

type NavigationProp = NativeStackNavigationProp<AssessmentFormStackParamList>

export function usePhotoCapture(formType: string, formStep: number) {
  const navigation = useNavigation<NavigationProp>()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined

  const onCamera = () => {
    navigation.navigate("Camera", { formType, formStep })
  }

  const photoCount = activeAssessment?.photoStore.photoCountForStep(formType, formStep) ?? 0

  return { onCamera, photoCount }
}
