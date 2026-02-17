import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { generateUUID } from "@/utils/generateUUID"

/**
 * PhotoModel - Represents a single photo captured during an assessment
 */
export const PhotoModel = types
  .model("PhotoModel", {
    id: types.identifier,
    localUri: types.string,
    thumbnailUri: types.optional(types.string, ""),
    formType: types.optional(types.string, ""),
    formStep: types.optional(types.number, 0),
    fieldName: types.optional(types.string, ""),
    filename: types.optional(types.string, ""),
    mimeType: types.optional(types.string, "image/jpeg"),
    fileSize: types.optional(types.number, 0),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    uploadStatus: types.optional(
      types.enumeration("UploadStatus", ["pending", "uploading", "completed", "failed"]),
      "pending",
    ),
    storagePath: types.optional(types.string, ""),
    capturedAt: types.optional(types.Date, () => new Date()),
    notes: types.optional(types.string, ""),
  })

/**
 * PhotoStore - Manages all photos for a single assessment
 */
export const PhotoStore = types
  .model("PhotoStore", {
    photos: types.map(PhotoModel),
    lastModified: types.optional(types.Date, () => new Date()),
  })
  .views((self) => ({
    get allPhotos() {
      return Array.from(self.photos.values())
    },

    photosForStep(formType: string, step: number) {
      return Array.from(self.photos.values()).filter(
        (photo) => photo.formType === formType && photo.formStep === step,
      )
    },

    photoCountForStep(formType: string, step: number) {
      return Array.from(self.photos.values()).filter(
        (photo) => photo.formType === formType && photo.formStep === step,
      ).length
    },

    get totalCount() {
      return self.photos.size
    },

    get pendingUploadCount() {
      return Array.from(self.photos.values()).filter(
        (photo) => photo.uploadStatus === "pending",
      ).length
    },
  }))
  .actions((self) => ({
    addPhoto(data: {
      localUri: string
      thumbnailUri?: string
      formType?: string
      formStep?: number
      fieldName?: string
      filename?: string
      mimeType?: string
      fileSize?: number
      width?: number
      height?: number
      notes?: string
    }) {
      const id = generateUUID()
      self.photos.put({
        id,
        localUri: data.localUri,
        thumbnailUri: data.thumbnailUri ?? "",
        formType: data.formType ?? "",
        formStep: data.formStep ?? 0,
        fieldName: data.fieldName ?? "",
        filename: data.filename ?? "",
        mimeType: data.mimeType ?? "image/jpeg",
        fileSize: data.fileSize ?? 0,
        width: data.width ?? 0,
        height: data.height ?? 0,
        notes: data.notes ?? "",
      })
      self.lastModified = new Date()
      return id
    },

    removePhoto(id: string) {
      self.photos.delete(id)
      self.lastModified = new Date()
    },

    updatePhotoNotes(id: string, notes: string) {
      const photo = self.photos.get(id)
      if (photo) {
        photo.notes = notes
        self.lastModified = new Date()
      }
    },

    updateUploadStatus(id: string, status: "pending" | "uploading" | "completed" | "failed", storagePath?: string) {
      const photo = self.photos.get(id)
      if (photo) {
        photo.uploadStatus = status
        if (storagePath) {
          photo.storagePath = storagePath
        }
        self.lastModified = new Date()
      }
    },
  }))

export interface PhotoModelInstance extends Instance<typeof PhotoModel> {}
export interface PhotoModelSnapshot extends SnapshotOut<typeof PhotoModel> {}
export interface PhotoStoreInstance extends Instance<typeof PhotoStore> {}
export interface PhotoStoreSnapshot extends SnapshotOut<typeof PhotoStore> {}
