CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated;

ALTER POLICY "Admins can delete guest requests"
ON public.guest_requests
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update guest requests"
ON public.guest_requests
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can view guest requests"
ON public.guest_requests
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update feedback"
ON public.private_feedback
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can view feedback"
ON public.private_feedback
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage property settings"
ON public.property_settings
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage room codes"
ON public.room_codes
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage rooms"
ON public.rooms
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage service categories"
ON public.service_categories
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage service items"
ON public.service_items
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage roles"
ON public.user_roles
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;