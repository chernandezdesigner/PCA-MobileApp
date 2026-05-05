import { supabase } from './client'
import { getSnapshot } from 'mobx-state-tree'
import type { AssessmentInstance } from '@/models/Assessment'
import { PhotoService } from '@/services/supabase/photoService'

/**
 * Service for submitting assessments to Supabase
 */
export class AssessmentService {
  /**
   * Submit an assessment to Supabase
   * Saves assessment, project_summaries, site_grounds, building_envelope, and mechanical_systems data
   */
  static async submitAssessment(assessment: AssessmentInstance): Promise<{
    success: boolean
    error?: string
    assessmentId?: string
    failedPhotoCount?: number
  }> {
    try {
      // Use getSession() instead of getUser() — getSession reads from local AsyncStorage
      // cache and does NOT require a network request, making it safe for offline use.
      // getUser() hits the Auth server every time and throws "Not authenticated" in
      // airplane mode even though the user is legitimately signed in.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        throw new Error('Not authenticated')
      }
      const user = session.user

      // Get assessment snapshot
      const snapshot = getSnapshot(assessment)

      // 1. Insert/Update assessment record
      // Use local_id as the unique identifier for upserts (it's our custom MST ID)
      // Let Supabase auto-generate the UUID for id field
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .upsert({
          user_id: user.id,
          status: 'submitted',
          local_id: snapshot.id,
          created_at: new Date(snapshot.createdAt).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'local_id' // Upsert based on local_id, not id
        })
        .select()
        .single()

      if (assessmentError) {
        throw assessmentError
      }

      // Use the Supabase-generated UUID for foreign key references
      const supabaseAssessmentId = assessmentData.id

      // 2. Insert/Update project_summaries
      if (snapshot.projectSummary) {
        const ps = snapshot.projectSummary
        const { error: projectError } = await supabase
          .from('project_summaries')
          .upsert({
            assessment_id: supabaseAssessmentId,
            
            // Step 1
            project_name: ps.projectName,
            project_number: ps.projectNumber,
            property_address: ps.propertyAddress,
            property_city: ps.propertyCity,
            property_state: ps.propertyState,
            property_zip: ps.propertyZip,
            weather: ps.weather,
            temperature: ps.temperature,
            inspection_date: ps.inspectionDate ? new Date(ps.inspectionDate).toISOString() : null,
            inspection_time: ps.inspectionTime,
            inspector_name: ps.inspectorName,
            inspector_number: ps.inspectorNumber,
            surrounding_properties: ps.surroundingProperties,
            
            // Step 2
            acreage: ps.acreage,
            number_sign_down: ps.numberSignDown,
            year_renovated: ps.yearRenovated,
            number_of_buildings: ps.numberOfBuildings,
            net_sq_ft: ps.netSqFt,
            number_of_units: ps.numberOfUnits,
            gsf: ps.GSF,
            number_of_vacant_units: ps.numberOfVacantUnits,
            year_built: ps.yearBuilt,
            lease_type: ps.leaseType,
            recent_capital_improvements: ps.recentCapitalImprovements,
            
            // Step 3 (as JSONB)
            documents: ps.documents || {},
            other_documentation_specification: ps.otherDocumentationSpecification || "",
            personnel_interviewed: ps.personnelInterviewed || [],
            commercial_tenants: ps.commercialTenants || [],
            
            // Step 4
            problematic_materials: ps.problematicMaterials || {},
            domestic_water: ps.domesticWater,
            domestic_sewage: ps.domesticSewage,
            storm_water_drainage: ps.stormWaterDrainage,
            electricity: ps.electricity,
            natural_gas: ps.naturalGas,
            heating_oil: ps.heatingOil,
            propane: ps.propane,
            well_system: ps.wellSystem,
            septic_system: ps.septicSystem,
            wastewater_treatment_plant: ps.wastewaterTreatmentPlant,
            
            current_step: ps.currentStep,
            last_modified: ps.lastModified ? new Date(ps.lastModified).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'assessment_id' // Upsert based on assessment_id (which is UNIQUE)
          })

        if (projectError) {
          throw projectError
        }
      }

      // 3. Insert/Update site_grounds
      if (snapshot.siteGrounds) {
        const sg = snapshot.siteGrounds
        const { error: siteError } = await supabase
          .from('site_grounds')
          .upsert({
            assessment_id: supabaseAssessmentId,
            step1: sg.step1 || {},
            step2: sg.step2 || {},
            step3: sg.step3 || {},
            step4: sg.step4 || {},
            current_step: sg.currentStep,
            last_modified: sg.lastModified ? new Date(sg.lastModified).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'assessment_id'
          })

        if (siteError) {
          throw siteError
        }
      }

      // 4. Insert/Update building_envelope
      if (snapshot.buildingEnvelope) {
        const be = snapshot.buildingEnvelope
        const { error: buildingError } = await supabase
          .from('building_envelope')
          .upsert({
            assessment_id: supabaseAssessmentId,
            step1: be.step1 || {},
            step2: be.step2 || {},
            // Combine step3 and step3B into step3 JSONB
            step3: { ...be.step3, step3B: be.step3B },
            step4: be.step4 || {},
            step5: be.step5 || {},
            step6: be.step6 || {},
            step7: be.step7 || {},
            step8: be.step8 || {},
            step9: be.step9 || {},
            step10: be.step10 || {},
            current_step: typeof be.currentStep === 'string'
              ? parseInt(be.currentStep.replace('step', '')) || 1
              : be.currentStep,
            last_modified: be.lastModified ? new Date(be.lastModified).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'assessment_id'
          })

        if (buildingError) {
          throw buildingError
        }
      }

      // 5. Insert/Update mechanical_systems
      if (snapshot.mechanicalSystems) {
        const ms = snapshot.mechanicalSystems
        const { error: mechanicalError } = await supabase
          .from('mechanical_systems')
          .upsert({
            assessment_id: supabaseAssessmentId,
            step1: ms.step1 || {},
            step2: ms.step2 || {},
            step3: ms.step3 || {},
            step4: ms.step4 || {},
            step5: ms.step5 || {},
            step6: ms.step6 || {},
            step7: ms.step7 || {},
            step8: ms.step8 || {},
            step9: ms.step9 || {},
            current_step: ms.currentStep,
            last_modified: ms.lastModified ? new Date(ms.lastModified).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'assessment_id'
          })

        if (mechanicalError) {
          throw mechanicalError
        }
      }

      // 6. Insert/Update interior_conditions
      if (snapshot.interiorConditions) {
        const ic = snapshot.interiorConditions
        const { error: interiorError } = await supabase
          .from('interior_conditions')
          .upsert({
            assessment_id: supabaseAssessmentId,
            step1: ic.step1 || {},
            step2: ic.step2 || {},
            step3: ic.step3 || {},
            step4: ic.step4 || {},
            current_step: ic.currentStep,
            last_modified: ic.lastModified ? new Date(ic.lastModified).toISOString() : new Date().toISOString(),
          }, {
            onConflict: 'assessment_id'
          })

        if (interiorError) {
          throw interiorError
        }
      }

      // 7. Upload photos (failures warn but do not fail submission)
      let failedPhotoCount = 0
      if (snapshot.photoStore) {
        try {
          const allPhotos = Object.values(snapshot.photoStore.photos || {}) as any[]
          if (allPhotos.length > 0) {
            const photoResult = await PhotoService.uploadAllPhotos({
              photos: allPhotos,
              assessmentId: supabaseAssessmentId,
              userId: user.id,
            })
            failedPhotoCount = photoResult.failed

            // Write upload status back to MST so completed photos are skipped on re-submit
            // and the "skip already uploaded" filter in uploadAllPhotos actually works
            for (const r of photoResult.results) {
              if (r.success) {
                assessment.photoStore.updateUploadStatus(r.photoId, "completed", r.storagePath)
              } else {
                assessment.photoStore.updateUploadStatus(r.photoId, "failed")
              }
            }
          }
        } catch (_photoError) {
          // Non-blocking: photo upload errors do not fail the assessment submission
        }
      }

      return {
        success: true,
        assessmentId: supabaseAssessmentId, // Return the Supabase UUID
        failedPhotoCount,
      }

    } catch (error: any) {
      // Classify failures into three buckets so callers can show actionable messages:
      //
      //   OFFLINE       — network connectivity issue (transient, retry when back online)
      //   AUTH_EXPIRED  — session missing or JWT expired (user must sign in again)
      //   <string>      — any other server-side or unexpected error
      //
      // Keeping these separate is critical: 'Not authenticated' must NOT be
      // treated as OFFLINE. An inspector who has been offline long enough for
      // their refresh token to expire will see "Still Offline" if we collapse
      // them, and will have no idea they need to re-authenticate.
      const msg: string = error.message || ''
      const lc = msg.toLowerCase()

      const isOffline =
        lc.includes('network request failed') ||
        lc.includes('fetch failed') ||
        lc.includes('failed to fetch') ||
        lc.includes('network error')

      const isAuthExpired =
        msg === 'Not authenticated' ||
        lc.includes('jwt expired') ||
        lc.includes('invalid jwt') ||
        lc.includes('token is expired') ||
        lc.includes('refresh_token_not_found')

      return {
        success: false,
        error: isOffline
          ? 'OFFLINE'
          : isAuthExpired
            ? 'AUTH_EXPIRED'
            : msg || 'Failed to submit assessment',
      }
    }
  }

  /**
   * Fetch all assessments for the current user
   */
  static async fetchUserAssessments(): Promise<{
    success: boolean
    assessments?: any[]
    error?: string
  }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        throw new Error('Not authenticated')
      }
      const user = session.user

      const { data, error } = await supabase
        .from('assessments')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          project_summaries (
            project_name,
            project_number,
            property_address,
            inspection_date
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        assessments: data,
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch assessments',
      }
    }
  }

  /**
   * Delete an assessment
   */
  static async deleteAssessment(assessmentId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId)

      if (error) throw error

      return { success: true }

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete assessment',
      }
    }
  }
}

