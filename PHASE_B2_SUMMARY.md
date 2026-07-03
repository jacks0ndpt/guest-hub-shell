# Phase B2 — Amenities + Homepage Featured Selectors

## What changed

### Database (single migration)
- **New table `amenities`** — `icon_key`, `label_ro/en`, `description_ro/en`, `is_active`, `show_on_homepage`, `show_on_room_pages`, `sort_order`, timestamps.
  - RLS: public/anon may read active rows; admins may read all; only admins insert/update/delete.
  - `set_updated_at` trigger attached.
  - Seeded with 8 bilingual amenities (breakfast, parking, Wi-Fi, 24/7 reception, non-smoking, luggage storage, in-room safe, near old town).
- **`property_settings`** — added `home_featured_rooms jsonb default '[]'` and `home_featured_offers jsonb default '[]'`. Used JSONB (not `uuid[]`) to keep generated types simple.

### New files
- `src/hooks/useAmenities.ts` — reactive hook that returns active amenities, localized (RO/EN with RO fallback), filterable by scope (`homepage` | `room` | `all`).
- `src/hooks/useFeatured.ts` — exports `useFeaturedRooms()` and `useFeaturedOffers()` for the homepage preview. Respect admin-selected order, drop inactive items, fall back to first N active when nothing is selected.
- `src/pages/admin/AdminAmenities.tsx` — full CRUD page with icon picker (from safe `sectionIcons` whitelist), bilingual fields, active toggle, homepage/room-page toggles, up/down reorder.

### Refactors
- `src/components/site/AmenityGrid.tsx` — reads from `useAmenities({ scope: "homepage" })`; keeps the legacy i18n static grid as fallback when the DB has no active amenities. Icons resolved via `resolveSectionIcon` (safe whitelist).
- `src/pages/admin/AdminRooms.tsx` — loads `home_featured_rooms` from `property_settings`; each room card shows a "Featured on homepage" switch + badge; a helper hint sits under the header.
- `src/pages/admin/AdminOffers.tsx` — loads `home_featured_offers`; each offer card shows the same switch; helper hint under the "Offers page" card.
- `src/App.tsx` + `src/components/admin/AdminLayout.tsx` — new route `/admin/amenities` and a sidebar entry (Sparkles icon).
- `src/i18n/locales/{en,ro}.json` — added `admin.amenities`, `admin.featured`, `admin.featuredOnHomepage`, `admin.amenitiesPage.*`, `roomsPage.featuredHint`, `offersPage.featuredHint`.

## Where amenities are managed
- New sidebar entry **Facilități / Amenities** → `/admin/amenities`.
- Each row: icon, RO/EN labels, RO/EN descriptions, sort order, active + homepage + room-page visibility toggles, reorder arrows, edit, delete.

## How featured rooms/offers are stored
- `property_settings.home_featured_rooms` — JSONB array of room `id`s, in the order they should appear.
- `property_settings.home_featured_offers` — JSONB array of offer `id`s.
- Empty array = fallback to first active rooms/offers by `sort_order`.
- Inactive items are always filtered out before being shown publicly.

## New hooks/helpers exposed
```ts
import { useAmenities } from "@/hooks/useAmenities";
import { useFeaturedRooms, useFeaturedOffers } from "@/hooks/useFeatured";

const { items: homepageAmenities } = useAmenities({ scope: "homepage" });
const { items: roomAmenities }     = useAmenities({ scope: "room" });
const { rooms: featuredRooms }     = useFeaturedRooms(3);
const { offers: featuredOffers }   = useFeaturedOffers(3);
```

Existing `/rooms`, `/offers`, `/admin/rooms`, `/admin/offers` behaviour is untouched.

## Manual test checklist
1. Open `/admin/amenities` — 8 seeded amenities appear. Reorder with arrows, toggle active, edit RO/EN, save; refresh — order persists.
2. Homepage `/` — amenity grid now shows DB items (RO/EN switching updates text). Deactivate all → static fallback returns.
3. `/admin/rooms` — flip "Featured on homepage" on 2 rooms; refresh page; toggles remain on. `/rooms` still lists all active rooms.
4. `/admin/offers` — flip "Featured on homepage" on 1 offer; refresh; state persists. `/offers` still shows every active offer.
5. Testimonials, gallery, QR GuestHub, requests + real-time notifications still work.
6. Language switcher toggles RO/EN across admin sidebar and amenity strings.
7. No TypeScript or console errors.

## Notes
- No existing RLS policy was weakened. New `amenities` policies mirror the project's `is_active`/`has_role('admin')` pattern.
- No routes were removed or renamed.
- Homepage layout was **not** redesigned in this phase; only data plumbing is in place for the upcoming visual work.
