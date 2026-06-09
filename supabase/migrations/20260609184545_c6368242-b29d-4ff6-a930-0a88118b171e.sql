
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(coalesce(NEW.email, ''));
  v_requested public.app_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'contributor');
  v_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    TRIM(CONCAT(NEW.raw_user_meta_data ->> 'first_name', ' ', NEW.raw_user_meta_data ->> 'last_name'))
  ) ON CONFLICT (id) DO NOTHING;

  IF v_email IN ('admin@gmail.com') THEN
    v_role := 'admin';
  ELSE
    v_role := v_requested;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;
