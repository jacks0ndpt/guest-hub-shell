ALTER TABLE public.property_settings
  ADD COLUMN IF NOT EXISTS map_embed_url text,
  ADD COLUMN IF NOT EXISTS maps_url text;