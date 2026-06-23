
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL,
  guest_location text,
  rating integer NOT NULL DEFAULT 5,
  quote_ro text,
  quote_en text,
  source text,
  source_url text,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active testimonials"
  ON public.testimonials FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER testimonials_set_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.testimonials (guest_name, guest_location, rating, quote_ro, quote_en, source, is_active, sort_order) VALUES
  ('Ioana M.', 'București', 5,
    'Cel mai liniștit somn din ultimele luni. Simplu, cald, iar cafeaua de dimineață a fost excepțională.',
    'The most restful sleep I''ve had in months. Simple, warm, and the morning coffee was exceptional.',
    'Google', true, 0),
  ('Marco R.', 'Milano', 5,
    'Am ajuns la centrul vechi în 6 minute pe jos. Personalul a fost cu adevărat amabil — ne-am simțit ca în vizită la prieteni.',
    'We reached the old town in 6 minutes on foot. The staff were truly kind — we felt like we were visiting friends.',
    'Google', true, 1),
  ('Sophie L.', 'Paris', 5,
    'Camera cu vedere la munte merită fiecare euro. Ne întoarcem cu siguranță în toamnă.',
    'The mountain view room is worth every euro. We''ll definitely be back in the autumn.',
    'Google', true, 2);
