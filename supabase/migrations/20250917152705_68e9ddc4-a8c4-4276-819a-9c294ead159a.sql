-- Create admin user with email/password authentication
-- First, let's create the admin user directly in auth.users (this will be handled by Supabase Auth)
-- We'll create a function to handle admin user creation

-- Add the admin user to the admin whitelist first
INSERT INTO public.admin_whitelist (email, description, active)
VALUES ('arsenal@admin.local', 'System Administrator - Arsenal', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Create a function to create admin profiles after signup
CREATE OR REPLACE FUNCTION public.create_admin_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This will be called after the admin user signs up
  -- The trigger will automatically create the profile
  NULL;
END;
$$;