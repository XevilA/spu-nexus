-- Modify the handle_new_user function to check admin whitelist and assign ADMIN role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text := 'user';
BEGIN
  -- Check if user email is in admin whitelist
  IF EXISTS (
    SELECT 1 FROM public.admin_whitelist 
    WHERE email = NEW.email AND active = true
  ) THEN
    user_role := 'ADMIN';
  END IF;

  -- Insert profile with appropriate role
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url',
    user_role
  );
  
  RETURN NEW;
END;
$$;