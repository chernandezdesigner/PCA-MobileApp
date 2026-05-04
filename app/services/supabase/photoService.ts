import { supabase } from "@/services/supabase/client"
import { FileSystem, Dirs } from "react-native-file-access"
import * as ImageManipulator from "expo-image-manipulator"
import type { PhotoModelSnapshot } from "@/models/PhotoStore"

// Max concurrent uploads — enough to saturate LTE without hitting rate limits
const CONCURRENT_UPLOADS = 4

// Retry configuration for transient network failures
const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 1000

/**
 * Service for managing photo storage locally and uploading to Supabase
 */
export class PhotoService {
  /**
   * Get (and create if needed) the local photos directory for an assessment
   */
  static async getPhotosDir(assessmentId: string): Promise<string> {
    try {
      const dir = `${Dirs.DocumentDir}/photos/${assessmentId}`
      const exists = await FileSystem.exists(dir)
      if (!exists) {
        await FileSystem.mkdir(dir)
      }
      return dir
    } catch (error) {
      throw new Error(`Failed to initialize photo directory: ${error}`)
    }
  }

  /**
   * Copy a photo from a temporary camera path to the app's local storage
   */
  static async savePhotoLocally(params: {
    tempUri: string
    assessmentId: string
    photoId: string
    filename: string
  }): Promise<{ success: boolean; localUri?: string; fileSize?: number; error?: string }> {
    try {
      const { tempUri, assessmentId, photoId, filename } = params
      const dir = await PhotoService.getPhotosDir(assessmentId)
      const ext = filename.split(".").pop() || "jpg"
      const localUri = `${dir}/${photoId}.${ext}`

      await FileSystem.cp(tempUri, localUri)
      const stat = await FileSystem.stat(localUri)

      return {
        success: true,
        localUri: `file://${localUri}`,
        fileSize: stat.size,
      }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  /**
   * Upload a single photo to Supabase Storage and upsert metadata to the photos table.
   * Uses native Blob via fetch(file://) to avoid loading the full image as a base64
   * string in the JS heap — critical for memory on 20-60 photo assessments.
   */
  static async uploadPhoto(params: {
    photo: PhotoModelSnapshot
    assessmentId: string
    userId: string
  }): Promise<{ success: boolean; storagePath?: string; error?: string }> {
    const { photo, assessmentId, userId } = params

    // Compress once — reused across retries to avoid re-processing
    let compressed: Awaited<ReturnType<typeof ImageManipulator.manipulateAsync>> | null = null
    try {
      compressed = await ImageManipulator.manipulateAsync(
        photo.localUri,
        [{ resize: { width: 1920 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
      )
    } catch (error: any) {
      return { success: false, error: `Compression failed: ${error.message}` }
    }

    const storagePath = `${userId}/${assessmentId}/${photo.filename || photo.id + ".jpg"}`

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Attempt 1: fetch(file://) → Blob.  This is memory-efficient because the data
        // stays in the native layer.  However, on some device/OS combinations the native
        // fetch handler returns a zero-byte Blob for file:// URIs without throwing, so
        // we validate the size and fall back to a direct FileSystem read when needed.
        let uploadData: Blob | Uint8Array
        try {
          const response = await fetch(compressed.uri)
          const blob = await response.blob()
          if (blob.size > 0) {
            uploadData = blob
          } else {
            throw new Error("empty blob")
          }
        } catch (_fetchErr) {
          // Fallback: read the file as base64 and decode into a Uint8Array.
          // This is slightly more memory-intensive but works across all platforms.
          const pathStr = compressed.uri.replace(/^file:\/\//, "")
          const b64 = await FileSystem.readFile(pathStr, "base64")
          const binaryStr = atob(b64)
          const bytes = new Uint8Array(binaryStr.length)
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i)
          }
          uploadData = bytes
        }

        const { error: uploadError } = await supabase.storage
          .from("assessment-photos")
          .upload(storagePath, uploadData, {
            contentType: "image/jpeg",
            upsert: true,
          })

        if (uploadError) {
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * (attempt + 1)))
            continue
          }
          if (__DEV__) console.warn("Photo upload failed after retries:", uploadError.message)
          return { success: false, error: uploadError.message }
        }

        // Upsert metadata to photos table
        const { error: dbError } = await supabase.from("photos").upsert(
          {
            id: photo.id,
            assessment_id: assessmentId,
            user_id: userId,
            storage_path: storagePath,
            filename: photo.filename || photo.id + ".jpg",
            mime_type: "image/jpeg",
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
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * (attempt + 1)))
            continue
          }
          if (__DEV__) console.warn("Photo metadata upsert failed after retries:", dbError.message)
          return { success: false, error: dbError.message }
        }

        return { success: true, storagePath }
      } catch (error: any) {
        if (attempt < MAX_RETRIES) {
          if (__DEV__) console.warn(`Photo upload attempt ${attempt + 1} failed, retrying:`, error.message)
          await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * (attempt + 1)))
          continue
        }
        if (__DEV__) console.warn("Photo upload error after retries:", error.message)
        return { success: false, error: error.message }
      }
    }

    return { success: false, error: "Upload failed after maximum retries" }
  }

  /**
   * Upload all pending photos for an assessment.
   * Processes CONCURRENT_UPLOADS photos at a time via Promise.allSettled so that
   * one failure never blocks the rest of the batch.
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

    for (let i = 0; i < pendingPhotos.length; i += CONCURRENT_UPLOADS) {
      const batch = pendingPhotos.slice(i, i + CONCURRENT_UPLOADS)

      const batchResults = await Promise.allSettled(
        batch.map((photo) => PhotoService.uploadPhoto({ photo, assessmentId, userId })),
      )

      for (let j = 0; j < batchResults.length; j++) {
        const r = batchResults[j]
        const photo = batch[j]

        if (r.status === "fulfilled" && r.value.success) {
          results.push({ photoId: photo.id, success: true, storagePath: r.value.storagePath })
          uploaded++
        } else {
          const errMsg =
            r.status === "rejected" ? String(r.reason?.message ?? r.reason) : r.value.error
          results.push({ photoId: photo.id, success: false, error: errMsg })
          failed++
        }

        onProgress?.(i + j + 1, pendingPhotos.length)
      }
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
      if (__DEV__) console.warn("Failed to delete local photo:", error.message)
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
      if (__DEV__) console.warn("Failed to cleanup local photos:", error.message)
    }
  }
}
