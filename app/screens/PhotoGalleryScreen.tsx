import { FC, useCallback, useMemo, useState } from "react"
import {
  View,
  ViewStyle,
  FlatList,
  TouchableOpacity,
  Image,
  ImageStyle,
  TextInput,
  TextStyle,
  Alert,
  Dimensions,
  Modal,
} from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useStores } from "@/models/RootStoreProvider"
import { PhotoService } from "@/services/supabase/photoService"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { PhotoModelInstance } from "@/models/PhotoStore"

type PhotoGalleryRouteParams = {
  PhotoGallery: {
    formType?: string
    formStep?: number
  }
}

type FilterTab = "step" | "all"

const SCREEN_WIDTH = Dimensions.get("window").width
const GRID_SPACING = 2
const NUM_COLUMNS = 3
const TILE_SIZE = (SCREEN_WIDTH - GRID_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS

export const PhotoGalleryScreen: FC = observer(() => {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<PhotoGalleryRouteParams, "PhotoGallery">>()
  const insets = useSafeAreaInsets()
  const rootStore = useStores()

  const formType = route.params?.formType
  const formStep = route.params?.formStep

  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const photoStore = activeAssessment?.photoStore

  const [activeFilter, setActiveFilter] = useState<FilterTab>(
    formType && formStep !== undefined ? "step" : "all",
  )
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoModelInstance | null>(null)
  const [editNotes, setEditNotes] = useState("")

  const photos = useMemo(() => {
    if (!photoStore) return []
    if (activeFilter === "step" && formType && formStep !== undefined) {
      return photoStore.photosForStep(formType, formStep)
    }
    return photoStore.allPhotos
  }, [photoStore, activeFilter, formType, formStep, photoStore?.lastModified])

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleSelectPhoto = useCallback((photo: PhotoModelInstance) => {
    setSelectedPhoto(photo)
    setEditNotes(photo.notes)
  }, [])

  const handleClosePreview = useCallback(() => {
    // Save notes if changed
    if (selectedPhoto && editNotes !== selectedPhoto.notes) {
      photoStore?.updatePhotoNotes(selectedPhoto.id, editNotes)
    }
    setSelectedPhoto(null)
    setEditNotes("")
  }, [selectedPhoto, editNotes, photoStore])

  const handleDeletePhoto = useCallback(() => {
    if (!selectedPhoto || !photoStore) return

    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await PhotoService.deletePhotoLocally(selectedPhoto.localUri)
          photoStore.removePhoto(selectedPhoto.id)
          setSelectedPhoto(null)
          setEditNotes("")
        },
      },
    ])
  }, [selectedPhoto, photoStore])

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const renderPhotoTile = useCallback(
    ({ item }: { item: PhotoModelInstance }) => (
      <TouchableOpacity
        onPress={() => handleSelectPhoto(item)}
        style={$photoTile}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.localUri }} style={$tileImage} />
      </TouchableOpacity>
    ),
    [handleSelectPhoto],
  )

  const hasStepFilter = formType && formStep !== undefined

  return (
    <Screen style={$root} preset="fixed">
      {/* Header */}
      <View style={[$header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleBack} style={$backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text text="Photos" style={themed($headerTitle)} />
        <View style={$headerSpacer} />
      </View>

      {/* Filter tabs */}
      {hasStepFilter && (
        <View style={themed($filterBar)}>
          <TouchableOpacity
            onPress={() => setActiveFilter("step")}
            style={[
              themed($filterTab),
              activeFilter === "step" && themed($filterTabActive),
            ]}
          >
            <Text
              text="This Step"
              style={[
                themed($filterText),
                activeFilter === "step" && themed($filterTextActive),
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter("all")}
            style={[
              themed($filterTab),
              activeFilter === "all" && themed($filterTabActive),
            ]}
          >
            <Text
              text="All Photos"
              style={[
                themed($filterText),
                activeFilter === "all" && themed($filterTextActive),
              ]}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Grid */}
      {photos.length === 0 ? (
        <View style={$emptyContainer}>
          <Ionicons name="images-outline" size={48} color={theme.colors.textDim} />
          <Text text="No photos yet" style={themed($emptyText)} />
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoTile}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={$gridContent}
          columnWrapperStyle={$gridRow}
        />
      )}

      {/* Full-screen preview modal */}
      <Modal
        visible={selectedPhoto !== null}
        animationType="fade"
        transparent={false}
        onRequestClose={handleClosePreview}
      >
        {selectedPhoto && (
          <View style={[$previewContainer, { paddingTop: insets.top }]}>
            {/* Preview header */}
            <View style={$previewHeader}>
              <TouchableOpacity onPress={handleClosePreview} style={$previewBackButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeletePhoto} style={$deleteButton}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            {/* Photo */}
            <Image
              source={{ uri: selectedPhoto.localUri }}
              style={$previewImage}
              resizeMode="contain"
            />

            {/* Metadata + notes */}
            <View style={[$previewFooter, { paddingBottom: insets.bottom + 16 }]}>
              {/* Metadata */}
              <View style={$metadataRow}>
                <Text
                  text={formatTimestamp(selectedPhoto.capturedAt)}
                  style={$metadataText}
                />
                {selectedPhoto.formType ? (
                  <View style={$tag}>
                    <Text
                      text={`${selectedPhoto.formType} / Step ${selectedPhoto.formStep}`}
                      style={$tagText}
                    />
                  </View>
                ) : null}
              </View>

              {/* Notes input */}
              <TextInput
                value={editNotes}
                onChangeText={setEditNotes}
                placeholder="Add notes..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={$notesInput}
                multiline
                numberOfLines={2}
                returnKeyType="done"
                blurOnSubmit
                onBlur={() => {
                  if (selectedPhoto && editNotes !== selectedPhoto.notes) {
                    photoStore?.updatePhotoNotes(selectedPhoto.id, editNotes)
                  }
                }}
              />
            </View>
          </View>
        )}
      </Modal>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingBottom: 12,
}

const $backButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
}

const $headerTitle: ThemedStyle<any> = ({ colors }) => ({
  flex: 1,
  textAlign: "center" as const,
  fontSize: 18,
  fontWeight: "600" as const,
  color: colors.text,
})

const $headerSpacer: ViewStyle = {
  width: 40,
}

const $filterBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: "row",
  marginHorizontal: 16,
  marginBottom: 8,
  borderRadius: 8,
  backgroundColor: colors.palette.neutral200,
  padding: 2,
})

