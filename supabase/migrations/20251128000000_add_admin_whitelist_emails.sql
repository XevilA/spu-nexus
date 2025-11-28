-- Add admin emails to whitelist
-- This migration adds the specified admin emails to the admin_whitelist table

-- Insert admin emails if they don't already exist
INSERT INTO public.admin_whitelist (email, description, active)
VALUES
  ('dev@dotmini.in.th', 'Primary system administrator', true),
  ('tirawatnantamas@gmail.com', 'System administrator', true)
ON CONFLICT (email)
DO UPDATE SET
  active = true,
  description = EXCLUDED.description;

-- Add comment
COMMENT ON TABLE public.admin_whitelist IS 'Whitelist of authorized admin email addresses';
