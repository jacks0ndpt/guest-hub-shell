# Homepage Refactor — Audit & Implementation Plan

_Read-only audit. No code, schema, or admin routes were modified._

---

## 1. Current homepage structure (`src/pages/Index.tsx`)

| # | Section on page | Component | Copy source | Image source | RO/EN ready | Editable from admin? |
|---|---|---|---|---|---|---|
| 1 | Hero | `HeroSection` | `site_content.hero.*_ro / *_en` (via `useSiteContent` + `get`) | `property_settings.hero_image_url` (fallback `heroHotel` mock) | ✅ | ✅ `/admin/content` → Text Sections + Hero Image |
| 2 | About / positioning | inline in `Index.tsx` | `site_content.about.*` | — | ✅ | ✅ `/admin/content` |
| 3 | Rooms preview (3) | `RoomCard` × `useRooms()` | `rooms.name_ro/_en, description_ro/_en, …` | `rooms.images[]` | ✅ (room rows bilingual) | ✅ `/admin/rooms` |
| 4 | Amenities heading | inline | `site_content.amenities.*` | — | ✅ | ✅ `/admin/content` |
| 4b | Amenities grid (8 items) | `AmenityGrid` | **i18n JSON only** (`data.amenities.<key>`) | Lucide icons (hardcoded list) | ✅ static | ❌ **not editable** |
| 5 | GuestHub teaser | inline | **i18n JSON only** (`site.home.guestExperience*`, `site.home.features.*`) | Lucide icons | ✅ static | ❌ **not editable** |
| 6 | Gallery preview | `GalleryGrid` (limit 6, non-filterable) | mock `gallery` from `src/data/mock.ts` | **mock images** | n/a | ⚠️ Admin can edit `site_gallery` table, but the home/gallery components still read from `mock.ts`. **Not wired.** |
| 7 | Location preview | inline + `MapPlaceholder` | `site_content.location.*` | static placeholder | ✅ | ✅ text only |
| 8 | Testimonials | `TestimonialSection` | mock `testimonials` from `src/data/mock.ts` | — | ❌ (hardcoded EN/RO mix) | ❌ **no admin module** |
| 9 | Final CTA | `CTASection` | **i18n JSON only** (`site.home.cta*`) | — | ✅ static | ❌ copy not in DB; uses `property.booking_url` ✅ |
| — | Trust strip | **does not exist** | — | — | — | ❌ |

### Hardcoded vs DB-backed
- **DB-backed (already):** Hero text/image, About, Amenities heading, Location text, Rooms cards, Final CTA href.
- **i18n static only (not editable per-property):** Amenity items, GuestHub teaser, Gallery section heading, Testimonials heading, Final CTA copy.
- **Mock data still in production render:** `GalleryGrid` (mock images) and `TestimonialSection` (mock quotes). Both ignore Supabase.

---

## 2. `/admin/content` capabilities today

Tabs: **Text Sections | Hero Image | Gallery**.

- **Text Sections:** generic editor driven by `SECTION_FIELDS` in `useSiteContent.ts`. Sections: `hero, about, amenities, location, contact, footer`. Per-section RO/EN tabs, completion badges, per-section save → `site_content` upsert by `section_key`.
- **Hero Image:** single `ImageUploader` writing `property_settings.hero_image_url`.
- **Gallery:** `MultiImageUploader` → inserts into `site_gallery` (alt RO/EN, category, active flag, sort). **But public `GalleryGrid` does not consume this table.**

Patterns to reuse:
- `SECTION_FIELDS` schema-driven editor (easy to extend with new sections).
- `pickLocalized*` helpers in `src/lib/i18nContent.ts`.
- `ImageUploader` / `MultiImageUploader` against buckets `site-images` / `room-images`.
- Bilingual tab pattern (`RoomDialog`, `ServiceItemDialog`, `AdminOffers`).

Gaps for a modular homepage editor:
- No section reordering / show-hide toggles per homepage section.
- No editor for: **trust strip, amenities items, guest convenience cards, testimonials, final CTA copy**.
- No link from `site_gallery` → home `GalleryGrid`.
- No way to choose which rooms / offers feature on the homepage (currently `rooms.slice(0,3)`).

---

## 3. Module ↔ homepage mapping (reuse plan)

| Homepage section | Owning admin module (reuse) | Action |
|---|---|---|
| Hero | `/admin/content` (sections + hero image) | Already done. Add optional second CTA + overlay opacity slider (nice-to-have). |
| Trust strip | `/admin/content` (new `trust_strip` section + array of items) | New |
| Room preview | `/admin/rooms` + `property_settings` `home_featured_rooms uuid[]` | Add featured-on-home toggle |
| Why choose us | `/admin/content` (new `why_us` section, 3–4 items RO/EN) | New |
| Amenities preview | new `amenities` table OR JSON array on `site_content.amenities.items` | New (replace `AmenityGrid` hardcoded list) |
| Guest convenience | `/admin/content` (new `guest_convenience` section, 4 cards) | New |
| Offers preview | `/admin/offers` + `home_featured_offers uuid[]` | Add featured-on-home flag |
| Testimonials | new `testimonials` table (name, location, rating, quote_ro, quote_en, sort, active) | New |
| Location / contact | `/admin/content.location` + `/admin/settings` (address, phone, whatsapp) | Wire map embed URL from settings |
| Final CTA | `/admin/content` (new `home_cta` section) + `property_settings.booking_url` | New copy section |
| Gallery preview | `/admin/content.gallery` (already writes `site_gallery`) | Refactor `GalleryGrid` to read `site_gallery` |

