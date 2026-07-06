
-- ── 1. Fix RLS on amenities: use schema-qualified private.has_role ──────────
DROP POLICY IF EXISTS "Admins manage amenities" ON public.amenities;
DROP POLICY IF EXISTS "Public can read active amenities" ON public.amenities;

CREATE POLICY "Public can read active amenities"
ON public.amenities
FOR SELECT
USING (is_active = true OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage amenities"
ON public.amenities
FOR ALL
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- ── 2. Fix RLS on testimonials: use schema-qualified private.has_role ─────
DROP POLICY IF EXISTS "Public can read active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;

CREATE POLICY "Public can read active testimonials"
ON public.testimonials
FOR SELECT
USING (is_active = true OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ── 3. Bilingual translations for demo service categories ─────────────────
UPDATE public.service_categories SET name_ro = 'Menaj',        name_en = 'Housekeeping' WHERE name = 'Housekeeping';
UPDATE public.service_categories SET name_ro = 'Recepție',     name_en = 'Reception'    WHERE name = 'Reception';
UPDATE public.service_categories SET name_ro = 'Servicii extra', name_en = 'Paid Extras' WHERE name = 'Paid Extras';
UPDATE public.service_categories SET name_ro = 'Ajutor local', name_en = 'Local Help'   WHERE name = 'Local Help';
UPDATE public.service_categories SET name_ro = 'Feedback',     name_en = 'Feedback'     WHERE name = 'Feedback';

-- ── 4. Bilingual translations for demo service items ──────────────────────
UPDATE public.service_items SET title_ro = 'Prosoape suplimentare', title_en = 'Extra towels',
  description_ro = 'Prosoape curate livrate în cameră.', description_en = 'Fresh towels delivered to your room.'
  WHERE title = 'Extra towels';

UPDATE public.service_items SET title_ro = 'Curățenie cameră', title_en = 'Room cleaning',
  description_ro = 'Solicită o vizită pentru curățenie.', description_en = 'Request a cleaning visit.'
  WHERE title = 'Room cleaning';

UPDATE public.service_items SET title_ro = 'Problemă tehnică', title_en = 'Maintenance issue',
  description_ro = 'Raportează ceva ce trebuie reparat.', description_en = 'Report something that needs fixing.'
  WHERE title = 'Maintenance issue';

UPDATE public.service_items SET title_ro = 'Check-out târziu', title_en = 'Late checkout',
  description_ro = 'Rămâi până la ora 14:00 — €20.', description_en = 'Stay until 14:00 — €20.'
  WHERE title = 'Late checkout';

UPDATE public.service_items SET title_ro = 'Mic dejun extra', title_en = 'Breakfast add-on',
  description_ro = 'Mic dejun local complet — €12.', description_en = 'Full local breakfast — €12.'
  WHERE title = 'Breakfast add-on';

UPDATE public.service_items SET title_ro = 'Transfer aeroport', title_en = 'Airport transfer',
  description_ro = 'Transfer privat pe cerere — €35.', description_en = 'Arrange a private transfer — €35.'
  WHERE title = 'Airport transfer';

UPDATE public.service_items SET title_ro = 'Rezervare parcare', title_en = 'Parking reservation',
  description_ro = 'Rezervă un loc de parcare sigur — €10.', description_en = 'Reserve a secure parking spot — €10.'
  WHERE title = 'Parking reservation';

UPDATE public.service_items SET title_ro = 'Solicită taxi', title_en = 'Taxi request',
  description_ro = 'Chemăm un taxi de încredere pentru tine.', description_en = 'We will call a trusted taxi for you.'
  WHERE title = 'Taxi request';

UPDATE public.service_items SET title_ro = 'Recomandare restaurant local', title_en = 'Local restaurant recommendation',
  description_ro = 'Îți sugerăm un loc pe gustul tău.', description_en = 'Get a local pick based on your taste.'
  WHERE title = 'Local restaurant recommendation';

UPDATE public.service_items SET title_ro = 'Feedback privat', title_en = 'Private feedback',
  description_ro = 'Trimite-ne un mesaj privat despre sejur.', description_en = 'Send us a private message about your stay.'
  WHERE title = 'Private feedback';
