UPDATE public.site_content
SET content = content
  || jsonb_build_object(
    'eyebrow_ro', 'Servicii direct din cameră',
    'title_ro', 'Ai nevoie de ceva în timpul șederii?',
    'subtitle_ro', 'Totul, direct din cameră.',
    'body_ro', 'Scanezi codul QR din cameră și trimiți rapid o solicitare către recepție: room service, informații locale, taxi sau feedback privat.',
    'primary_cta_label_ro', 'Vezi demo QR',
    'eyebrow_en', 'Services directly from your room',
    'title_en', 'Need something during your stay?',
    'subtitle_en', 'Everything, directly from your room.',
    'body_en', 'Scan the in-room QR code and quickly send a request to reception: room service, local information, taxi help or private feedback.',
    'primary_cta_label_en', 'View QR demo',
    'primary_cta_url', '/r/room-101'
  )
WHERE section_key = 'guest_convenience';