import { FC, useCallback, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Linking,
} from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { v4 as uuidv4 } from "uuid"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useStores } from "@/models/RootStoreProvider"
import { PhotoService } from "@/services/supabase/photoService"

// Conditionally import vision-camera (native only, crashes on web)
let VisionCamera: any = null
if (Platform.OS !== "web") {
  try {
    VisionCamera = require("react-native-vision-camera")
  } catch (e) {
    console.warn("react-native-vision-camera not available:", e)
  }
}

type CameraScreenRouteParams = {
  Camera: {
    formType: string
    formStep: number
    fieldName?: string
  }
}

export const CameraScreen: FC = observer(() => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<CameraScreenRouteParams, "Camera">>()
  const insets = useSafeAreaInsets()
  const rootStore = useStores()

  const { formType, formStep, fieldName } = route.params

  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const photoStore = activeAssessment?.photoStore

  // Camera setup - use real hooks on native, stubs on web
  const cameraRef = useRef<any>(null)
  const [cameraPosition, setCameraPosition] = useState<"back" | "front">("back")
  const device = VisionCamera ? VisionCamera.useCameraDevice(cameraPosition) : null
  const cameraPermission = VisionCamera
    ? VisionCamera.useCameraPermission()
    : { hasPermission: false, requestPermission: async () => {} }
  const { hasPermission, requestPermission } = cameraPermission
  const [flash, setFlash] = useState<"off" | "on">("off")
  const [isCapturing, setIsCapturing] = useState(false)

  // Flash animation
  const flashOpacity = useSharedValue(0)
  const flashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }))

  // Get latest photo thumbnail
  const latestPhoto = photoStore?.allPhotos.length
    ? photoStore.allPhotos[photoStore.allPhotos.length - 1]
    : undefined

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing || !activeAssessment || !photoStore) return

    setIsCapturing(true)
    try {
      const photo = await cameraRef.current.takePhoto({
        flash,
        enableShutterSound: true,
      })

      // Flash animation
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: 200 }),
      )

      const photoId = uuidv4()
      const filename = `${photoId}.jpg`

      // Save locally
      const { localUri, fileSize } = await PhotoService.savePhotoLocally({
        tempUri: `file://${photo.path}`,
        assessmentId: rootStore.activeAssessmentId!,
        photoId,
        filename,
      })

      // Add to store
      photoStore.addPhoto({
        localUri,
        formType,
        formStep,
        fieldName: fieldName ?? "",
        filename,
        mimeType: "image/jpeg",
        fileSize,
        width: photo.width,
        height: photo.height,
      })
    } catch (error) {
      console.warn("Photo capture failed:", error)
    } finally {
      setIsCapturing(false)
    }
  }, [
    isCapturing,
    activeAssessment,
    photoStore,
    flash,
    formType,
    formStep,
    fieldName,
    rootStore.activeAssessmentId,
    flashOpacity,
  ])

  const handleFlipCamera = useCallback(() => {
    setCameraPosition((prev) => (prev === "back" ? "front" : "back"))
  }, [])

  const handleToggleFlash = useCallback(() => {
    setFlash((prev) => (prev === "off" ? "on" : "off"))
  }, [])

  const handleRequestPermission = useCallback(async () => {
    console.log("📷 Requesting camera permission...")
    console.log("   hasPermission before:", hasPermission)
    console.log("   requestPermission fn:", typeof requestPermission)

    try {
      const result = await requestPermission()
      console.log("📷 Permission result:", result)

      // If still not granted after request, the user denied or
      // the permission isn't in the manifest. Offer to open settings.
      if (!result) {
        console.log("📷 Permission denied or unavailable, opening app settings...")
        Linking.openSettings()
      }
    } catch (error) {
      console.warn("📷 Permission request error:", error)
      // Fallback: open app settings so user can manually grant
      Linking.openSettings()
    }
  }, [hasPermission, requestPermission])

  const handleClose = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleOpenGallery = useCallback(() => {
    ;(navigation as any).navigate("PhotoGallery", { formType, formStep })
  }, [navigation, formType, formStep])

  // === Web platform fallback ===
  if (Platform.OS === "web") {
    return (
      <View style={$fallbackRoot}>
        <View style={[$fallbackContent, { paddingTop: insets.top + 16 }]}>
          <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.6)" />
          <Text text="Camera is only available on a physical device" style={$fallbackTitle} />
          <Text
            text="Please test camera features using an iOS or Android device."
            style={$fallbackSubtext}
          />
          <Button text="Go Back" preset="default" onPress={handleClose} style={$fallbackButton} />
        </View>
      </View>
    )
  }

  // === Permission not granted ===
  if (!hasPermission) {
    return (
      <View style={$fallbackRoot}>
        <View style={[$fallbackContent, { paddingTop: insets.top + 16 }]}>
          <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.6)" />
          <Text text="Camera Permission Required" style={$fallbackTitle} />
          <Text
            text="This app needs camera access to capture photos during property assessments."
            style={$fallbackSubtext}
          />
          <Button
            text="Grant Camera Permission"
            preset="filled"
            onPress={handleRequestPermission}
            style={$fallbackButton}
          />
          <Button text="Go Back" preset="default" onPress={handleClose} style={$fallbackButtonSecondary} />
        </View>
      </View>
    )
  }

  // === No camera device found ===
  if (!device) {
    return (
      <View style={$fallbackRoot}>
        <View style={[$fallbackContent, { paddingTop: insets.top + 16 }]}>
          <Ionicons name="alert-circle-outline" size={64} color="rgba(255,255,255,0.6)" />
          <Text text="No Camera Found" style={$fallbackTitle} />
          <Text text="Could not detect a camera device." style={$fallbackSubtext} />
          <Button text="Go Back" preset="default" onPress={handleClose} style={$fallbackButtonSecondary} />
        </View>
      </View>
    )
  }

  // === Camera viewfinder (full screen, no Screen wrapper) ===
  const CameraComponent = VisionCamera.Camera

  return (
    <View style={$cameraRoot}>
      <CameraComponent
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Flash overlay animation */}
      <Animated.View
        style={[$flashOverlay, flashAnimatedStyle]}
        pointerEvents="none"
      />

      {/* Top bar */}
      <View style={[$topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleToggleFlash} style={$iconButton}>
          <Ionicons
            name={flash === "on" ? "flash" : "flash-off"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleClose} style={$iconButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom bar */}
      <View style={[$bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        {/* Gallery thumbnail */}
        <TouchableOpacity onPress={handleOpenGallery} style={$galleryButton}>
          {latestPhoto ? (
            <Image source={{ uri: latestPhoto.localUri }} style={$galleryThumbnail} />
          ) : (
            <View style={$galleryPlaceholder}>
              <Ionicons name="images-outline" size={24} color="white" />
            </View>
          )}
          {photoStore && photoStore.totalCount > 0 && (
            <View style={$photoBadge}>
              <Text text={String(photoStore.totalCount)} style={$badgeText} />
            </View>
          )}
        </TouchableOpacity>

        {/* Shutter button */}
        <TouchableOpacity
          onPress={handleCapture}
          disabled={isCapturing}
          style={$shutterOuter}
          activeOpacity={0.7}
        >
          <View style={$shutterInner}>
            {isCapturing && (
              <ActivityIndicator size="small" color="#333" style={$capturingIndicator} />
            )}
          </View>
        </TouchableOpacity>

        {/* Flip camera */}
        <TouchableOpacity onPress={handleFlipCamera} style={$iconButton}>
          <Ionicons name="camera-reverse-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
})

// ─── Fallback/Permission screen styles ───────────────────────────────────────

const $fallbackRoot: ViewStyle = {
  flex: 1,
  backgroundColor: "#1a1a1a",
}

const $fallbackContent: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 32,
  gap: 16,
}

