-- Fix companies table structure and create comprehensive RBAC system
-- Drop existing companies table if it exists and recreate with correct structure
DROP TABLE IF EXISTS public.companies CASCADE;

-- Create companies table with correct structure
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hr_owner_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  contact_email TEXT,
  contact_person_name TEXT,
  contact_person_position TEXT,
  industry TEXT,
  company_size TEXT,
  phone TEXT,
  address TEXT,
  verified BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update jobs table to work with existing structure
DROP TABLE IF EXISTS public.jobs CASCADE;
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_required JSONB DEFAULT '[]'::jsonb,
  job_type TEXT NOT NULL CHECK (job_type IN ('intern', 'part-time', 'full-time', 'contract', 'freelance')),
  salary_min INTEGER,
  salary_max INTEGER,
  location_type TEXT DEFAULT 'onsite' CHECK (location_type IN ('onsite', 'hybrid', 'remote')),
  location_text TEXT,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED', 'PENDING_REVIEW')),
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  deadline_at TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hash_key TEXT,
  budget_or_salary TEXT,
  source TEXT DEFAULT 'DIRECT'
);

-- Update applications table structure
DROP TABLE IF EXISTS public.applications CASCADE;
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'DECLINED', 'REJECTED')),
  cover_letter TEXT,
  proposal JSONB,
  notes JSONB DEFAULT '[]'::jsonb,
  portfolio_version INTEGER DEFAULT 1,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_history JSONB DEFAULT '[]'::jsonb,
  offered_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  declined_at TIMESTAMP WITH TIME ZONE,
  start_date DATE,
  is_freelance BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, student_uid)
);

-- Create job_seekers table (keeping existing structure if it exists)
CREATE TABLE IF NOT EXISTS public.job_seekers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  university TEXT DEFAULT 'Saint Peter University',
  faculty TEXT,
  program TEXT,
  graduation_year INTEGER,
  gpa NUMERIC,
  skills JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  preferred_location TEXT,
  preferred_salary_min INTEGER,
  preferred_salary_max INTEGER,
  availability_start DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create employers table (keeping existing structure if it exists)
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  contact_person_name TEXT,
  contact_person_position TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  verified BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- News and Activities for content management
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  start_at TIMESTAMP WITH TIME ZONE,
  end_at TIMESTAMP WITH TIME ZONE,
  tags JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for tracking important actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User saved jobs
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Company HR can manage own company" ON public.companies
  FOR ALL USING (hr_owner_uid = auth.uid());

CREATE POLICY "Anyone can view companies" ON public.companies
  FOR SELECT USING (true);

-- Jobs policies  
CREATE POLICY "Anyone can view open jobs" ON public.jobs
  FOR SELECT USING (status = 'OPEN');

CREATE POLICY "Company HR can manage own jobs" ON public.jobs
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE hr_owner_uid = auth.uid()
    )
  );

-- Applications policies
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

-- Job seekers policies
CREATE POLICY "Job seekers can view own profile" ON public.job_seekers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Job seekers can insert own profile" ON public.job_seekers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Job seekers can update own profile" ON public.job_seekers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Employers can view approved job seekers" ON public.job_seekers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE user_id = auth.uid() AND verified = true
    )
  );

-- Employers policies
CREATE POLICY "Employers can view own profile" ON public.employers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Employers can insert own profile" ON public.employers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can update own profile" ON public.employers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view verified employers" ON public.employers
  FOR SELECT USING (verified = true);

-- News policies
CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL USING (get_current_user_role() IN ('ADMIN', 'admin'));

-- Activities policies
CREATE POLICY "Public can view published activities" ON public.activities
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage activities" ON public.activities
  FOR ALL USING (get_current_user_role() IN ('ADMIN', 'admin'));

-- Audit logs policies
CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (get_current_user_role() IN ('ADMIN', 'admin'));

-- Saved jobs policies
CREATE POLICY "Users can manage their saved jobs" ON public.saved_jobs
  FOR ALL USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_seekers_updated_at BEFORE UPDATE ON public.job_seekers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON public.employers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_skills_required ON public.jobs USING GIN(skills_required);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_uid ON public.applications(student_uid);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_activities_published ON public.activities(is_published, start_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);