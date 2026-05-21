-- Recognitions table for the "Riconoscimenti" page
CREATE TABLE public.recognitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recognitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published recognitions"
  ON public.recognitions FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all recognitions"
  ON public.recognitions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert recognitions"
  ON public.recognitions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update recognitions"
  ON public.recognitions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete recognitions"
  ON public.recognitions FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER recognitions_set_updated_at
  BEFORE UPDATE ON public.recognitions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();