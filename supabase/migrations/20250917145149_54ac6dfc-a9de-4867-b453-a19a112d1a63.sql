-- Add new columns to portfolios table for enhanced work preferences
ALTER TABLE public.portfolios 
ADD COLUMN work_types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN locations JSONB DEFAULT '[]'::jsonb,  
ADD COLUMN freelance_rate NUMERIC;