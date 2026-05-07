# Hotel GuestHub — Technical Documentation

> Last updated: May 2026 · MVP for sales validation

This document explains how Hotel GuestHub works end-to-end: frontend, backend, database, authentication, integrations, and operational concerns. For a non-technical "how do I use it" walkthrough, see **ADMIN_GUIDE.md**.

---

## 1. Product overview

Hotel GuestHub is a SaaS-style application sold to small/independent hotels for ~€30/month. It bundles four things into one product:

1. **Public hotel website** — homepage, rooms, gallery, offers, location, contact.
2. **QR-based guest service hub** — guests scan a QR in their room and request services, towels, taxis, late check-out, paid extras, etc.
3. **Staff admin dashboard** — manage requests, services, rooms, content, branding.
4. **Monthly value dashboard** — quantifies guest interactions, paid extras revenue, time saved, so the hotel owner sees ROI.

Bilingual: English / Romanian (toggle in navbar and admin header).

---

## 2. Tech stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript 5 |
| Styling | Tailwind CSS v3 + shadcn/ui + custom design tokens (HSL) |
| Routing | react-router-dom v6 |
| State / data | @tanstack/react-query, native Supabase client |
| i18n | react-i18next + i18next-browser-languagedetector |
| Backend | Lovable Cloud (managed Supabase) |
| Database | Postgres (Supabase) with Row Level Security |
| Auth | Supabase Auth (email + password) |
| Storage | Supabase Storage (`room-images`, `site-images` public buckets) |
| Edge functions | Deno-based Supabase Edge Functions (`send-contact-reply`) |
| Email (optional) | Resend via Lovable connector gateway |
| QR generation | Client-side via `QRCodeImage` component |

---

## 3. Project structure

```
src/
  App.tsx                 Router + global providers
  main.tsx                Bootstraps React, loads i18n
  i18n/                   Translation setup + en.json + ro.json
  components/
    site/                 Public website chrome (Navbar, Footer, hero, etc.)
    admin/                Admin layout, dialogs, image uploaders, role guard
    guest/                Guest hub layout, request/feedback dialogs
    ui/                   shadcn primitives
    LanguageSwitcher.tsx  EN/RO dropdown
  context/AuthContext.tsx Auth + role state, exposed via useAuth()
  hooks/                  useProperty, useRooms, useReports, useSiteContent…
  pages/
    Index, Rooms, RoomDetail, Gallery, Offers, Location, Contact, NotFound
    guest/                GuestHub, RoomQR
    admin/                AdminLogin, AdminDashboard, AdminRequests,
                          AdminServices, AdminRooms, AdminContent,
                          AdminMessages, AdminOffers, AdminQRCodes,
                          AdminReports, AdminSettings, AdminUsers,
                          AdminMVPChecklist
  integrations/supabase/  Auto-generated client + types (DO NOT EDIT)
  data/mock.ts            Fallback mock content used before DB hydrates
supabase/
  functions/send-contact-reply/index.ts
  migrations/             SQL migrations history
```

---

## 4. Routing map

### Public
| Path | Page |
|---|---|
| `/` | Homepage |
| `/rooms` | Rooms index |
| `/rooms/:slug` | Room detail (DB-backed) |
| `/gallery` | Gallery |
| `/offers` | Offers (toggleable) |
| `/location` | Location |
| `/contact` | Contact form |

### Guest QR
| Path | Page |
|---|---|
| `/guest` | Generic guest hub |
| `/r/:qrCodeSlug` | Room-specific QR landing page |

### Admin (all behind `<ProtectedRoute>`)
| Path | Page |
|---|---|
| `/admin/login` | Login + signup |
| `/admin` | Dashboard |
| `/admin/requests` | Inbox of guest requests |
| `/admin/messages` | Contact form messages |
| `/admin/services` | Services & paid extras catalog |
| `/admin/rooms` | Rooms CRUD with image gallery |
| `/admin/offers` | Promotional offers CRUD |
| `/admin/qr-codes` | QR codes per room |
| `/admin/content` | Hero image, gallery, text sections |
| `/admin/reports` | Monthly value dashboard |
| `/admin/users` | Admin role management |
| `/admin/mvp-checklist` | Demo readiness checklist |
| `/admin/settings` | Property branding, hours, contact info |

