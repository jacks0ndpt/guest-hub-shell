-- =========================================
-- ENUM + ROLES
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- TIMESTAMP TRIGGER HELPER
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROPERTY SETTINGS
-- =========================================
CREATE TABLE public.property_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name TEXT NOT NULL,
  property_type TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  booking_url TEXT,
  currency TEXT DEFAULT 'EUR',
  language_default TEXT DEFAULT 'en',
  checkin_time TEXT,
  checkout_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.property_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER property_settings_updated BEFORE UPDATE ON public.property_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public can view property settings"
  ON public.property_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage property settings"
  ON public.property_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- ROOMS
-- =========================================
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  long_description TEXT,
  capacity INT DEFAULT 2,
  bed_type TEXT,
  amenities TEXT[] DEFAULT '{}',
  main_image_url TEXT,
  gallery_image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER rooms_updated BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public can view active rooms"
  ON public.rooms FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage rooms"
  ON public.rooms FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- ROOM CODES
-- =========================================
CREATE TABLE public.room_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_label TEXT NOT NULL,
  qr_code_slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.room_codes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER room_codes_updated BEFORE UPDATE ON public.room_codes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public can view active room codes"
  ON public.room_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage room codes"
  ON public.room_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SERVICE CATEGORIES
-- =========================================
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER service_categories_updated BEFORE UPDATE ON public.service_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public can view active service categories"
  ON public.service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage service categories"
  ON public.service_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SERVICE ITEMS
-- =========================================
CREATE TABLE public.service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_estimate NUMERIC(10,2),
  is_paid_extra BOOLEAN NOT NULL DEFAULT false,
  requires_staff_confirmation BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER service_items_updated BEFORE UPDATE ON public.service_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public can view active service items"
  ON public.service_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage service items"
  ON public.service_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- GUEST REQUESTS
-- =========================================
CREATE TABLE public.guest_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code_id UUID REFERENCES public.room_codes(id) ON DELETE SET NULL,
  service_item_id UUID REFERENCES public.service_items(id) ON DELETE SET NULL,
  request_type TEXT,
  guest_name TEXT,
  guest_contact TEXT,
  guest_note TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  estimated_value NUMERIC(10,2) DEFAULT 0,
  staff_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.guest_requests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER guest_requests_updated BEFORE UPDATE ON public.guest_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Anyone can submit guest requests"
  ON public.guest_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view guest requests"
  ON public.guest_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update guest requests"
  ON public.guest_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete guest requests"
  ON public.guest_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- PRIVATE FEEDBACK
-- =========================================
CREATE TABLE public.private_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code_id UUID REFERENCES public.room_codes(id) ON DELETE SET NULL,
  rating INT,
  comment TEXT,
  guest_contact TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.private_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.private_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view feedback"
  ON public.private_feedback FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update feedback"
  ON public.private_feedback FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SEED DATA
-- =========================================
INSERT INTO public.property_settings
  (property_name, property_type, primary_color, secondary_color, address, city, country, phone, email, whatsapp, booking_url, currency, language_default, checkin_time, checkout_time)
VALUES
  ('Hotel Aurora', 'Boutique Motel', '#8b7355', '#c9b99a', 'Strada Republicii 42', 'Brașov', 'Romania', '+40 368 123 456', 'stay@hotelaurora.ro', '+40 752 000 000', '#book', 'EUR', 'en', '15:00', '11:00');

INSERT INTO public.rooms (name, slug, short_description, long_description, capacity, bed_type, amenities, sort_order) VALUES
  ('Standard Double Room', 'standard-double', 'A calm double room with soft morning light and quiet city side views.', 'Our Standard Double is a 22 m² retreat designed for restful sleep.', 2, '1 Queen bed', ARRAY['Free Wi-Fi','Smart TV','Rain shower','Air conditioning'], 1),
  ('Deluxe Mountain View Room', 'deluxe-mountain-view', 'King bed, panoramic Carpathian views, and a cozy reading chair.', 'The Deluxe Mountain View is our signature room — 30 m² facing the Carpathian ridge.', 2, '1 King bed', ARRAY['Mountain view','Free Wi-Fi','Nespresso machine','Rain shower'], 2),
  ('Family Room', 'family-room', 'Space for four, with thoughtful details for traveling with kids.', 'Our 36 m² Family Room sleeps up to four with a queen bed and two singles.', 4, '1 Queen + 2 Singles', ARRAY['Family-friendly','Free Wi-Fi','Kettle','Blackout curtains'], 3),
  ('Business Twin Room', 'business-twin', 'Two single beds, a proper work desk, and fast Wi-Fi.', 'Designed for colleagues on the road — the Business Twin offers two single beds and an ergonomic work desk.', 2, '2 Single beds', ARRAY['Work desk','Fast Wi-Fi','Iron & board','24h reception'], 4);

INSERT INTO public.room_codes (room_label, qr_code_slug) VALUES
  ('101', 'room-101'),
  ('102', 'room-102'),
  ('103', 'room-103'),
  ('204', 'room-204');

INSERT INTO public.service_categories (name, description, icon, sort_order) VALUES
  ('Housekeeping', 'Cleaning, towels, and room upkeep.', 'Sparkles', 1),
  ('Reception', 'Front desk help and information.', 'ConciergeBell', 2),
  ('Paid Extras', 'Optional add-ons to enhance your stay.', 'Gift', 3),
  ('Local Help', 'Tips and bookings for the area.', 'MapPin', 4),
  ('Feedback', 'Tell us privately how we are doing.', 'MessageSquare', 5);

INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Extra towels', 'Fresh towels delivered to your room.', 0, false, false, 1 FROM public.service_categories WHERE name='Housekeeping';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Room cleaning', 'Request a cleaning visit.', 0, false, false, 2 FROM public.service_categories WHERE name='Housekeeping';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Maintenance issue', 'Report something that needs fixing.', 0, false, true, 1 FROM public.service_categories WHERE name='Reception';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Late checkout', 'Stay until 14:00 — €20.', 20, true, true, 1 FROM public.service_categories WHERE name='Paid Extras';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Breakfast add-on', 'Full local breakfast — €12.', 12, true, true, 2 FROM public.service_categories WHERE name='Paid Extras';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Airport transfer', 'Arrange a private transfer — €35.', 35, true, true, 3 FROM public.service_categories WHERE name='Paid Extras';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Parking reservation', 'Reserve a secure parking spot — €10.', 10, true, true, 4 FROM public.service_categories WHERE name='Paid Extras';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Taxi request', 'We will call a trusted taxi for you.', 0, false, true, 1 FROM public.service_categories WHERE name='Local Help';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Local restaurant recommendation', 'Get a local pick based on your taste.', 0, false, false, 2 FROM public.service_categories WHERE name='Local Help';
INSERT INTO public.service_items (category_id, title, description, price_estimate, is_paid_extra, requires_staff_confirmation, sort_order)
SELECT id, 'Private feedback', 'Send us a private message about your stay.', 0, false, false, 1 FROM public.service_categories WHERE name='Feedback';