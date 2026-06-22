ALTER TABLE public.guest_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guest_requests;
ALTER TABLE public.property_settings ADD COLUMN IF NOT EXISTS notification_email text;
ALTER TABLE public.property_settings ADD COLUMN IF NOT EXISTS enable_request_email_alerts boolean NOT NULL DEFAULT false;