-- Fix security vulnerability in bookings table
-- Ensure no public access to sensitive customer data

-- First, let's check and remove any potential public access policies
DROP POLICY IF EXISTS "bookings_public_select" ON public.bookings;
DROP POLICY IF EXISTS "bookings_public_read" ON public.bookings;
DROP POLICY IF EXISTS "public_bookings_select" ON public.bookings;

-- Ensure RLS is enabled (it should be already, but let's be explicit)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Clean up and recreate secure policies with clear naming
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;  
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;

-- Create secure policies for bookings
CREATE POLICY "bookings_authenticated_users_select_own" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "bookings_authenticated_users_insert_own" 
ON public.bookings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_authenticated_users_update_own" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Admin policies for booking management
CREATE POLICY "bookings_admins_select_all" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  )
);

CREATE POLICY "bookings_admins_update_all" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  )
);

-- Ensure no DELETE policies exist for audit trail purposes
-- Bookings should never be deleted, only cancelled/updated

-- Add a comment to document the security model
COMMENT ON TABLE public.bookings IS 'Contains sensitive customer data. Access restricted to booking owners and admins only. No public access allowed.';