A discreet "Staff" link in the public footer leads to `/admin/login`.

---

## 5. Authentication & authorisation

### Auth provider
Supabase Auth with email + password. No social providers in MVP. Sessions persist in `localStorage` and refresh automatically.

### Auth flow
1. User signs in/up at `/admin/login`.
2. `AuthContext` listens via `supabase.auth.onAuthStateChange` and stores `session`, `user`.
3. After login, role lookup runs on the `user_roles` table to set `isAdmin`.
4. `<ProtectedRoute>` blocks unauthenticated/non-admin users from `/admin/*`.

### Role model
Roles live in their own table — never on profiles — to avoid privilege escalation.

```sql
public.user_roles (id, user_id, role app_role, created_at)
```

A `SECURITY DEFINER` function `private.has_role(uid, role)` is used inside RLS policies to safely check admin status without recursion.

### First admin & promotion
- A trigger on `auth.users` (`on_auth_user_created_first_admin`) automatically grants `admin` to the **first** account that signs up.
- Subsequent signups are non-admin by default.
- Existing admins can grant/revoke admin from `/admin/users` (insert/delete on `user_roles`).
- The UI prevents revoking the last admin or your own admin row.

---

## 6. Database schema (Postgres)

All tables are in the `public` schema unless noted. RLS is **enabled on every table**.

| Table | Purpose | Public read? | Admin write? |
|---|---|---|---|
| `property_settings` | Single hotel record: name, brand colours, hours, contact, hero image | ✅ | ✅ |
| `rooms` | Room types with gallery, amenities, pricing | active rows | ✅ |
| `room_codes` | QR slugs per physical room | active rows | ✅ |
| `service_categories` | Groups for the service catalog | active rows | ✅ |
| `service_items` | Individual services (free or paid extra) | active rows | ✅ |
| `guest_requests` | Submitted by QR/guest hub, managed by staff | guest insert / admin RUD | ✅ |
| `private_feedback` | Star + comment from guest | guest insert / admin RU | ✅ |
| `contact_messages` | Public contact form submissions | guest insert / admin RUD | ✅ |
| `offers` | Promo packages | active rows | ✅ |
| `site_content` | Section-keyed JSONB for editable copy | ✅ | ✅ |
| `site_gallery` | Public gallery images | active rows | ✅ |
| `user_roles` | Admin role assignments | self only | admin only |

### Storage buckets (Supabase Storage)
| Bucket | Public | Used by |
|---|---|---|
| `room-images` | Yes | Room main + gallery uploads |
| `site-images` | Yes | Hero image, public gallery |

### Triggers / functions
- `set_updated_at()` — generic timestamp trigger.
- `validate_guest_request_status()` — guards request status enum values.
- `private.has_role(uid, role)` — RLS helper, SECURITY DEFINER.
- `public.handle_first_admin()` + trigger — first signup → admin.

---

## 7. Internationalisation

- Library: `react-i18next` + `i18next-browser-languagedetector`.
- Dictionaries: `src/i18n/locales/en.json`, `ro.json`.
- Detection order: `localStorage` (key `guesthub_lang`) → browser language → fallback `en`.
- UI toggle: `<LanguageSwitcher />` in the public navbar and admin header.
- Translation keys cover navigation, common labels, footer, room page, admin chrome, auth screens.
- **Dynamic content** (rooms, offers, services, custom text in Content) is stored in the database in whatever language the admin entered. To make user-entered content fully bilingual, you would extend the relevant tables with `*_ro` columns or a separate translations table — out of scope for the current MVP.

---

## 8. Backend keys, secrets, environment

### Frontend `.env` (auto-managed, do not edit)
| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key — safe in client |
| `VITE_SUPABASE_PROJECT_ID` | Project ref |

