
-- Add bilingual RO/EN fields to editable content tables. Romanian is primary.
-- Existing legacy fields are kept for backward compatibility and seeded into _ro.

-- ROOMS
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS name_ro text,
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS short_description_ro text,
  ADD COLUMN IF NOT EXISTS short_description_en text,
  ADD COLUMN IF NOT EXISTS long_description_ro text,
  ADD COLUMN IF NOT EXISTS long_description_en text,
  ADD COLUMN IF NOT EXISTS amenities_ro text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS amenities_en text[] DEFAULT '{}'::text[];

UPDATE public.rooms SET
  name_ro = COALESCE(name_ro, name),
  short_description_ro = COALESCE(short_description_ro, short_description),
  long_description_ro = COALESCE(long_description_ro, long_description),
  amenities_ro = CASE WHEN amenities_ro IS NULL OR array_length(amenities_ro,1) IS NULL THEN amenities ELSE amenities_ro END;

-- OFFERS
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS title_ro text,
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS badge_ro text,
  ADD COLUMN IF NOT EXISTS badge_en text,
  ADD COLUMN IF NOT EXISTS description_ro text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS perks_ro text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS perks_en text[] DEFAULT '{}'::text[];

UPDATE public.offers SET
  title_ro = COALESCE(title_ro, title),
  badge_ro = COALESCE(badge_ro, badge),
  description_ro = COALESCE(description_ro, description),
  perks_ro = CASE WHEN perks_ro IS NULL OR array_length(perks_ro,1) IS NULL THEN perks ELSE perks_ro END;

-- SERVICE CATEGORIES
ALTER TABLE public.service_categories
  ADD COLUMN IF NOT EXISTS name_ro text,
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS description_ro text,
  ADD COLUMN IF NOT EXISTS description_en text;

UPDATE public.service_categories SET
  name_ro = COALESCE(name_ro, name),
  description_ro = COALESCE(description_ro, description);

-- SERVICE ITEMS
ALTER TABLE public.service_items
  ADD COLUMN IF NOT EXISTS title_ro text,
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_ro text,
  ADD COLUMN IF NOT EXISTS description_en text;

UPDATE public.service_items SET
  title_ro = COALESCE(title_ro, title),
  description_ro = COALESCE(description_ro, description);

-- SITE GALLERY
ALTER TABLE public.site_gallery
  ADD COLUMN IF NOT EXISTS alt_ro text,
  ADD COLUMN IF NOT EXISTS alt_en text,
  ADD COLUMN IF NOT EXISTS category_ro text,
  ADD COLUMN IF NOT EXISTS category_en text;

UPDATE public.site_gallery SET
  alt_ro = COALESCE(alt_ro, alt),
  category_ro = COALESCE(category_ro, category);
