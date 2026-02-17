import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models/RootStoreProvider"

export function usePhotoCapture(formType: string, formStep: number) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined

  const onCamera = () => {
    navigation.navigate("Camera" as never, { formType, formStep } as never)
  }

  const photoCount = activeAssessment?.photoStore.photoCountForStep(formType, formStep) ?? 0

  return { onCamera, photoCount }
}