const $filterTab: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingVertical: 8,
  borderRadius: 6,
  alignItems: "center",
})

const $filterTabActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $filterText: ThemedStyle<any> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $filterTextActive: ThemedStyle<any> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600" as const,
})

const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  gap: 12,
}

const $emptyText: ThemedStyle<any> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 16,
})

const $gridContent: ViewStyle = {
  padding: GRID_SPACING,
}

const $gridRow: ViewStyle = {
  gap: GRID_SPACING,
  marginBottom: GRID_SPACING,
}

const $photoTile: ViewStyle = {
  width: TILE_SIZE,
  height: TILE_SIZE,
  borderRadius: 4,
  overflow: "hidden",
}

const $tileImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

// Preview modal styles
const $previewContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#000",
}

const $previewHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 8,
}

const $previewBackButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
}

const $deleteButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
}

const $previewImage: ImageStyle = {
  flex: 1,
  width: "100%",
}

const $previewFooter: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 12,
  gap: 10,
}

const $metadataRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $metadataText: TextStyle = {
  color: "rgba(255,255,255,0.7)",
  fontSize: 13,
}

const $tag: ViewStyle = {
  backgroundColor: "rgba(255,255,255,0.15)",
  borderRadius: 4,
  paddingHorizontal: 8,
  paddingVertical: 3,
}

const $tagText: TextStyle = {
  color: "rgba(255,255,255,0.8)",
  fontSize: 12,
}

const $notesInput: TextStyle = {
  color: "white",
  fontSize: 15,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.2)",
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  minHeight: 48,
  textAlignVertical: "top",
}
