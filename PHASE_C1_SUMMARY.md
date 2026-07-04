# Phase C1 — Homepage wired to admin data

## What now reads from admin/database

| Homepage section | Source |
| --- | --- |
| Hero | `site_content.hero` + `property_settings.hero_image_url` (unchanged) |
| **Trust strip** | `site_content.trust_strip` (items_json) — NEW on homepage |
| Positioning / About | `site_content.about` (unchanged) |
| Rooms preview | `useFeaturedRooms(3)` → `property_settings.home_featured_rooms` |
| **Why us** | `site_content.why_us` (items_json) — NEW on homepage |
| Amenities | `useAmenities({ scope: "homepage" })` via `AmenityGrid` |
| **Guest convenience** | `site_content.guest_convenience` (items_json + image_url + CTA) — NEW |
| Offers preview | `useFeaturedOffers(3)` → `property_settings.home_featured_offers` |
| Gallery preview | `site_gallery` (unchanged) |
| Location | `site_content.location` (unchanged) |
| Testimonials | `testimonials` table (unchanged) |
| **Final CTA** | `site_content.home_cta` (title/subtitle/CTAs/items_json) with i18n fallback |

## New components

- `src/components/site/TrustStrip.tsx`
- `src/components/site/WhyUsSection.tsx`
- `src/components/site/GuestConvenienceSection.tsx`
- `src/components/site/HomeCTASection.tsx`

Each component:
- Uses `useHomepageSection()` for bilingual content (RO fallback if EN missing).
- Uses `resolveSectionIcon()` — unknown icons fall back to `Sparkles`.
- Returns `null` when data is missing/empty so the page never blanks out.
- Handles malformed `items_json` via the hook's safe array handling.

## Fallback rules implemented

| Condition | Behaviour |
| --- | --- |
| Section missing/empty items | Section hidden (Trust/Why/Guest convenience) |
| `home_cta` missing | Falls back to i18n copy (`site.home.cta*`) via props |
| Featured rooms empty | Falls back to first active rooms (hook default) |
| Featured offers empty | Falls back to active offers by `sort_order` |
| Homepage amenities empty | `AmenityGrid` falls back to legacy static i18n items |
| Missing `primary_cta_url` on CTA | Uses `property.booking_url`, then `/contact` |
| Missing `secondary_cta_url` | Uses `/contact` |
| Missing `image_url` on Guest convenience | Renders items grid instead of image |
| Invalid `icon_key` | `Sparkles` fallback |

## Bilingual behaviour

- All new sections re-render on language switch (hooks depend on `useLang`).
- Missing EN fields fall back to RO via `pickLocalizedJson`.
- No mixed RO/EN copy unless fallback engaged.

## Files changed

- **Created**
  - `src/components/site/TrustStrip.tsx`
  - `src/components/site/WhyUsSection.tsx`
  - `src/components/site/GuestConvenienceSection.tsx`
  - `src/components/site/HomeCTASection.tsx`
  - `PHASE_C1_SUMMARY.md`
- **Modified**
  - `src/pages/Index.tsx` — uses featured hooks + new sections + admin CTA

No database migrations, no RLS changes, no removed features.

## Manual test checklist

1. Load `/` — page renders in RO, all sections visible.
2. Switch to EN — headings, items, CTAs update; no blank strings.
3. In `/admin/content`:
   - Edit `trust_strip` items → homepage strip updates after refresh.
   - Edit `why_us` title + add/remove item → homepage reflects.
   - Edit `guest_convenience` items, add an `image_url` → image replaces item grid.
   - Edit `home_cta` title/CTAs → final CTA section reflects; unset URLs fall back to booking URL / `/contact`.
4. In `/admin/rooms` mark 2 rooms as featured → homepage rooms show only those in that order.
5. Unfeature all rooms → homepage falls back to first 3 active rooms.
6. In `/admin/offers` mark offers as featured → homepage offers reflect selection.
7. In `/admin/amenities` toggle "show on homepage" → homepage amenity grid updates.
8. Verify unaffected: `/rooms`, `/offers`, `/gallery`, `/contact`, `/admin/*` routes, QR GuestHub `/r/:code`, real-time request notifications, request dashboard.
9. Check console — no errors, no TS errors.
