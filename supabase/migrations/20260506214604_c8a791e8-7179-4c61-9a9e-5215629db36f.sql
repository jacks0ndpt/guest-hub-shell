
-- Contact messages from public contact form
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- new, read, replied, archived
  reply_text TEXT,
  replied_at TIMESTAMPTZ,
  replied_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT TO public WITH CHECK (status = 'new' AND replied_at IS NULL);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_contact_messages_updated BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Offers
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  perks TEXT[] DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active offers" ON public.offers
  FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage offers" ON public.offers
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Gallery images (admin-managed)
CREATE TABLE public.site_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt TEXT,
  category TEXT NOT NULL DEFAULT 'rooms',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active gallery" ON public.site_gallery
  FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage gallery" ON public.site_gallery
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- Toggle for offers page + hero image url stored in property_settings
ALTER TABLE public.property_settings
  ADD COLUMN IF NOT EXISTS offers_page_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Storage bucket for site images (hero, gallery, offers)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read site-images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'site-images');
CREATE POLICY "Authenticated can upload site-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');
CREATE POLICY "Authenticated can update site-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images');
CREATE POLICY "Authenticated can delete site-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images');

-- Allow authenticated users to also manage room-images bucket fully
CREATE POLICY "Authenticated can update room-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'room-images');
CREATE POLICY "Authenticated can delete room-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'room-images');
