import { supabase } from "@/services/supabase/client"
import { FileSystem, Dirs } from "react-native-file-access"
import * as ImageManipulator from "expo-image-manipulator"
import type { PhotoModelSnapshot } from "@/models/PhotoStore"
import Config from "@/config"

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
   * Uses React Native's native FormData file pattern ({ uri, name, type }) with a direct
   * REST call to the Supabase Storage API, bypassing the JS storage client to avoid
   * the RCTNetworking "Property 'blob' doesn't exist" crash on iOS.
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

    // Collect result into a local variable so we can always clean up the
    // compressed temp file before returning, regardless of success or failure.
    // ImageManipulator writes to the temp directory and never cleans up after
    // itself — on a 30-photo assessment with retries this can accumulate
    // 50–100 MB of orphaned files if we return early without deleting them.
    let result: { success: boolean; storagePath?: string; error?: string } = {
      success: false,
      error: "Upload failed after maximum retries",
    }

    // Get session once before the retry loop. autoRefreshToken handles background
    // renewal; for a 3-attempt window (~6 s total) the token won't expire mid-loop.
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) {
      return { success: false, error: "Not authenticated" }
    }

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Use React Native's native FormData file upload pattern: pass { uri, name, type }
        // as a FormData part. iOS's RCTNetworking reads the file from disk natively and
        // streams it as multipart binary — no Blob or Uint8Array ever enters the JS heap.
        //
        // The previous approach (fetch(file://) → response.blob() → Supabase storage
        // client → new FormData → body.append('', blob)) crashed 100% of the time with
        // "Property 'blob' doesn't exist". That error is thrown by RCTNetworking's native
        // Objective-C layer, which expects a `blob` key in the FormData part dictionary.
        // Spreading a React Native Blob class instance produces `_data`, not `blob`, so
        // the native lookup always fails. Bypassing the Supabase JS storage client and
        // using the REST endpoint directly avoids all of that internal wrapping.
        const formData = new FormData()
        formData.append("", {
          uri: compressed.uri,
          name: photo.filename || `${photo.id}.jpg`,
          type: "image/jpeg",
        } as any)
        formData.append("cacheControl", "3600")

        const uploadUrl = `${Config.SUPABASE_URL}/storage/v1/object/assessment-photos/${storagePath}`
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: Config.SUPABASE_ANON_KEY,
            "x-upsert": "true",
          },
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errData = await uploadResponse.json().catch(() => ({}))
          const uploadError =
            (errData as any).message ||
            (errData as any).error ||
            `Upload failed: ${uploadResponse.status}`
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * (attempt + 1)))
            continue
          }
          if (__DEV__) console.warn("Photo upload failed after retries:", uploadError)
          result = { success: false, error: uploadError }
          break
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
            created_at: photo.capturedAt
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
          result = { success: false, error: dbError.message }
          break
        }

        result = { success: true, storagePath }
        break
      } catch (error: any) {
        if (attempt < MAX_RETRIES) {
          if (__DEV__) console.warn(`Photo upload attempt ${attempt + 1} failed, retrying:`, error.message)
          await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * (attempt + 1)))
          continue
        }
        if (__DEV__) console.warn("Photo upload error after retries:", error.message)
        result = { success: false, error: error.message }
        break
      }
    }

    // Always clean up the compressed temp file. ImageManipulator never removes
    // its output files, and early returns would otherwise leave them orphaned.
    try {
      const tempPath = compressed.uri.replace(/^file:\/\//, "")
      if (await FileSystem.exists(tempPath)) {
        await FileSystem.unlink(tempPath)
      }
    } catch (_cleanupErr) {
      // Non-blocking — the OS will eventually reclaim the temp directory.
    }

    return result
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
