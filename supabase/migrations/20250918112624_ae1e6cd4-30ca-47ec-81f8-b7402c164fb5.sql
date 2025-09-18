-- Update edge function to handle general questions
-- This adds support for general AI questions in addition to job recommendations and portfolio improvement

-- Create table for job seekers if not exists
CREATE TABLE IF NOT EXISTS public.job_seekers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  university TEXT DEFAULT 'Saint Peter University',
  faculty TEXT,
  program TEXT,
  graduation_year INTEGER,
  gpa DECIMAL(3,2),
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  preferred_location TEXT,
  preferred_salary_min INTEGER,
  preferred_salary_max INTEGER,
  availability_start DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for employers if not exists  
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  company_name TEXT NOT NULL,
  company_description TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  contact_person_name TEXT,
  contact_person_position TEXT,
  verified BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_seekers
CREATE POLICY "Job seekers can view own profile" 
ON public.job_seekers 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Job seekers can update own profile" 
ON public.job_seekers 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Job seekers can insert own profile" 
ON public.job_seekers 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can view approved job seekers" 
ON public.job_seekers 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.employers 
  WHERE user_id = auth.uid() AND verified = true
));

-- RLS Policies for employers
CREATE POLICY "Employers can view own profile" 
ON public.employers 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Employers can update own profile" 
ON public.employers 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Employers can insert own profile" 
ON public.employers 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view verified employers" 
ON public.employers 
FOR SELECT 
USING (verified = true);

-- Add triggers for updated_at
CREATE TRIGGER update_job_seekers_updated_at
BEFORE UPDATE ON public.job_seekers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employers_updated_at
BEFORE UPDATE ON public.employers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();