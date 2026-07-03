
-- Phase B2: amenities table + homepage featured selectors

CREATE TABLE IF NOT EXISTS public.amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_key text NOT NULL DEFAULT 'sparkles',
  label_ro text NOT NULL,
  label_en text,
  description_ro text,
  description_en text,
  is_active boolean NOT NULL DEFAULT true,
  show_on_homepage boolean NOT NULL DEFAULT true,
  show_on_room_pages boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.amenities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.amenities TO authenticated;
GRANT ALL ON public.amenities TO service_role;

ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active amenities"
  ON public.amenities FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage amenities"
  ON public.amenities FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER amenities_set_updated_at
  BEFORE UPDATE ON public.amenities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed defaults
INSERT INTO public.amenities (icon_key, label_ro, label_en, description_ro, description_en, sort_order) VALUES
  ('coffee','Mic dejun inclus','Breakfast included','Servit zilnic, 07:30–10:30.','Served daily, 07:30–10:30.',0),
  ('parking','Parcare gratuită','Free parking','Loc rezervat la sosire.','Reserved spot on arrival.',1),
  ('wifi','Wi-Fi rapid','Fast Wi-Fi','Stabil în toată proprietatea.','Stable across the property.',2),
  ('clock','Recepție 24/7','24/7 reception','Suntem mereu aici pentru tine.','We are always here for you.',3),
  ('sparkles','Camere pentru nefumători','Non-smoking rooms','Aer curat în întreaga clădire.','Clean air throughout the building.',4),
  ('check-circle','Depozitare bagaje','Luggage storage','Înainte de check-in și după check-out.','Before check-in and after check-out.',5),
  ('shield','Seif în cameră','In-room safe','Pentru valorile tale.','For your valuables.',6),
  ('map-pin','Aproape de centrul vechi','Near the old town','La 6 minute de mers pe jos.','A 6-minute walk away.',7);

-- Featured selectors on property_settings
ALTER TABLE public.property_settings
  ADD COLUMN IF NOT EXISTS home_featured_rooms jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS home_featured_offers jsonb NOT NULL DEFAULT '[]'::jsonb;
