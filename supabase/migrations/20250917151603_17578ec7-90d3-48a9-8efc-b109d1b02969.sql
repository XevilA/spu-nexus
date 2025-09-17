-- Fix contact_info security vulnerability
-- Remove dangerous public access policies that expose sensitive information

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read access to contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Public read for contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Allow admin full access to contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Admin manage contact_info" ON public.contact_info;

-- Create secure admin policies using proper security definer function
CREATE POLICY "Admins can manage contact info" 
ON public.contact_info 
FOR ALL 
TO authenticated
USING (get_current_user_role() = 'ADMIN')
WITH CHECK (get_current_user_role() = 'ADMIN');

-- Create a secure public view that only exposes non-sensitive information
CREATE OR REPLACE VIEW public.public_contact_info AS
SELECT 
    id,
    working_hours,
    facebook_url,
    instagram_url,
    map_embed_url,
    created_at,
    updated_at
FROM public.contact_info;

-- Allow public read access to the secure view only (not direct table access)
-- Note: Views don't use RLS, but they provide controlled data exposure

-- For any legitimate public API access, create a security definer function
CREATE OR REPLACE FUNCTION public.get_public_contact_info()
RETURNS TABLE (
    id uuid,
    working_hours text,
    facebook_url text,
    instagram_url text,
    map_embed_url text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
    SELECT 
        id,
        working_hours,
        facebook_url,
        instagram_url,
        map_embed_url
    FROM public.contact_info
    LIMIT 1;
$$;

-- Grant access to the function and view
GRANT EXECUTE ON FUNCTION public.get_public_contact_info() TO anon, authenticated;
GRANT SELECT ON public.public_contact_info TO anon, authenticated;