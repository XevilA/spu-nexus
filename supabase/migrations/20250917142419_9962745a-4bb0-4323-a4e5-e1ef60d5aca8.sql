-- Fix critical security vulnerability in profiles table
-- Remove dangerous public access policies

-- Drop the overly permissive policies that allow public access
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;

-- Clean up duplicate policies (keeping the most restrictive ones)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Ensure we have secure, properly named policies
CREATE POLICY "profiles_authenticated_users_select_own" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "profiles_authenticated_users_insert_own" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_authenticated_users_update_own" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Keep admin access policy but make it more secure
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "profiles_admins_select_all" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "profiles_admins_update_all" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  )
);

-- Ensure no DELETE policies exist (profiles should never be deleted)
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;