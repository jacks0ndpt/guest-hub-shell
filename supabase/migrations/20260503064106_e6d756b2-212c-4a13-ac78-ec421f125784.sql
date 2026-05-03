
-- Relax INSERT policy to allow 'new' or 'open' starting status
DROP POLICY IF EXISTS "Anyone can submit guest requests" ON public.guest_requests;
CREATE POLICY "Anyone can submit guest requests"
ON public.guest_requests
FOR INSERT
TO public
WITH CHECK (
  room_code_id IS NOT NULL
  AND status IN ('new','open')
  AND completed_at IS NULL
);

-- Validation trigger for allowed statuses
CREATE OR REPLACE FUNCTION public.validate_guest_request_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('new','in_progress','done','cancelled','accepted','rejected','open','completed') THEN
    RAISE EXCEPTION 'Invalid guest_requests.status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_guest_request_status ON public.guest_requests;
CREATE TRIGGER trg_validate_guest_request_status
BEFORE INSERT OR UPDATE ON public.guest_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_guest_request_status();

-- Backfill legacy statuses
UPDATE public.guest_requests SET status='new'  WHERE status='open';
UPDATE public.guest_requests SET status='done' WHERE status='completed';
