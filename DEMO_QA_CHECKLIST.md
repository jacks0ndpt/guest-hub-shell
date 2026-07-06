# Phase D — Demo QA & Deployment Readiness Checklist

Last updated after Phase D audit. This document is the single source of truth for
manually validating the MVP before demoing to hotel owners or deploying to
Netlify.

---

## 1. Bugs & regressions found and fixed in Phase D

| # | Area | Issue | Fix |
|---|------|-------|-----|
| 1 | `src/components/site/RoomCard.tsx` | React key warning `Encountered two children with the same key` when a room had duplicate amenity labels (e.g. two "test" tags). | Amenity chip key changed from `a` to `${a}-${i}` so duplicates no longer collide. |

No other runtime errors were surfaced in the console logs snapshot, and the
build/typecheck runs cleanly. All admin routes, hooks, and Supabase RLS
policies were left untouched — no schema changes required.

### Files changed in Phase D
- `src/components/site/RoomCard.tsx` (duplicate-key fix)
- `DEMO_QA_CHECKLIST.md` (this document, new)

---

## 2. Public website checklist

Test each route in both RO and EN (top-right language switcher). Refresh each
route once — language must persist and there must be no blank screen.

- [ ] `/` — hero, trust strip, featured rooms, why us, amenities, guest
      convenience, featured offers, gallery preview, location + contact grid,
      testimonials, final CTA all render. Missing sections hide gracefully.
- [ ] `/rooms` — grid of active rooms, images degrade to placeholder if absent.
- [ ] `/rooms/:slug` — detail page loads for every active room, gallery works.
- [ ] `/offers` — active offers list. Featured flag does not hide non-featured.
- [ ] `/gallery` — bilingual alt text, category filter (if visible) works.
- [ ] `/contact` — form submits to `contact_messages`, success toast appears.
- [ ] `/location` — address, map link, contact cards render.
- [ ] `/guest` — QR hub loads without a room context.
- [ ] `/r/:qrCodeSlug` — valid code loads GuestHub with room context; unknown
      code shows the "not recognized" fallback with a link back to `/guest`.

Pass criteria: no console errors, no missing i18n keys, no raw JSON, no
`undefined`/`null` text.

---

## 3. Admin checklist

Sign in at `/admin/login` with an account that has the `admin` role. Verify
every sidebar link loads, RO/EN switch relabels the sidebar, and forms save.

- [ ] `/admin` dashboard KPIs load.
- [ ] `/admin/requests` — list, filter, mark in-progress / done.
- [ ] `/admin/messages` — inbound contact messages list and reply.
- [ ] `/admin/services` — categories + items CRUD, sort order persists.
- [ ] `/admin/rooms` — CRUD, image upload, **Featured on homepage** toggle
      persists and reorders the homepage preview.
- [ ] `/admin/offers` — CRUD, **Featured on homepage** toggle persists.
- [ ] `/admin/qr-codes` — generate + print QR codes per room.
- [ ] `/admin/content` — edit hero, `trust_strip`, `why_us`,
      `guest_convenience`, `home_cta`, gallery. Repeater items add / delete /
      reorder / toggle active. Both RO and EN fields save.
- [ ] `/admin/testimonials` — CRUD, reorder, toggle active, RO/EN quotes.
- [ ] `/admin/amenities` — CRUD, icon picker (whitelist), scope toggles
      (homepage / room pages), sort order.
- [ ] `/admin/reports` — analytics widgets render.
- [ ] `/admin/mvp-checklist` — internal progress checklist loads.
- [ ] `/admin/users` — list users, grant/revoke `admin` role.
- [ ] `/admin/settings` — property fields save; changes reflect on the public
      homepage location/contact grid.

Protected routes must redirect non-admins to `/admin/login`.

---

## 4. QR GuestHub + realtime request notifications

