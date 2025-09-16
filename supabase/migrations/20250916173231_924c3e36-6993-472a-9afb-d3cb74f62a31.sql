-- Create core SPU U2B database schema

-- Users/Profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'FACULTY_APPROVER', 'COMPANY_HR', 'ADMIN')),
  faculty TEXT,
  program TEXT,
  year INTEGER,
  verified_student BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
  type TEXT NOT NULL CHECK (type IN ('INTERNSHIP', 'COOP', 'FREELANCE', 'PARTTIME', 'FULLTIME')),
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

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- RLS Policies for companies
CREATE POLICY "Anyone can view companies" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Company HR can manage own company" ON public.companies
  FOR ALL USING (hr_owner_uid = auth.uid());

-- RLS Policies for portfolios
CREATE POLICY "Students can manage own portfolio" ON public.portfolios
  FOR ALL USING (student_uid = auth.uid());

CREATE POLICY "Faculty can view submitted portfolios" ON public.portfolios
  FOR SELECT USING (
    status IN ('SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED') AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'FACULTY_APPROVER')
  );

CREATE POLICY "Approved portfolios visible to HR" ON public.portfolios
  FOR SELECT USING (
    status = 'APPROVED' AND visibility IN ('PUBLIC', 'UNLISTED') AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'COMPANY_HR')
  );

-- RLS Policies for jobs
CREATE POLICY "Anyone can view open jobs" ON public.jobs
  FOR SELECT USING (status = 'OPEN');

CREATE POLICY "Company HR can manage own jobs" ON public.jobs
  FOR ALL USING (
    company_id IN (SELECT id FROM public.companies WHERE hr_owner_uid = auth.uid())
  );

-- RLS Policies for applications
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

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, faculty, program)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT'),
    NEW.raw_user_meta_data->>'faculty',
    NEW.raw_user_meta_data->>'program'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();