-- 1) Block all writes to user_roles from non-service-role principals.
-- Combined with existing permissive SELECT policies, this prevents privilege escalation:
-- authenticated users cannot insert/update/delete rows in user_roles.
-- Role assignment must happen via service_role (server-side admin code) only.
CREATE POLICY "Block all inserts from clients"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block all updates from clients"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block all deletes from clients"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- 2) Remove hardcoded admin email from the new-user trigger.
-- Admin assignment is no longer tied to a specific email string.
-- New users default to the 'user' role; admins are provisioned manually.
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$;