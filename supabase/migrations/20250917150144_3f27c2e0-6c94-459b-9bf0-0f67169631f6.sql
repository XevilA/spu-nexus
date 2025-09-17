-- Fix bookings table RLS policies to use secure function and prevent unauthorized access
-- Drop existing problematic admin policies
DROP POLICY IF EXISTS "bookings_admins_select_all" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admins_update_all" ON public.bookings;

-- Create secure admin policies using the security definer function
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (get_current_user_role() = 'ADMIN');

CREATE POLICY "Admins can update all bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (get_current_user_role() = 'ADMIN');

-- Add missing DELETE policy to prevent unauthorized data deletion
CREATE POLICY "Users can delete own bookings" 
ON public.bookings 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any booking" 
ON public.bookings 
FOR DELETE 
TO authenticated
USING (get_current_user_role() = 'ADMIN');

-- Ensure the existing user policies are using proper constraints
-- Update the existing policies to be more explicit about user ownership
DROP POLICY IF EXISTS "bookings_authenticated_users_select_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_authenticated_users_update_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_authenticated_users_insert_own" ON public.bookings;

-- Recreate user policies with explicit constraints
CREATE POLICY "Users can view own bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update own bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can create own bookings" 
ON public.bookings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);