### Server-side secrets (used inside edge functions)
| Secret | Purpose |
|---|---|
| `SUPABASE_URL` | Project URL inside functions |
| `SUPABASE_PUBLISHABLE_KEY` | Anon key for functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged key, server-only |
| `SUPABASE_DB_URL` | Direct Postgres URL (admin operations) |
| `LOVABLE_API_KEY` | Auth header for Lovable connector gateway (Resend, etc.) |

To send real email replies from `/admin/messages`, connect Resend via Lovable's connector gateway. The `send-contact-reply` edge function will then deliver replies.

---

## 9. Edge functions

### `send-contact-reply`
- **Trigger**: invoked from `/admin/messages` when an admin types a reply and clicks Send.
- **Behaviour**: validates payload, looks up the message, calls Resend through the Lovable gateway (`https://connector-gateway.lovable.dev/resend`), and updates `contact_messages.status = 'replied'` with `reply_text`, `replied_at`, `replied_by`.
- **Deployment**: automatic on save. Requires Resend connection and `LOVABLE_API_KEY` (auto-provided).

---

## 10. Public website data flow

```
property_settings, site_content, site_gallery, rooms, offers
        │
        ▼
useProperty / useSiteContent / useRooms hooks
        │
        ▼
Public pages (Index, Rooms, RoomDetail, Gallery, Offers…) + PropertyTheme
        │
        ▼
Guest sees branded site with up-to-date content & colours
```

`PropertyTheme` reads `primary_color` / `secondary_color` from `property_settings`, converts them to HSL, and writes them to CSS custom properties so Tailwind tokens reflect the chosen brand.

---

## 11. Guest QR flow

1. Admin creates a room → row inserted in `rooms` and a matching `room_codes` row with a unique `qr_code_slug`.
2. Admin downloads the QR image from `/admin/qr-codes` and places it in the physical room.
3. Guest scans the QR → opens `/r/:qrCodeSlug`.
4. Page loads service catalog from `service_categories` + `service_items`.
5. Guest submits a request → row inserted in `guest_requests` with `room_code_id` and optional `service_item_id` / `estimated_value`.
6. Optional: guest leaves star rating + comment → `private_feedback`.
7. Staff sees the request immediately in `/admin/requests` and progresses status: `new → in_progress → done` (with reopen option).

---

## 12. Monthly value dashboard

`/admin/reports` aggregates from `guest_requests`, `private_feedback`, `service_items`:
- Number of guest interactions handled.
- Paid extras revenue (`is_paid_extra = true` × `price_estimate` or per-request `estimated_value`).
- Estimated staff time saved (configurable per service).
- Average satisfaction.
- Trend vs previous month.

Goal: justify the monthly subscription with a number the owner can defend.

---

## 13. Security model

- **RLS on every table.** Default deny — no implicit access.
- **Role check via SECURITY DEFINER** function in `private` schema, prevents recursive policy evaluation and privilege leaks.
- **Service-role key never reaches the client.** Used only inside edge functions.
- **Trigger function `handle_first_admin`** is `EXECUTE` revoked from `anon` and `authenticated`; only the trigger can invoke it.
- **Public buckets** (`room-images`, `site-images`) allow guest browsers to load images. Listing is restricted to admins via RLS on `storage.objects` (recommended hardening — see linter notes).

---

## 14. Local development & deployment

- Vite dev server runs in the Lovable sandbox; hot reload on save.
- Database changes go through migrations in `supabase/migrations/` — never hand-edit production.
- Edge functions deploy automatically on save; no manual deploy required.
- Production publishing: use Lovable's **Publish** action in the editor.

---

## 15. Out of scope for MVP

These are deliberately **not** built so the MVP stays demo-able and sellable:
- Payment processing
- Booking engine
- PMS integration
- AI chatbot
- Native mobile apps
- Multi-property tenancy

---

## 16. Quick reference — adding a new admin

1. Have the new staff member open `/admin/login` and click **Sign up**.
2. They fill email + password and submit.
3. You go to `/admin/users`, copy their user UUID from the auth backend (or have them paste it from the browser console after login: `(await supabase.auth.getUser()).data.user.id`).
4. Paste UUID into the "Grant admin" field and submit.
5. They sign out and back in — they now have full admin access.
