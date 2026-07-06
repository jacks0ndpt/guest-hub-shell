# Bugfix batch summary

## Bugs fixed
1. **Admin Amenities / Testimonials — "permission denied for function has_role"**  
   Their RLS policies used the unqualified `public.has_role`, which `authenticated` has no EXECUTE on. Rewrote all amenities + testimonials policies to use the schema-qualified `private.has_role(auth.uid(), 'admin')` — the same helper the rest of the admin tables (rooms, offers, site_content, user_roles) already use.  
   RLS remains enabled; public still only sees `is_active = true` rows; only admins can write.

2. **QR admin card overflow** — buttons now use `grid grid-cols-1 sm:grid-cols-3` with `w-full min-w-0` and `truncate` labels so Copy/Open/PNG stay inside the card at every width.

3. **Homepage hero flashes fallback image** — `useProperty` now exposes `loading`; `HeroSection` accepts `imageLoading` and renders a neutral gradient placeholder while property settings are still loading (only when no saved hero URL yet). Fallback image still used after load if `hero_image_url` is empty.

4. **Room card bilingual mismatch** — added `src/lib/amenityTranslations.ts` with a common RO/EN amenity map (Wi-Fi, Smart TV, Rain shower, Queen/King bed, AC, breakfast, balcony, mountain view, etc.). `useRooms` now runs the resolved amenity array through `translateAmenities(lang)` after picking the localized DB field, so RO mode no longer shows English chips from legacy `amenities`.

5. **Room detail gallery lightbox** — new `src/components/site/ImageLightbox.tsx` (Escape closes, ←/→ navigate, counter, close button, mobile-friendly). Room hero image and every gallery thumbnail on `/rooms/:slug` now open the lightbox.

6. **Location/travel/parking copy not editable** — added `location_details` section to `DEFAULT_CONTENT` and `SECTION_FIELDS` in `useSiteContent.ts` (transport/parking/getting-around headings + bodies, RO/EN; repeatable `items_json` with `icon_key`, `label_ro/en`, `time_ro/en`). `/location` now renders that section via `useSiteContent` with i18n fallbacks. `/admin/content` shows it automatically thanks to the generic renderer.

7. **GuestHub bilingual consistency** — GuestHub shell/dialogs already use i18n. Root cause: seed `service_categories.name_ro` / `service_items.title_ro` held English text. Migration filled Romanian + English translations for the demo catalog (Menaj, Recepție, Servicii extra, Ajutor local, Feedback; Prosoape suplimentare, Curățenie cameră, Problemă tehnică, Check-out târziu, Mic dejun extra, Transfer aeroport, Rezervare parcare, Solicită taxi, Recomandare restaurant local, Feedback privat).

## Migrations
Single migration:
- Rewrote RLS policies on `public.amenities` and `public.testimonials` to use `private.has_role`.
- Data updates only on `service_categories` / `service_items` for RO/EN translations.
- No schema changes, no RLS weakening, no new tables.

## Files changed
- `src/components/site/HeroSection.tsx` — `imageLoading` prop + placeholder.
- `src/components/site/ImageLightbox.tsx` — **new**.
- `src/hooks/useProperty.ts` — already exposed `loading`; wired through.
- `src/hooks/useRooms.ts` — amenity translation applied post-pick.
- `src/hooks/useSiteContent.ts` — `location_details` defaults + admin field spec.
- `src/lib/amenityTranslations.ts` — **new**.
- `src/lib/sectionIcons.ts` — added `train`, `plane` icons.
- `src/pages/Index.tsx` — passes `imageLoading`.
- `src/pages/Location.tsx` — reads editable `location_details`.
- `src/pages/RoomDetail.tsx` — lightbox integration.
- `src/pages/admin/AdminQRCodes.tsx` — button grid layout.
- `src/i18n/locales/{ro,en}.json` — `location_details` admin labels.

## Manual tests
1. `/admin/amenities` and `/admin/testimonials` load and CRUD works — no `permission denied` toast.
2. Public homepage still shows only active amenities and testimonials.
3. `/admin/qr-codes` at desktop and ~375px width — all three buttons fit inside each card.
4. Hard-refresh homepage — no flash of old hero (placeholder briefly, then saved image). Clear `hero_image_url` in `/admin/content` → fallback appears after load.
5. Switch to RO on `/rooms` and homepage featured rooms — descriptions + amenity chips are Romanian.
6. `/rooms/:slug` — click hero and any thumbnail; verify arrows, counter, Escape.
7. `/admin/content` shows a new "Location — details" section; edit headings/rows, save, and reload `/location` in both RO and EN.
8. `/guest` and `/r/<slug>` — RO mode shows Menaj/Recepție/etc; EN mode shows English labels; submit a request end-to-end.
9. Two-tab realtime check: admin `/admin/requests` + guest QR page — new request appears with toast/badge.