const $fallbackTitle: TextStyle = {
  color: "white",
  textAlign: "center",
  fontSize: 20,
  fontWeight: "600",
}

const $fallbackSubtext: TextStyle = {
  color: "rgba(255,255,255,0.6)",
  textAlign: "center",
  fontSize: 15,
  lineHeight: 22,
}

const $fallbackButton: ViewStyle = {
  width: "80%",
  marginTop: 12,
}

const $fallbackButtonSecondary: ViewStyle = {
  width: "80%",
  marginTop: 4,
  borderColor: "rgba(255,255,255,0.3)",
}

// ─── Camera viewfinder styles ────────────────────────────────────────────────

const $cameraRoot: ViewStyle = {
  flex: 1,
  backgroundColor: "#000",
}

const $topBar: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  zIndex: 10,
}

const $bottomBar: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  paddingHorizontal: 24,
  paddingTop: 16,
  zIndex: 10,
}

const $iconButton: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
}

const $shutterOuter: ViewStyle = {
  width: 72,
  height: 72,
  borderRadius: 36,
  borderWidth: 4,
  borderColor: "white",
  justifyContent: "center",
  alignItems: "center",
}

const $shutterInner: ViewStyle = {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: "white",
  justifyContent: "center",
  alignItems: "center",
}

const $capturingIndicator: ViewStyle = {
  position: "absolute",
}

const $galleryButton: ViewStyle = {
  width: 48,
  height: 48,
  borderRadius: 8,
  overflow: "hidden",
  borderWidth: 2,
  borderColor: "rgba(255,255,255,0.6)",
}

const $galleryThumbnail: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $galleryPlaceholder: ViewStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255,255,255,0.15)",
  justifyContent: "center",
  alignItems: "center",
}

const $photoBadge: ViewStyle = {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "#FF3B30",
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 4,
}

const $badgeText: TextStyle = {
  color: "white",
  fontSize: 11,
  fontWeight: "bold",
}

const $flashOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "white",
  zIndex: 5,
}
