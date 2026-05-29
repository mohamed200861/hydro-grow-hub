-- Reset admin password, confirm email, ensure admin role
UPDATE auth.users
SET encrypted_password = crypt('mohamed 2009', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'ashmawi.2009@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'ashmawi.2009@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;