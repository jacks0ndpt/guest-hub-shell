# Operational Admin Build Plan

Preserves all existing public pages, GuestHub, auth, layout, and Supabase schema. Only changes admin pages plus one small RLS/status alignment migration and a demo seed.

## 1. Status model alignment (migration + minor code)

The current schema lets guests insert with `status='open'` only, and existing code uses `open`/`completed`. The new spec uses `new`, `in_progress`, `done`, `cancelled`, `accepted`, `rejected`.

- Migration: relax the `guest_requests` INSERT RLS policy to require `status IN ('new','open')` so the public form works whether it sends `new` or `open`. Add a CHECK-equivalent validation trigger ensuring status is one of the allowed 6 values.
- Backfill: update existing rows where `status='open'` → `'new'` and `status='completed'` → `'done'`.
- Update `RequestDialog.tsx` and dashboard counts to use `new` (instead of `open`) and `done` (instead of `completed`). GuestHub behavior unchanged for users.

## 2. /admin/requests — full board

Rebuild `AdminRequests.tsx` as a desktop table + mobile card hybrid:

Columns: Room · Service (title + category) · Guest (name/contact) · Note · Status badge · Est. value · Created · Staff note · Actions.

Filters bar: status dropdown, room dropdown (from `room_codes`), category dropdown, paid-extras-only toggle, date preset (Today / This month / All), sort (Newest / Oldest).

Per-row actions (context-aware on `is_paid_extra`):
- Normal: Mark in progress · Mark done · Cancel
- Paid extra: Accept · Reject · Mark done · Cancel
- Edit staff note (inline popover with textarea + save)

Empty state: "No guest requests yet. Requests submitted through the QR GuestHub will appear here."

Data: single query joining `guest_requests` with `service_items` (for title, category_id, is_paid_extra) and `room_codes` (for room_label). Resolve category names via `service_categories` lookup map.

## 3. /admin/services — full CRUD

Rebuild `AdminServices.tsx`:
- Grouped list by category, each row shows title, price, badges (paid/staff/active).
- "New item" button opens a dialog form with: title, description, category select, price_estimate, is_paid_extra switch, requires_staff_confirmation switch, is_active switch, sort_order number.
- Row actions: Edit (same dialog prefilled), Toggle active (quick switch), Delete (confirm).
- Reuses the `ServiceItemDialog` component for create + edit.
- Inactive items hidden from GuestHub (already enforced via `is_active=true` filter in `useGuestHub`).

## 4. /admin/rooms — full CRUD

Rebuild `AdminRooms.tsx`:
- Grid of room cards (current visual) + "New room" button + per-card Edit / Toggle active / Delete.
- `RoomDialog` form: name, slug (auto-suggested from name), short_description, long_description (textarea), capacity, bed_type, amenities (comma-separated → array), main_image_url, gallery_image_urls (one per line → array), is_active, sort_order.
- Public `/rooms` already filters `is_active=true` via `useRooms`.

## 5. /admin/settings — extended form

Extend `AdminSettings.tsx` with missing fields: `property_type`, `city`, `country`, `language_default`, `logo_url`. Keep current save logic (insert if no row, update if row exists). Confirm Navbar/Footer/Index already pull from `useProperty` so name/contact updates propagate; add `logo_url` rendering in Navbar and GuestLayout if present (small change).

## 6. /admin/qr-codes — generate QR images

Add `qrcode` npm package. Render an actual QR image (canvas/SVG dataURL) for each `/r/:slug` URL alongside copy/open/active badge. Add a "Download PNG" button per row. Sidebar entry already exists.

## 7. Demo seed (idempotent)

One-time SQL insert (via insert tool) that only runs if `guest_requests` is empty: insert 4 demo rows for rooms 101, 102, 204, 103 matching the spec, mapping to existing `room_codes` and `service_items` by slug/title lookup.

## 8. Security & scope

- All admin routes stay wrapped in `ProtectedRoute` (already in `App.tsx`).
- Existing RLS already restricts all writes to `has_role(admin)`. No policy widening for admin tables.
- GuestHub stays public, unchanged.
- No payments, no PMS, no new secrets.

## Technical details

**Files to create**
- `src/components/admin/ServiceItemDialog.tsx`
- `src/components/admin/RoomDialog.tsx`
- `src/components/admin/RequestActions.tsx` (status buttons + staff note popover)
- `src/components/admin/QRCodeImage.tsx` (canvas-based QR using `qrcode` lib)

**Files to edit**
- `src/pages/admin/AdminRequests.tsx` — full rewrite per §2
- `src/pages/admin/AdminServices.tsx` — full rewrite per §3
- `src/pages/admin/AdminRooms.tsx` — full rewrite per §4
- `src/pages/admin/AdminSettings.tsx` — add fields per §5
- `src/pages/admin/AdminQRCodes.tsx` — embed QR images
- `src/pages/admin/AdminDashboard.tsx` — count `new`/`done` instead of `open`/`completed`
- `src/components/guest/RequestDialog.tsx` — insert with `status: 'new'`
- `src/components/site/Navbar.tsx`, `src/components/guest/GuestLayout.tsx` — render `logo_url` if present

**Migrations**
1. Drop & recreate `guest_requests` INSERT policy: `WITH CHECK (room_code_id IS NOT NULL AND status IN ('new','open') AND completed_at IS NULL)`.
2. Add validation trigger on `guest_requests` enforcing `status IN ('new','in_progress','done','cancelled','accepted','rejected','open','completed')` (keep legacy values valid to avoid breakage).
3. Backfill: `UPDATE guest_requests SET status='new' WHERE status='open'; UPDATE guest_requests SET status='done' WHERE status='completed';`

**Dependencies**
- Add `qrcode` and `@types/qrcode`.

After implementation: smoke-check `/admin/requests`, `/admin/services`, `/admin/rooms`, `/admin/settings`, `/admin/qr-codes`, and confirm GuestHub at `/r/room-101` still submits and appears in the new board.
