-- 1. Fix mutable search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Tighten public INSERT policies
DROP POLICY "Anyone can submit guest requests" ON public.guest_requests;
CREATE POLICY "Anyone can submit guest requests"
  ON public.guest_requests FOR INSERT
  WITH CHECK (
    room_code_id IS NOT NULL
    AND status = 'open'
    AND completed_at IS NULL
  );

DROP POLICY "Anyone can submit feedback" ON public.private_feedback;
CREATE POLICY "Anyone can submit feedback"
  ON public.private_feedback FOR INSERT
  WITH CHECK (
    room_code_id IS NOT NULL
    AND status = 'new'
    AND (rating IS NULL OR (rating BETWEEN 1 AND 5))
  );

-- 3. Restrict has_role execution (only used inside RLS / SECURITY DEFINER context)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;