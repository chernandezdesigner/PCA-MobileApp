-- ============================================
-- PCA Mobile App - Migration: Add Forms 3 & 4
-- ============================================
-- Run this in Supabase SQL Editor to add the new tables
-- This is safe to run even if you already have other tables
-- ============================================

-- ============================================
-- 1. BUILDING_ENVELOPE TABLE (Form 3)
-- ============================================
CREATE TABLE IF NOT EXISTS building_envelope (
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
-- 2. MECHANICAL_SYSTEMS TABLE (Form 4)
-- ============================================
CREATE TABLE IF NOT EXISTS mechanical_systems (
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
-- 3. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_building_envelope_assessment_id ON building_envelope(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mechanical_systems_assessment_id ON mechanical_systems(assessment_id);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE building_envelope ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanical_systems ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. RLS POLICIES - Building Envelope
-- ============================================
DO $$ 
BEGIN
  -- Drop existing policies if they exist (safe re-run)
  DROP POLICY IF EXISTS "Users can view own building_envelope" ON building_envelope;
  DROP POLICY IF EXISTS "Users can insert own building_envelope" ON building_envelope;
  DROP POLICY IF EXISTS "Users can update own building_envelope" ON building_envelope;
  DROP POLICY IF EXISTS "Users can delete own building_envelope" ON building_envelope;
END $$;

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

-- ============================================
-- 6. RLS POLICIES - Mechanical Systems
-- ============================================
DO $$ 
BEGIN
  -- Drop existing policies if they exist (safe re-run)
  DROP POLICY IF EXISTS "Users can view own mechanical_systems" ON mechanical_systems;
  DROP POLICY IF EXISTS "Users can insert own mechanical_systems" ON mechanical_systems;
  DROP POLICY IF EXISTS "Users can update own mechanical_systems" ON mechanical_systems;
  DROP POLICY IF EXISTS "Users can delete own mechanical_systems" ON mechanical_systems;
END $$;

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

-- ============================================
-- 7. AUTO-UPDATE TIMESTAMPS (if function exists)
-- ============================================
-- Note: The update_updated_at_column function should already exist
-- from your initial schema. These triggers use it.

DO $$
BEGIN
  -- Only create trigger if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_building_envelope_updated_at'
  ) THEN
    CREATE TRIGGER update_building_envelope_updated_at 
      BEFORE UPDATE ON building_envelope
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_mechanical_systems_updated_at'
  ) THEN
    CREATE TRIGGER update_mechanical_systems_updated_at 
      BEFORE UPDATE ON mechanical_systems
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================
-- DONE! Forms 3 & 4 tables are ready.
-- ============================================
-- You should now see these tables in your Supabase dashboard:
-- - building_envelope
-- - mechanical_systems
-- ============================================
