# Phase A — Wire real data + Testimonials admin

## What changed

### Database
- New table `public.testimonials` with: `guest_name`, `guest_location`, `rating`, `quote_ro`, `quote_en`, `source`, `source_url`, `avatar_url`, `is_active`, `sort_order` (+ id/created_at/updated_at).
- `set_updated_at` trigger attached.
- RLS enabled with the project's standard pattern:
  - Public/anon + authenticated can read rows where `is_active = true` (admins also see hidden rows).
  - Only admins (`has_role(auth.uid(), 'admin')`) can insert / update / delete.
- GRANTs: `anon` SELECT, `authenticated` SELECT/INSERT/UPDATE/DELETE, `service_role` ALL.
- Seeded 3 demo testimonials (Ioana M., Marco R., Sophie L.) with RO + EN quotes, rating 5, source `Google`, active.

### Gallery wiring (homepage + /gallery)
- `src/components/site/GalleryGrid.tsx`: now fetches from `site_gallery` (active rows, sorted by `sort_order` then `created_at`) and uses bilingual `alt_ro` / `alt_en` with RO → fallback. Falls back to mock images only when the table is empty. Still respects `items`, `filterable`, `limit` props (homepage uses `limit={6}`).
- `src/pages/Gallery.tsx`: simplified — relies on `GalleryGrid` itself for fetching, so it benefits from the same bilingual logic and fallback.

### Testimonials wiring
- `src/hooks/useTestimonials.ts`: reads active testimonials sorted by `sort_order`, exposes display objects in the current language (RO ↔ EN, with RO fallback). Returns mock testimonials only when the table is empty.
- `src/components/site/TestimonialSection.tsx`: rewritten to consume `useTestimonials` — renders rating stars, localized quote, name/location, optional `source` (linked when `source_url` is set), and avatar when present.

### Admin module
- New route `/admin/testimonials` (`src/pages/admin/AdminTestimonials.tsx`):
  - List with status/RO/EN/source badges and rating stars.
  - Create / edit dialog with RO + EN tabs, rating, sort order, source, source URL, avatar uploader (uses existing `ImageUploader` against `site-images` bucket), visibility switch.
  - Inline reorder (up/down swap of `sort_order`), activate/deactivate switch, delete with confirm.
- Sidebar entry added in `src/components/admin/AdminLayout.tsx` (Quote icon) — between Content and Reports — labelled **Testimoniale** / **Testimonials**.
- Route registered in `src/App.tsx` behind `ProtectedRoute`.

### i18n
- `src/i18n/locales/{en,ro}.json`: added `admin.testimonials` sidebar label and a full `admin.testimonialsPage` namespace (RO + EN).

## Files touched
- **New:** `src/hooks/useTestimonials.ts`, `src/pages/admin/AdminTestimonials.tsx`, this document (`PHASE_A_SUMMARY.md`).
- **Modified:** `src/components/site/GalleryGrid.tsx`, `src/pages/Gallery.tsx`, `src/components/site/TestimonialSection.tsx`, `src/components/admin/AdminLayout.tsx`, `src/App.tsx`, `src/i18n/locales/en.json`, `src/i18n/locales/ro.json`.
- **Migration:** new `testimonials` table + RLS + seed.

## What I deliberately did NOT change
- Hero, rooms, offers, QR GuestHub, request notifications, admin layout structure (only one nav item added).
- Mock fallbacks in `src/data/mock.ts` left intact — both gallery and testimonials still fall back to mock when their tables are empty.
- No RLS policy was loosened.

## Manual test checklist
1. Homepage `/` loads; testimonials show the 3 seeded reviews; switching RO/EN swaps the quote language; star rating renders; "Google" badge appears.
2. Homepage gallery preview shows up to 6 images. With an empty `site_gallery`, mock images appear; after uploading via `/admin/content → Gallery`, those uploads replace the mock set.
3. `/gallery` page renders the same `site_gallery` images with category filters; alt text follows the active language.
4. `/admin/content → Gallery` upload + alt RO/EN + category + delete still work.
5. `/admin/testimonials`:
   - Add new testimonial (name required) → appears on homepage immediately after save.
   - Edit RO/EN quotes via tabs; toggle Visible → homepage hides/shows it.
   - Reorder with ↑ / ↓ → homepage order updates.
   - Delete with confirm.
   - Upload avatar → appears next to the quote on the homepage.
6. Logged out, attempt to write to `testimonials` via the client → blocked by RLS. Reading active rows works.
7. `/admin/requests` real-time notifications still fire on new guest requests; sidebar badge still increments.
8. QR flow `/r/:slug` → submit request → admin still receives it.
9. No console errors; no TypeScript errors.
