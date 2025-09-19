-- Clean up existing policies and create fresh ones
-- Drop all existing policies that might conflict
DROP POLICY IF EXISTS "Job seekers can view own profile" ON public.job_seekers;
DROP POLICY IF EXISTS "Job seekers can insert own profile" ON public.job_seekers;
DROP POLICY IF EXISTS "Job seekers can update own profile" ON public.job_seekers;
DROP POLICY IF EXISTS "Employers can view approved job seekers" ON public.job_seekers;
DROP POLICY IF EXISTS "Employers can view own profile" ON public.employers;  
DROP POLICY IF EXISTS "Employers can insert own profile" ON public.employers;
DROP POLICY IF EXISTS "Employers can update own profile" ON public.employers;
DROP POLICY IF EXISTS "Anyone can view verified employers" ON public.employers;

-- Recreate job_seekers policies
CREATE POLICY "job_seekers_select_own" ON public.job_seekers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "job_seekers_insert_own" ON public.job_seekers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "job_seekers_update_own" ON public.job_seekers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "employers_view_verified_job_seekers" ON public.job_seekers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE user_id = auth.uid() AND verified = true
    )
  );

-- Recreate employers policies
CREATE POLICY "employers_select_own" ON public.employers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "employers_insert_own" ON public.employers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "employers_update_own" ON public.employers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "public_view_verified_employers" ON public.employers
  FOR SELECT USING (verified = true);

-- Add missing policies for news and activities  
DROP POLICY IF EXISTS "Public can view published news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;
DROP POLICY IF EXISTS "Public can view published activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can manage activities" ON public.activities;

CREATE POLICY "news_public_select" ON public.news
  FOR SELECT USING (is_published = true);

CREATE POLICY "news_admin_all" ON public.news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('ADMIN', 'admin')
    )
  );

CREATE POLICY "activities_public_select" ON public.activities
  FOR SELECT USING (is_published = true);

CREATE POLICY "activities_admin_all" ON public.activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('ADMIN', 'admin')
    )
  );

-- Add missing indexes and ensure triggers work
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_seekers_user_id ON public.job_seekers(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_employers_user_id ON public.employers(user_id);
CREATE INDEX IF NOT EXISTS idx_job_seekers_skills ON public.job_seekers USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_employers_verified ON public.employers(verified);

-- Ensure all tables have proper RLS enabled
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;