---

## 4. Bilingual architecture

- **Static UI:** `react-i18next` + `src/i18n/locales/{en,ro}.json`, detector key `guesthub_lang`.
- **Dynamic content:**
  - `site_content` rows: JSON map of `key_ro` / `key_en` pairs per `section_key`.
  - `rooms`, `offers`, `service_categories`, `service_items`, `site_gallery`: dedicated `*_ro` / `*_en` columns.
- **Reader:** `useLang()` + `pickLocalized*` (lang → ro → legacy) — robust, keep as-is.
- **Switching:** `LanguageSwitcher` updates i18n → all `useSiteContent` consumers re-render reactively (the lang is read on each render via `useLang`).

Still mono-language / static:
- `AmenityGrid` items (icon + label/desc) — i18n JSON only.
- `TestimonialSection` — mock data.
- Final `CTASection` copy on home — i18n JSON only.
- `GalleryGrid` images & alts — mock data.
- `data/mock.ts` `nearby`, `testimonials`, `amenities` — partially translated, not from DB.

---

## 5. Data structure (current)

Tables seen via context:
- `property_settings` (23 cols) — hero_image_url, booking_url, theme colors, contact info, language_default ✅
- `site_content` (3 cols) — `section_key`, `content jsonb`, timestamps ✅
- `site_gallery` (11 cols) — images + bilingual alts ✅ (unused on home)
- `rooms`, `offers`, `service_categories`, `service_items` — bilingual ✅
- **Missing:** `testimonials`, `amenities`, `homepage_sections` (visibility/order).

---

## 6. Frontend components inventory

- Public render: `Index.tsx`, `SiteLayout`, `Navbar`, `Footer`, `HeroSection`, `RoomCard`, `OfferCard`, `AmenityGrid`, `GalleryGrid`, `TestimonialSection`, `CTASection`, `MapPlaceholder`, `ContactSection`, `PropertyTheme`.
- Hooks: `useProperty`, `useRooms`, `useSiteContent` (+ `get`), `useGuestHub`, `usePageMeta`.
- Admin building blocks: `AdminLayout`, `ImageUploader`, `MultiImageUploader`, `RoomDialog`, `ServiceItemDialog`, RO/EN tabs pattern.
- i18n: `src/i18n/index.ts`, `LanguageSwitcher`, `lib/i18nContent.ts`.

---

## 7. Implementation plan (recommended order)

**Phase A — Wire what already exists (low risk, no schema changes)**
1. Refactor `GalleryGrid` to read from `site_gallery` (with mock fallback when empty). Home preview uses first N active rows.
2. Refactor `TestimonialSection` to read from a new `testimonials` table; keep mock as fallback for empty state.

**Phase B — Editable structured sections (additive `site_content` entries)**
3. Extend `SECTION_FIELDS` with: `trust_strip`, `why_us`, `guest_convenience`, `home_cta`. Each section stores both flat strings and JSON arrays (items) under `key_ro / key_en`. No schema change — only new `section_key` rows.
4. Build a small generic "repeater" editor in `AdminContent` for array fields (add/remove/reorder, RO/EN per item) so all four sections share the same UI.

**Phase C — New domain tables**
5. `testimonials(id, name, location, rating, quote_ro, quote_en, avatar_url, sort_order, is_active)` + RLS + grants + `AdminTestimonials` page.
6. `amenities(id, icon_key, label_ro, label_en, desc_ro, desc_en, sort_order, is_active)` — replaces hardcoded list in `AmenityGrid`. Admin uses icon picker constrained to `iconMap` keys.

**Phase D — Featured selectors**
7. Add `home_featured_rooms uuid[]` + `home_featured_offers uuid[]` to `property_settings`, with chip selectors in `/admin/rooms` and `/admin/offers` (or a "Homepage" tab inside `/admin/content`). Fallback to first N when empty.

**Phase E — Section visibility/order (optional polish)**
8. `homepage_sections(section_key, position, is_visible)` + drag-reorder UI. Skip if YAGNI for MVP.

---

## 8. Risks

- **GalleryGrid swap** — `Gallery.tsx` public page also consumes the same component; verify it still renders when `site_gallery` is empty (mock fallback).
- **TestimonialSection swap** — same: keep mock fallback to avoid empty homepage during onboarding.
- **`AmenityGrid` replacement** — icon names must validate against `iconMap` to avoid runtime `undefined` icons.
- **Featured-rooms uuid[]** — must filter out soft-deleted/inactive rooms server-side or in hook.
- **RLS** — new `testimonials`, `amenities` tables need: `GRANT SELECT TO anon, authenticated`, write policies via `has_role('admin')`, plus `service_role` ALL.
- **Realtime** — no impact on `guest_requests` channel.
- **i18n keys** — when moving copy from `en.json/ro.json` to DB, keep i18n keys as fallback during transition.

---

## 9. Recommended next prompt

> "Phase A — Wire existing data: refactor `GalleryGrid` to read from `site_gallery` (with mock fallback) and create a `testimonials` table + `AdminTestimonials` page; refactor `TestimonialSection` to consume it (mock fallback when empty). Do not touch hero, rooms, offers, or admin layout."

After Phase A merges cleanly, proceed to Phase B (additive `site_content` sections + repeater editor) and so on.
