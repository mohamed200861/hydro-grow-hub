-- 1) Revoke EXECUTE on has_role from public/anon. Keep it for authenticated and service_role
-- because RLS policies on media_files/recognitions call has_role() during query evaluation
-- under the caller's role privileges.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 2) Restrict storage object listing for the public 'project-media' bucket.
-- Direct file URLs continue to work (public bucket), but the Storage API list()
-- endpoint will only return objects to admins. This prevents enumeration of
-- unpublished or in-progress files.
DROP POLICY IF EXISTS "Public read access for project-media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project-media" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to project-media" ON storage.objects;

CREATE POLICY "Admins can list project-media objects"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can upload to project-media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update project-media objects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete project-media objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);