Two-tab test:
1. Open `/admin/requests` in tab A (admin session).
2. Open `/r/<qr-code-slug>` in tab B (or on a phone).
3. Submit a service request from tab B.
4. In tab A:
   - [ ] request appears in the list without refresh
   - [ ] sidebar "Requests" badge count increments
   - [ ] toast fires
5. Change status to In progress → Done in tab A and verify the badge
   decrements.

The realtime channel lives in `src/context/RealtimeRequestsContext.tsx` and
subscribes to `postgres_changes` on `guest_requests`. RLS is unchanged.

---

## 5. Bilingual (RO/EN) checklist

Switch languages via the header language switcher on any page. Verify:

- [ ] language persists after page refresh (stored by `i18next`)
- [ ] navbar, footer, homepage sections, room cards, offers, gallery,
      testimonials, location/contact all relabel
- [ ] admin sidebar, admin content editor field labels, amenities and
      testimonials admin pages relabel
- [ ] missing EN copy falls back to RO (fallback is implemented in
      `pickLocalized*` helpers in `src/lib/i18nContent.ts`)
- [ ] missing RO copy does not crash the page (empty string returned)
- [ ] no raw JSON, no `undefined`/`null` strings visible

---

## 6. Mobile polish checklist

Emulate viewport widths 375, 390, 430, and 768 px.

- [ ] hero CTAs stack cleanly, trust note wraps
- [ ] trust strip scrolls horizontally with `snap-x` on mobile
- [ ] room cards, offer cards and amenity grid maintain 1-column layout
      without overflow
- [ ] guest convenience and why-us cards do not clip
- [ ] location/contact grid falls to a single column with readable dt/dd pairs
- [ ] final CTA buttons stack full-width
- [ ] admin pages are usable on tablet (768 px); phone use is best-effort
- [ ] QR GuestHub request dialog scrolls inside viewport, submit button
      remains reachable

---

## 7. Netlify / hosting readiness

- [x] `netlify.toml` present with SPA fallback `/* → /index.html 200`
- [x] Build command `bun run build` produces `dist/`
- [x] TypeScript check passes
- [x] `.env` used only for **publishable** Supabase values
      (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
      `VITE_SUPABASE_PROJECT_ID`)
- [x] No `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, or `LOVABLE_API_KEY`
      referenced from any file under `src/`
- [x] `<title>` and meta description in `index.html` are app-specific
- [x] Deep-link refresh (e.g. `/admin/rooms`) returns `index.html` via the
      Netlify redirect

To deploy on Netlify manually, set the three `VITE_SUPABASE_*` env vars in
**Site settings → Environment variables** and trigger a redeploy.

---

## 8. Known limitations (out of scope for the MVP demo)

These are intentional and should be surfaced to hotel owners during the demo:

- No real payment processing / no PCI capture
- No native booking engine — the "Book direct" CTA links to the property's
  external booking URL configured in `/admin/settings`
- No PMS (Property Management System) integration
- No AI chatbot
- No native iOS/Android app — the guest experience is web + QR only
- Email / WhatsApp automation only works when the corresponding admin fields
  are populated in `/admin/settings`; there is no built-in transactional
  email engine beyond the existing `send-contact-reply` edge function
- Admin UI is optimised for desktop/tablet; phone use is best-effort

---

## 9. Suggested manual test order on Netlify

1. Load the published URL, run through the Public website checklist (§2) in
   RO then EN.
2. Sign in as admin and run the Admin checklist (§3).
3. Print a QR from `/admin/qr-codes`, scan it on a real phone, and run the
   QR + realtime notification test (§4) with `/admin/requests` open on a
   laptop.
4. Toggle a room and an offer as featured; confirm the homepage reflects
   the change without a rebuild.
5. Edit `hero.title_line1` / `home_cta.title` in `/admin/content` and verify
   the homepage updates within one refresh.
6. Test mobile polish on a real device (§6).
7. Re-check the browser console — should be error-free.
