-- Fix: aggiunge TO authenticated alle policy admin SELECT
-- così anon non le valuta e non chiama has_role()

DROP POLICY IF EXISTS "Admins can view all media" ON public.media_files;

CREATE POLICY "Admins can view all media"
  ON public.media_files
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all recognitions" ON public.recognitions;

CREATE POLICY "Admins can view all recognitions"
  ON public.recognitions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Public can view project-media" ON storage.objects;

CREATE POLICY "Public can view project-media"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-media');
