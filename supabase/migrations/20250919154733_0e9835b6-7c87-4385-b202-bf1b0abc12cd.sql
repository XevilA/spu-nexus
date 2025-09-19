-- Create comprehensive RBAC system for SPU Smart Job Platform
-- Users table enhancement for proper role management
CREATE TYPE user_role AS ENUM ('guest', 'user', 'student', 'biz', 'admin', 'super_admin');

-- Enhanced profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS university TEXT DEFAULT 'Saint Peter University',
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_links JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS verified_student BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Companies table for business users
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
  approved BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table with comprehensive features
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_required JSONB DEFAULT '[]'::jsonb,
  job_type TEXT NOT NULL CHECK (job_type IN ('intern', 'part-time', 'full-time', 'contract', 'freelance')),
  salary_min INTEGER,
  salary_max INTEGER,
  location_type TEXT DEFAULT 'onsite' CHECK (location_type IN ('onsite', 'hybrid', 'remote')),
  location_text TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'closed')),
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  application_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  posted_at TIMESTAMP WITH TIME ZONE
);

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'reviewing', 'interview', 'hired', 'rejected')),
  cover_letter TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  resume_url TEXT,
  portfolio_version INTEGER DEFAULT 1,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_user_id)
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
  author_id UUID NOT NULL REFERENCES public.profiles(id),
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
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for tracking important actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id),
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
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Updated profile policies for new role system
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- Companies policies
CREATE POLICY "Company owners can manage their company" ON public.companies
  FOR ALL USING (owner_user_id = auth.uid());

CREATE POLICY "Public can view approved companies" ON public.companies
  FOR SELECT USING (approved = true);

CREATE POLICY "Admins can manage all companies" ON public.companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- Jobs policies
CREATE POLICY "Public can view published jobs" ON public.jobs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Company owners can manage their jobs" ON public.jobs
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all jobs" ON public.jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- Applications policies
CREATE POLICY "Users can view their own applications" ON public.applications
  FOR SELECT USING (applicant_user_id = auth.uid());

CREATE POLICY "Company owners can view applications for their jobs" ON public.applications
  FOR SELECT USING (
    job_id IN (
      SELECT j.id FROM public.jobs j
      JOIN public.companies c ON j.company_id = c.id
      WHERE c.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create applications" ON public.applications
  FOR INSERT WITH CHECK (applicant_user_id = auth.uid());

CREATE POLICY "Company owners can update application status" ON public.applications
  FOR UPDATE USING (
    job_id IN (
      SELECT j.id FROM public.jobs j
      JOIN public.companies c ON j.company_id = c.id
      WHERE c.owner_user_id = auth.uid()
    )
  );

-- News policies
CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- Activities policies
CREATE POLICY "Public can view published activities" ON public.activities
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage activities" ON public.activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

-- Audit logs policies
CREATE POLICY "Super admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Saved jobs policies
CREATE POLICY "Users can manage their saved jobs" ON public.saved_jobs
  FOR ALL USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_skills_required ON public.jobs USING GIN(skills_required);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_user_id ON public.applications(applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_activities_published ON public.activities(is_published, start_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);

-- Update the handle_new_user function for proper role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_val user_role := 'user';
BEGIN
  -- Check if user email is in admin whitelist
  IF EXISTS (
    SELECT 1 FROM public.admin_whitelist 
    WHERE email = NEW.email AND active = true
  ) THEN
    user_role_val := 'admin';
  END IF;

  -- Insert profile with appropriate role
  INSERT INTO public.profiles (
    id, email, first_name, last_name, avatar_url, role, 
    university, is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url',
    user_role_val,
    COALESCE(NEW.raw_user_meta_data->>'university', 'Saint Peter University'),
    true
  );
  
  RETURN NEW;
END;
$$;