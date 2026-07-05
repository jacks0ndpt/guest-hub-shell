# Phase C2 — Polished homepage layout

Visual/UX polish only. All copy, items, images, and CTAs still come from the
admin sources wired in Phase C1 (site_content, property_settings, amenities,
rooms/offers featured flags, testimonials, site_gallery). No schema changes.
No RLS changes. No admin route changes. No functionality removed.

## Visual changes

- **Hero (`HeroSection.tsx`)**
  - Layered warm gradient overlay (ink + terracotta glow) for better legibility.
  - Balanced headline (`text-balance`) and softer subtitle.
  - Full-width stacked CTAs on mobile, inline on desktop.
  - External booking URLs open in a new tab automatically.
  - New optional `trustNote` prop; homepage reads `site_content.hero.trust_note`
    (bilingual, falls back to none — nothing rendered if empty).

- **Trust strip (`TrustStrip.tsx`)**
  - Horizontal snap-scroll on mobile, 3/5-col grid on md/lg.
  - Each item now uses a small circular primary-tinted icon badge and 2-line
    description clamp.
  - Still driven entirely by `site_content.trust_strip.items_json`.

- **Why us (`WhyUsSection.tsx`)**
  - Benefit cards with border, rounded corners, soft shadow, hover lift.
  - Icon badge in `bg-primary/10`. Copy remains from `site_content.why_us`.

- **Amenities (`AmenityGrid.tsx`)**
  - Compact card grid (2 cols mobile, 4 desktop) with icon chips.
  - DB-driven (`useAmenities({ scope: "homepage" })`) with unchanged legacy
    i18n fallback when the table is empty.

- **Guest convenience (`GuestConvenienceSection.tsx`)** — unchanged structurally;
  already reads `site_content.guest_convenience` with image/items fallback.

- **Rooms / Offers previews** — unchanged cards, still driven by
  `useFeaturedRooms(3)` / `useFeaturedOffers(3)`.

- **Location + contact (`pages/Index.tsx`)**
  - New contact grid built from `property_settings`: address, phone (tel:),
    email (mailto:), WhatsApp (wa.me link), check-in/check-out times.
  - Any missing field is silently skipped.
  - Added Google Maps deep link built from property address/name (only when
    an address exists). "Explore the area" button retained.

- **Final CTA (`HomeCTASection.tsx`)**
  - Warm radial glow (clay + gold) over the ink background — no longer flat.
  - Check bullets tinted `text-clay`. Booking button gets soft shadow.
  - Still driven by `site_content.home_cta` (+ i18n fallbacks from Phase C1).

- **Utilities (`index.css`)**
  - Added `.scrollbar-hide` helper for the mobile trust-strip carousel.

## Files touched

- `src/components/site/HeroSection.tsx`
- `src/components/site/TrustStrip.tsx`
- `src/components/site/WhyUsSection.tsx`
- `src/components/site/AmenityGrid.tsx`
- `src/components/site/HomeCTASection.tsx`
- `src/pages/Index.tsx`
- `src/index.css`
- `PHASE_C2_SUMMARY.md` (new)

No new components, no new hooks, no new migrations, no i18n key removals.

## Admin data preservation

Every visible string on the homepage still resolves through the existing
chain: `site_content` (bilingual + fallback), `property_settings`,
`amenities`, `testimonials`, `site_gallery`, and the featured toggles on
rooms/offers. Fallback rules from Phase C1 (RO fallback, booking_url as
default CTA href, hidden section when required data is missing) are intact.

## Manual test checklist

1. Load `/` in EN and RO — copy switches, no missing keys.
2. Edit in `/admin/content`:
   - `hero.trust_note` (add / clear) → note appears/disappears under hero CTAs.
   - `trust_strip.items_json` → mobile scrolls horizontally, desktop grids.
   - `why_us`, `guest_convenience`, `home_cta` — updates reflect.
3. Toggle "Featured on homepage" in `/admin/rooms` and `/admin/offers` —
   the homepage previews update.
4. `/admin/amenities` — visible amenities on the homepage change (empty
   table still falls back to i18n defaults).
5. `/admin/testimonials` — cards show correct rating, source, avatar.
6. `/admin/settings` — clear phone / email / WhatsApp / times and verify
   the contact grid hides those fields cleanly.
7. Mobile viewport (~375px): hero CTAs stack, trust strip scrolls,
   amenity cards fit 2-up, final CTA readable.
8. Regression: `/rooms`, `/rooms/:slug`, `/offers`, `/gallery`, `/contact`,
   `/location` still render; QR GuestHub `/r/:slug` still works;
   real-time request notifications still fire in `/admin/requests`.
