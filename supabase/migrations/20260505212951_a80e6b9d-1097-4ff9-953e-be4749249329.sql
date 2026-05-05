
-- site_content table
CREATE TABLE IF NOT EXISTS public.site_content (
  section_key text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site content"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_content_set_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default sections
INSERT INTO public.site_content (section_key, content) VALUES
  ('hero', '{"eyebrow":"","title_line1":"A warm stay between the","title_line2":"mountains and the old town.","subtitle":"","primary_cta_label":"Book Direct","secondary_cta_label":"Explore Rooms"}'::jsonb),
  ('about', '{"eyebrow":"About","title":"24 quiet rooms. One honest kind of hospitality.","paragraph1":"We''re a small boutique hotel a few minutes from Brașov''s old town — built around the idea that a good stay is simple: a quiet room, good coffee, and people who actually know the city.","paragraph2":"No filler, no theatrics. Just the details that matter, done well — from your arrival to your last morning."}'::jsonb),
  ('amenities', '{"eyebrow":"Amenities","title":"Everything you need. Nothing you don''t."}'::jsonb),
  ('location', '{"eyebrow":"Location","title":"Steps from Brașov old town.","description":"6 minutes to Piața Sfatului on foot, 20 minutes to Poiana Brașov ski slopes by car, and the Carpathian ridge visible from most of our rooms."}'::jsonb),
  ('contact', '{"eyebrow":"Say hello","title":"We''re always happy to help.","description":"Have a question about your stay, a special request, or need a recommendation in Brașov? Reach us any way you like."}'::jsonb),
  ('footer', '{"tagline":"A 24-room boutique hotel — calm rooms, honest service, and everything you need a tap away."}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Storage bucket for room images
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-images', 'room-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view room images"
ON storage.objects FOR SELECT
USING (bucket_id = 'room-images');

CREATE POLICY "Admins can upload room images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'room-images' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update room images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'room-images' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete room images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'room-images' AND private.has_role(auth.uid(), 'admin'::app_role));
