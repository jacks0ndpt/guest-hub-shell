ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_feedback;
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER TABLE public.private_feedback REPLICA IDENTITY FULL;