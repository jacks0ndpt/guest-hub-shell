# Phase B1 — Editable Homepage Sections

## What changed

- **`src/lib/sectionIcons.ts`** *(new)* — safe whitelist mapping `icon_key` strings to Lucide components, with `resolveSectionIcon()` falling back to `Sparkles` for unknown keys.
- **`src/hooks/useSiteContent.ts`** — extended:
  - Widened `SiteContentValue` so sections can hold arrays/objects (for `items_json`).
  - Added defaults & schemas for 4 new sections: `trust_strip`, `why_us`, `guest_convenience`, `home_cta`.
  - `SECTION_FIELDS` now supports two kinds of fields: bilingual `text` (with `nonLocalized` flag for things like URLs/image), and `items` (repeatable arrays with per-item field specs).
  - New readers: `getRaw()` for non-localized scalars, `getItems()` for active items sorted by `sort_order`.
- **`src/components/admin/SectionItemsEditor.tsx`** *(new)* — generic repeater editor: add / delete / move up / move down / toggle active, icon picker constrained to whitelist, per-item bilingual fields rendered as RO+EN pairs.
- **`src/pages/admin/AdminContent.tsx`** — text section editor now:
  - Renders non-localized fields above the RO/EN tabs (`image_url`, `primary_cta_url`, …).
  - Renders bilingual fields inside the existing RO/EN tabs.
  - Renders any `items_json` field with `SectionItemsEditor` below a divider.
  - Existing save flow unchanged (single upsert into `site_content` per section).
- **`src/hooks/useHomepageSection.ts`** *(new)* — public-side helper hook that returns a UI-friendly localized shape (`eyebrow`, `title`, `subtitle`, `body`, `imageUrl`, `primaryCta`, `secondaryCta`, `items[]`) for the new sections. Homepage layout is **not** wired yet — that's the next phase.
- **`src/i18n/locales/{en,ro}.json`** — added section labels/descriptions for the 4 new keys plus repeater UI strings (`items.add`, `items.empty`, `items.moveUp`, `items.moveDown`).
- **Migration** — seeded default `site_content` rows for `trust_strip`, `why_us`, `guest_convenience`, `home_cta` with `ON CONFLICT (section_key) DO NOTHING` (existing rows untouched).

## New `site_content` keys

| `section_key` | Shape |
| --- | --- |
| `trust_strip` | `eyebrow`, `title`, `subtitle` (bilingual) + `items_json[{ icon_key, label_*, description_*, is_active, sort_order }]` |
| `why_us` | `eyebrow`, `title`, `subtitle` (bilingual) + `items_json[{ icon_key, title_*, description_*, is_active, sort_order }]` |
| `guest_convenience` | `eyebrow`, `title`, `subtitle`, `body`, `primary_cta_label` (bilingual), `image_url`, `primary_cta_url` (raw) + `items_json[{ icon_key, title_*, description_*, … }]` |
| `home_cta` | `eyebrow`, `title`, `subtitle`, `body`, `primary_cta_label`, `secondary_cta_label` (bilingual), `primary_cta_url`, `secondary_cta_url` (raw) + `items_json[{ icon_key, label_*, description_*, … }]` |

## How the `items_json` repeater works

- Stored as a JSON array inside `site_content.content.items_json`.
- Each item is a flat object with whatever keys the section's `itemFields` schema declares; bilingual fields become `<key>_ro` + `<key>_en`, plus `icon_key`, `is_active`, `sort_order`.
- The admin UI:
  - **Add** appends an item with `is_active: true` and the next `sort_order`.
  - **Up / Down** swaps items and re-numbers `sort_order`.
  - **Delete** removes and re-numbers.
  - **Switch** toggles `is_active` without removing the item.
  - **Icon select** is restricted to whitelisted keys in `src/lib/sectionIcons.ts`.
- Save uses the existing single-row `site_content` upsert — no new tables.
- Public reads via `getItems(content, section_key)` filter inactive items and sort by `sort_order`; the `useHomepageSection` hook returns a fully localized view per current language.

## What to test manually

1. `/admin/content` loads; existing sections (hero, about, amenities, location, contact, footer) still display and save in RO/EN.
2. New sections appear: **Trust strip**, **Why us**, **Guest convenience**, **Final CTA**.
3. Edit RO and EN copy in a new section and save → reload page → values persist.
4. In a new section, add a repeater item, fill RO + EN + pick an icon → save → reload → item persists with the same icon.
5. Reorder items with up/down arrows → save → order persists.
6. Toggle an item off → save → reload → it stays in the editor but `getItems` excludes it on the public side.
7. For `guest_convenience` and `home_cta`, edit the non-localized URL/image fields → save → values persist independently of RO/EN tabs.
8. `/admin/testimonials`, `/admin/rooms`, `/admin/offers`, `/admin/services`, `/admin/requests`, `/admin/reports`, `/admin/settings` still load.
9. Public `/` homepage still renders (no layout change in this phase).
10. Scan a room QR → `/r/<code>` GuestHub still loads, requests still submit, admin real-time badge still increments.
