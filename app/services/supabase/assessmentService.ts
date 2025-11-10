import { supabase } from './client'
import { getSnapshot } from 'mobx-state-tree'
import type { AssessmentInstance } from '@/models/Assessment'

/**
 * Service for submitting assessments to Supabase
 */
export class AssessmentService {
  /**
   * Submit an assessment to Supabase
   * Saves assessment, project_summaries, and site_grounds data
   */
  static async submitAssessment(assessment: AssessmentInstance): Promise<{
    success: boolean
    error?: string
    assessmentId?: string
  }> {
    try {
      console.log('📤 Starting assessment submission...')

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Not authenticated')
      }

      // Get assessment snapshot
      const snapshot = getSnapshot(assessment)
      console.log('📋 Assessment snapshot:', snapshot.id)

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
        console.error('❌ Assessment insert error:', assessmentError)
        throw assessmentError
      }

      console.log('✅ Assessment record saved')
      console.log('   📝 Local ID:', snapshot.id)
      console.log('   🆔 Supabase UUID:', assessmentData.id)

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
            inspection_date: new Date(ps.inspectionDate).toISOString(),
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
            last_modified: new Date(ps.lastModified).toISOString(),
          }, {
            onConflict: 'assessment_id' // Upsert based on assessment_id (which is UNIQUE)
          })

        if (projectError) {
          console.error('❌ Project summary error:', projectError)
          throw projectError
        }

        console.log('✅ Project summary saved')
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
            last_modified: new Date(sg.lastModified).toISOString(),
          }, {
            onConflict: 'assessment_id' // Upsert based on assessment_id (which is UNIQUE)
          })

        if (siteError) {
          console.error('❌ Site grounds error:', siteError)
          throw siteError
        }

        console.log('✅ Site grounds saved')
      }

      console.log('🎉 Assessment submitted successfully!')

      return {
        success: true,
        assessmentId: supabaseAssessmentId, // Return the Supabase UUID
      }

    } catch (error: any) {
      console.error('❌ Submission error:', error)
      return {
        success: false,
        error: error.message || 'Failed to submit assessment',
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
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          project_summaries (*),
          site_grounds (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        assessments: data,
      }

    } catch (error: any) {
      console.error('❌ Fetch error:', error)
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

      console.log('✅ Assessment deleted')

      return { success: true }

    } catch (error: any) {
      console.error('❌ Delete error:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete assessment',
      }
    }
  }
}

