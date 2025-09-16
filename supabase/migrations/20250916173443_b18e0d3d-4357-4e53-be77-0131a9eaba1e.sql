-- Drop existing conflicting policies and create new core schema
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create profiles table if not exists (merge with existing)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'STUDENT';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS faculty TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS program TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified_student BOOLEAN DEFAULT FALSE;

-- Add constraint for role if not exists
DO $$ 
BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('STUDENT', 'FACULTY_APPROVER', 'COMPANY_HR', 'ADMIN'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hr_owner_uid UUID REFERENCES auth.users(id),
  domain TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  education JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  certificates JSONB DEFAULT '[]',
  work_samples JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  availability TEXT,
  expected_rate DECIMAL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED')),
  portfolio_version INTEGER DEFAULT 1,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  visibility TEXT DEFAULT 'PRIVATE' CHECK (visibility IN ('PRIVATE', 'UNLISTED', 'PUBLIC')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT DEFAULT 'DIRECT' CHECK (source IN ('DIRECT', 'JOBDB', 'LINKEDIN', 'OTHER')),
  company_id UUID REFERENCES public.companies(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  job_type TEXT NOT NULL CHECK (job_type IN ('INTERNSHIP', 'COOP', 'FREELANCE', 'PARTTIME', 'FULLTIME')),
  requirements JSONB DEFAULT '[]',
  budget_or_salary TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'PAUSED', 'CLOSED')),
  hash_key TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_version INTEGER DEFAULT 1,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'HIRED')),
  status_history JSONB DEFAULT '[]',
  offered_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  declined_at TIMESTAMP WITH TIME ZONE,
  start_date DATE,
  is_freelance BOOLEAN DEFAULT FALSE,
  proposal JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Recreate profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'ADMIN');

-- Insert policy for profiles
CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Company policies
CREATE POLICY "Anyone can view companies" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Company HR can manage own company" ON public.companies
  FOR ALL USING (hr_owner_uid = auth.uid());

-- Portfolio policies
CREATE POLICY "Students can manage own portfolio" ON public.portfolios
  FOR ALL USING (student_uid = auth.uid());

CREATE POLICY "Faculty can view submitted portfolios" ON public.portfolios
  FOR SELECT USING (
    status IN ('SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED') AND
    public.get_current_user_role() = 'FACULTY_APPROVER'
  );

CREATE POLICY "Approved portfolios visible to HR" ON public.portfolios
  FOR SELECT USING (
    status = 'APPROVED' AND visibility IN ('PUBLIC', 'UNLISTED') AND
    public.get_current_user_role() = 'COMPANY_HR'
  );

-- Job policies
CREATE POLICY "Anyone can view open jobs" ON public.jobs
  FOR SELECT USING (status = 'OPEN');

CREATE POLICY "Company HR can manage own jobs" ON public.jobs
  FOR ALL USING (
    company_id IN (SELECT id FROM public.companies WHERE hr_owner_uid = auth.uid())
  );

-- Application policies
CREATE POLICY "Students can view own applications" ON public.applications
  FOR SELECT USING (student_uid = auth.uid());

CREATE POLICY "Students can create applications" ON public.applications
  FOR INSERT WITH CHECK (student_uid = auth.uid());

CREATE POLICY "HR can view applications for their jobs" ON public.applications
  FOR SELECT USING (
    job_id IN (
      SELECT j.id FROM public.jobs j 
      JOIN public.companies c ON j.company_id = c.id 
      WHERE c.hr_owner_uid = auth.uid()
    )
  );

CREATE POLICY "HR can update applications for their jobs" ON public.applications
  FOR UPDATE USING (
    job_id IN (
      SELECT j.id FROM public.jobs j 
      JOIN public.companies c ON j.company_id = c.id 
      WHERE c.hr_owner_uid = auth.uid()
    )
  );

-- Create sample data for testing
INSERT INTO public.companies (name, domain, verified) VALUES
  ('SPU Innovation Lab', 'spu.ac.th', true),
  ('Bangkok Tech Startup', NULL, false),
  ('Siam Digital Solutions', 'siamdigital.com', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (title, description, location, job_type, budget_or_salary, company_id)
SELECT 
  'Frontend Developer Intern',
  'Work on React applications and learn modern web development practices. Perfect for Computer Science students.',
  'Bangkok, Thailand',
  'INTERNSHIP',
  '15,000 - 20,000 THB/month',
  id
FROM public.companies WHERE name = 'SPU Innovation Lab'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (title, description, location, job_type, budget_or_salary, company_id)
SELECT 
  'UX/UI Design Freelance',
  'Design mobile app interfaces for e-commerce platform. Portfolio review required.',
  'Remote',
  'FREELANCE',
  '25,000 - 35,000 THB/project',
  id
FROM public.companies WHERE name = 'Bangkok Tech Startup'
ON CONFLICT DO NOTHING;