-- ============================================
-- PCA Mobile App - Database Schema
-- ============================================
-- Copy this entire file and paste into Supabase SQL Editor
-- Then click "Run" to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ASSESSMENTS TABLE (Master record)
-- ============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Status tracking
  status TEXT CHECK (status IN ('draft', 'submitted', 'synced')) DEFAULT 'draft',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Optional metadata
  device_info JSONB,
  app_version TEXT,
  
  -- For reconciliation with local MST store
  local_id TEXT UNIQUE
);

-- ============================================
-- 2. PROJECT_SUMMARIES TABLE (Form 1)
-- ============================================
CREATE TABLE project_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- STEP 1: Project Information
  project_name TEXT,
  project_number TEXT,
  property_address TEXT,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  weather TEXT,
  temperature NUMERIC,
  inspection_date TIMESTAMPTZ,
  inspection_time TEXT,
  inspector_name TEXT,
  inspector_number TEXT,
  surrounding_properties TEXT,
  
  -- STEP 2: Property Details
  acreage NUMERIC,
  number_sign_down INTEGER,
  year_renovated INTEGER,
  number_of_buildings INTEGER,
  net_sq_ft NUMERIC,
  number_of_units INTEGER,
  gsf NUMERIC,
  number_of_vacant_units INTEGER,
  year_built INTEGER,
  lease_type TEXT,
  recent_capital_improvements TEXT,
  
  -- STEP 3: Complex data as JSONB
  documents JSONB DEFAULT '{}',
  personnel_interviewed JSONB DEFAULT '[]',
  commercial_tenants JSONB DEFAULT '[]',
  
  -- STEP 4: Utilities & Materials
  problematic_materials JSONB DEFAULT '{}',
  domestic_water TEXT,
  domestic_sewage TEXT,
  storm_water_drainage TEXT,
  electricity TEXT,
  natural_gas TEXT,
  heating_oil TEXT,
  propane TEXT,
  well_system TEXT,
  septic_system TEXT,
  wastewater_treatment_plant TEXT,
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  last_modified TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. SITE_GROUNDS TABLE (Form 2)
-- ============================================
CREATE TABLE site_grounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Each step stored as JSONB for flexibility
  step1 JSONB DEFAULT '{}',
  step2 JSONB DEFAULT '{}',
  step3 JSONB DEFAULT '{}',
  step4 JSONB DEFAULT '{}',
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  last_modified TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. BUILDING_ENVELOPE TABLE (Form 3)
-- ============================================
CREATE TABLE building_envelope (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Each step stored as JSONB for flexibility (10 steps)
  step1 JSONB DEFAULT '{}',
  step2 JSONB DEFAULT '{}',
  step3 JSONB DEFAULT '{}',
  step4 JSONB DEFAULT '{}',
  step5 JSONB DEFAULT '{}',
  step6 JSONB DEFAULT '{}',
  step7 JSONB DEFAULT '{}',
  step8 JSONB DEFAULT '{}',
  step9 JSONB DEFAULT '{}',
  step10 JSONB DEFAULT '{}',
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  last_modified TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. MECHANICAL_SYSTEMS TABLE (Form 4)
-- ============================================
CREATE TABLE mechanical_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Each step stored as JSONB for flexibility (9 steps)
  step1 JSONB DEFAULT '{}',
  step2 JSONB DEFAULT '{}',
  step3 JSONB DEFAULT '{}',
  step4 JSONB DEFAULT '{}',
  step5 JSONB DEFAULT '{}',
  step6 JSONB DEFAULT '{}',
  step7 JSONB DEFAULT '{}',
  step8 JSONB DEFAULT '{}',
  step9 JSONB DEFAULT '{}',
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  last_modified TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. PHOTOS TABLE
-- ============================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Photo context
  form_type TEXT,
  form_step INTEGER,
  field_name TEXT,
  
  -- Storage location
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  
  -- File metadata
  filename TEXT,
  mime_type TEXT,
  file_size BIGINT,
  width INTEGER,
  height INTEGER,
  
  -- Upload tracking
  upload_status TEXT CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')) DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ,
  
  -- Photo metadata
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  latitude NUMERIC,
  longitude NUMERIC,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_local_id ON assessments(local_id);
CREATE INDEX idx_project_summaries_assessment_id ON project_summaries(assessment_id);
CREATE INDEX idx_site_grounds_assessment_id ON site_grounds(assessment_id);
CREATE INDEX idx_building_envelope_assessment_id ON building_envelope(assessment_id);
CREATE INDEX idx_mechanical_systems_assessment_id ON mechanical_systems(assessment_id);
CREATE INDEX idx_photos_assessment_id ON photos(assessment_id);
CREATE INDEX idx_photos_upload_status ON photos(upload_status);

-- ============================================
-- 8. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_grounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_envelope ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanical_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS POLICIES - Users can only access their own data
-- ============================================

-- ASSESSMENTS POLICIES
CREATE POLICY "Users can view own assessments" 
  ON assessments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" 
  ON assessments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" 
  ON assessments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" 
  ON assessments FOR DELETE 
  USING (auth.uid() = user_id);

-- PROJECT_SUMMARIES POLICIES
CREATE POLICY "Users can view own project_summaries" 
  ON project_summaries FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = project_summaries.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own project_summaries" 
  ON project_summaries FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = project_summaries.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own project_summaries" 
  ON project_summaries FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = project_summaries.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own project_summaries" 
  ON project_summaries FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = project_summaries.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

-- SITE_GROUNDS POLICIES
CREATE POLICY "Users can view own site_grounds" 
  ON site_grounds FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = site_grounds.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own site_grounds" 
  ON site_grounds FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = site_grounds.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own site_grounds" 
  ON site_grounds FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = site_grounds.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own site_grounds" 
  ON site_grounds FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = site_grounds.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

-- BUILDING_ENVELOPE POLICIES
CREATE POLICY "Users can view own building_envelope" 
  ON building_envelope FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = building_envelope.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own building_envelope" 
  ON building_envelope FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = building_envelope.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own building_envelope" 
  ON building_envelope FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = building_envelope.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own building_envelope" 
  ON building_envelope FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = building_envelope.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

-- MECHANICAL_SYSTEMS POLICIES
CREATE POLICY "Users can view own mechanical_systems" 
  ON mechanical_systems FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = mechanical_systems.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own mechanical_systems" 
  ON mechanical_systems FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = mechanical_systems.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own mechanical_systems" 
  ON mechanical_systems FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = mechanical_systems.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own mechanical_systems" 
  ON mechanical_systems FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = mechanical_systems.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

-- PHOTOS POLICIES
CREATE POLICY "Users can view own photos" 
  ON photos FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" 
  ON photos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" 
  ON photos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" 
  ON photos FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 10. AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at 
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_summaries_updated_at 
  BEFORE UPDATE ON project_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_grounds_updated_at 
  BEFORE UPDATE ON site_grounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_building_envelope_updated_at 
  BEFORE UPDATE ON building_envelope
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mechanical_systems_updated_at 
  BEFORE UPDATE ON mechanical_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at 
  BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE! Your database is ready.
-- ============================================

