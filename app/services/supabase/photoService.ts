import { supabase } from "@/services/supabase/client"
import { FileSystem, Dirs } from "react-native-file-access"
import type { PhotoModelSnapshot } from "@/models/PhotoStore"

/**
 * Service for managing photo storage locally and uploading to Supabase
 */
export class PhotoService {
  /**
   * Get (and create if needed) the local photos directory for an assessment
   */
  static async getPhotosDir(assessmentId: string): Promise<string> {
    const dir = `${Dirs.DocumentDir}/photos/${assessmentId}`
    const exists = await FileSystem.exists(dir)
    if (!exists) {
      await FileSystem.mkdir(dir)
    }
    return dir
  }

  /**
   * Copy a photo from a temporary camera path to the app's local storage
   */
  static async savePhotoLocally(params: {
    tempUri: string
    assessmentId: string
    photoId: string
    filename: string
  }): Promise<{ localUri: string; fileSize: number }> {
    const { tempUri, assessmentId, photoId, filename } = params
    const dir = await PhotoService.getPhotosDir(assessmentId)
    const ext = filename.split(".").pop() || "jpg"
    const localUri = `${dir}/${photoId}.${ext}`

    await FileSystem.cp(tempUri, localUri)
    const stat = await FileSystem.stat(localUri)

    return {
      localUri,
      fileSize: stat.size,
    }
  }

  /**
   * Upload a single photo to Supabase Storage and upsert metadata to the photos table
   */
  static async uploadPhoto(params: {
    photo: PhotoModelSnapshot
    assessmentId: string
    userId: string
  }): Promise<{ success: boolean; storagePath?: string; error?: string }> {
    const { photo, assessmentId, userId } = params

    try {
      // Read the file as base64
      const base64Data = await FileSystem.readFile(photo.localUri, "base64")

      // Build storage path
      const storagePath = `${userId}/${assessmentId}/${photo.filename || photo.id + ".jpg"}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("assessment-photos")
        .upload(storagePath, decode(base64Data), {
          contentType: photo.mimeType || "image/jpeg",
          upsert: true,
        })

      if (uploadError) {
        console.warn("Photo upload failed:", uploadError.message)
        return { success: false, error: uploadError.message }
      }

      // Upsert metadata to photos table
      const { error: dbError } = await supabase.from("photos").upsert(
        {
          id: photo.id,
          assessment_id: assessmentId,
          user_id: userId,
          local_uri: photo.localUri,
          storage_path: storagePath,
          filename: photo.filename || photo.id + ".jpg",
          mime_type: photo.mimeType || "image/jpeg",
          file_size: photo.fileSize || 0,
          width: photo.width || 0,
          height: photo.height || 0,
          form_type: photo.formType || "",
          form_step: photo.formStep || 0,
          field_name: photo.fieldName || "",
          notes: photo.notes || "",
          captured_at: photo.capturedAt
            ? new Date(photo.capturedAt).toISOString()
            : new Date().toISOString(),
          upload_status: "completed",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )

      if (dbError) {
        console.warn("Photo metadata upsert failed:", dbError.message)
        return { success: false, error: dbError.message }
      }

      return { success: true, storagePath }
    } catch (error: any) {
      console.warn("Photo upload error:", error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Upload all pending photos for an assessment
   */
  static async uploadAllPhotos(params: {
    photos: PhotoModelSnapshot[]
    assessmentId: string
    userId: string
    onProgress?: (completed: number, total: number) => void
  }): Promise<{
    uploaded: number
    failed: number
    results: Array<{ photoId: string; success: boolean; storagePath?: string; error?: string }>
  }> {
    const { photos, assessmentId, userId, onProgress } = params
    const pendingPhotos = photos.filter((p) => p.uploadStatus !== "completed")

    let uploaded = 0
    let failed = 0
    const results: Array<{
      photoId: string
      success: boolean
      storagePath?: string
      error?: string
    }> = []

    for (let i = 0; i < pendingPhotos.length; i++) {
      const photo = pendingPhotos[i]
      const result = await PhotoService.uploadPhoto({ photo, assessmentId, userId })

      results.push({ photoId: photo.id, ...result })

      if (result.success) {
        uploaded++
      } else {
        failed++
      }

      onProgress?.(i + 1, pendingPhotos.length)
    }

    return { uploaded, failed, results }
  }

  /**
   * Delete a single photo file from local storage
   */
  static async deletePhotoLocally(localUri: string): Promise<void> {
    try {
      const exists = await FileSystem.exists(localUri)
      if (exists) {
        await FileSystem.unlink(localUri)
      }
    } catch (error: any) {
      console.warn("Failed to delete local photo:", error.message)
    }
  }

  /**
   * Remove the entire local photos directory for an assessment
   */
  static async cleanupLocalPhotos(assessmentId: string): Promise<void> {
    try {
      const dir = `${Dirs.DocumentDir}/photos/${assessmentId}`
      const exists = await FileSystem.exists(dir)
      if (exists) {
        await FileSystem.unlink(dir)
      }
    } catch (error: any) {
      console.warn("Failed to cleanup local photos:", error.message)
    }
  }
}

/**
 * Decode a base64 string to a Uint8Array for Supabase storage upload
 */
function decode(base64: string): Uint8Array {
  const binaryStr = atob(base64)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}
