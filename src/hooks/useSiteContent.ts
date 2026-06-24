import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pickLocalizedJson, useLang, type Lang } from "@/lib/i18nContent";

// Section content can hold bilingual strings AND repeatable item arrays (items_json),
// so we widen the value type from string to unknown.
export type SiteContentValue = string | unknown[] | Record<string, unknown> | number | boolean | null;
export type SiteContentSection = Record<string, SiteContentValue>;
export type SiteContentMap = Record<string, SiteContentSection>;

/**
 * Generic shape for items inside a repeatable items_json array.
 * Fields are loose because each section can store slightly different keys.
 */
export type SectionItem = {
  icon_key?: string;
  label_ro?: string;
  label_en?: string;
  title_ro?: string;
  title_en?: string;
  description_ro?: string;
  description_en?: string;
  is_active?: boolean;
  sort_order?: number;
  [k: string]: unknown;
};

/** Bilingual defaults for every editable section. */
export const DEFAULT_CONTENT: SiteContentMap = {
  hero: {
    eyebrow_ro: "",
    eyebrow_en: "",
    title_line1_ro: "Un sejur primitor între",
    title_line1_en: "A warm stay between the",
    title_line2_ro: "munți și orașul vechi.",
    title_line2_en: "mountains and the old town.",
    subtitle_ro: "",
    subtitle_en: "",
    primary_cta_label_ro: "Rezervă direct",
    primary_cta_label_en: "Book Direct",
    secondary_cta_label_ro: "Explorează camerele",
    secondary_cta_label_en: "Explore Rooms",
  },
  about: {
    eyebrow_ro: "Despre",
    eyebrow_en: "About",
    title_ro: "24 de camere liniștite. O ospitalitate sinceră.",
    title_en: "24 quiet rooms. One honest kind of hospitality.",
    paragraph1_ro:
      "Suntem un mic hotel boutique la câteva minute de centrul vechi al Brașovului — construit în jurul ideii că un sejur bun e simplu: o cameră liniștită, cafea bună și oameni care chiar cunosc orașul.",
    paragraph1_en:
      "We're a small boutique hotel a few minutes from Brașov's old town — built around the idea that a good stay is simple: a quiet room, good coffee, and people who actually know the city.",
    paragraph2_ro:
      "Fără ornamente inutile. Doar detaliile care contează, făcute bine — de la sosire până în ultima dimineață.",
    paragraph2_en:
      "No filler, no theatrics. Just the details that matter, done well — from your arrival to your last morning.",
  },
  amenities: {
    eyebrow_ro: "Facilități",
    eyebrow_en: "Amenities",
    title_ro: "Tot ce ai nevoie. Nimic în plus.",
    title_en: "Everything you need. Nothing you don't.",
  },
  location: {
    eyebrow_ro: "Locație",
    eyebrow_en: "Location",
    title_ro: "La doi pași de centrul vechi.",
    title_en: "Steps from Brașov old town.",
    description_ro:
      "6 minute pe jos până în Piața Sfatului, 20 de minute cu mașina până în Poiana Brașov și creasta Carpaților vizibilă din majoritatea camerelor.",
    description_en:
      "6 minutes to Piața Sfatului on foot, 20 minutes to Poiana Brașov ski slopes by car, and the Carpathian ridge visible from most of our rooms.",
  },
  contact: {
    eyebrow_ro: "Salut",
    eyebrow_en: "Say hello",
    title_ro: "Suntem mereu bucuroși să ajutăm.",
    title_en: "We're always happy to help.",
    description_ro:
      "Ai o întrebare despre sejur, o cerință specială sau vrei o recomandare în Brașov? Ne poți contacta cum preferi.",
    description_en:
      "Have a question about your stay, a special request, or need a recommendation in Brașov? Reach us any way you like.",
  },
  footer: {
    tagline_ro: "Un hotel boutique — camere liniștite, servicii sincere, totul la un click distanță.",
    tagline_en: "A boutique hotel — calm rooms, honest service, everything you need a tap away.",
  },

  // ── Phase B1 new homepage sections ────────────────────────────────────────
  trust_strip: {
    eyebrow_ro: "De ce noi",
    eyebrow_en: "Why us",
    title_ro: "Tot ce contează, inclus.",
    title_en: "Everything that matters, included.",
    subtitle_ro: "Câteva motive simple pentru care oaspeții aleg să se întoarcă.",
    subtitle_en: "A few simple reasons guests come back.",
    items_json: [
      { icon_key: "coffee", label_ro: "Mic dejun inclus", label_en: "Breakfast included", description_ro: "Servit zilnic, 07:30–10:30.", description_en: "Served daily, 07:30–10:30.", is_active: true, sort_order: 0 },
      { icon_key: "parking", label_ro: "Parcare gratuită", label_en: "Free parking", description_ro: "Loc rezervat la sosire.", description_en: "Reserved spot on arrival.", is_active: true, sort_order: 1 },
      { icon_key: "wifi", label_ro: "Wi-Fi rapid", label_en: "Fast Wi-Fi", description_ro: "Stabil în toată proprietatea.", description_en: "Stable across the property.", is_active: true, sort_order: 2 },
      { icon_key: "map-pin", label_ro: "Aproape de centrul vechi", label_en: "Near the old town", description_ro: "6 minute pe jos.", description_en: "6 minutes on foot.", is_active: true, sort_order: 3 },
      { icon_key: "message-circle", label_ro: "Suport pe WhatsApp", label_en: "WhatsApp support", description_ro: "Răspundem rapid, în limba ta.", description_en: "We reply fast, in your language.", is_active: true, sort_order: 4 },
    ],
  },
  why_us: {
    eyebrow_ro: "De ce ne aleg oaspeții",
    eyebrow_en: "Why guests love us",
    title_ro: "Un sejur gândit până în cel mai mic detaliu.",
    title_en: "A stay thought through to the smallest detail.",
    subtitle_ro: "Promitem puțin și ținem mult.",
    subtitle_en: "We promise little and deliver a lot.",
    items_json: [
      { icon_key: "heart", title_ro: "Confort ca acasă", title_en: "Comfort like home", description_ro: "Saltele bune, lenjerie curată, liniște garantată.", description_en: "Good mattresses, fresh linens, real quiet.", is_active: true, sort_order: 0 },
      { icon_key: "map-pin", title_ro: "Locație excelentă", title_en: "Excellent location", description_ro: "La pas de centrul vechi și restaurantele bune.", description_en: "A short walk from the old town and the best restaurants.", is_active: true, sort_order: 1 },
      { icon_key: "sparkles", title_ro: "Atmosferă primitoare", title_en: "Welcoming atmosphere", description_ro: "O echipă mică, atentă la oameni, nu la scenarii.", description_en: "A small team that cares about people, not scripts.", is_active: true, sort_order: 2 },
      { icon_key: "star", title_ro: "Raport bun calitate-preț", title_en: "Good value for money", description_ro: "Tarife corecte, fără surprize la plecare.", description_en: "Fair rates, no surprises at checkout.", is_active: true, sort_order: 3 },
    ],
  },
  guest_convenience: {
    eyebrow_ro: "Pentru oaspeții noștri",
    eyebrow_en: "For our guests",
    title_ro: "Tot ce ai nevoie, fără drumuri la recepție.",
    title_en: "Everything you need — without a trip to the front desk.",
    subtitle_ro: "Cere ce ai nevoie, oricând, din camera ta.",
    subtitle_en: "Ask for what you need, anytime, from your room.",
    body_ro: "De la prosoape în plus la o recomandare bună pentru cină, suntem doar la un mesaj distanță.",
    body_en: "From extra towels to a great dinner recommendation, we're just a tap away.",
    image_url: "",
    primary_cta_label_ro: "Vezi cum funcționează",
    primary_cta_label_en: "See how it works",
    primary_cta_url: "/rooms",
    items_json: [
      { icon_key: "towel", title_ro: "Solicită prosoape", title_en: "Request towels", description_ro: "Aduse rapid în cameră.", description_en: "Delivered quickly to your room.", is_active: true, sort_order: 0 },
      { icon_key: "car", title_ro: "Rezervă taxi", title_en: "Request taxi", description_ro: "Cu un singur mesaj.", description_en: "With a single message.", is_active: true, sort_order: 1 },
      { icon_key: "map-pin", title_ro: "Recomandări locale", title_en: "Local recommendations", description_ro: "Sfaturi de la oameni care chiar trăiesc aici.", description_en: "Tips from people who actually live here.", is_active: true, sort_order: 2 },
      { icon_key: "clock", title_ro: "Check-out târziu", title_en: "Late check-out", description_ro: "Când programul îți permite o dimineață liniștită.", description_en: "When your day allows a slow morning.", is_active: true, sort_order: 3 },
    ],
  },
  home_cta: {
    eyebrow_ro: "Rezervă direct",
    eyebrow_en: "Book direct",
    title_ro: "Cel mai bun preț e mereu pe site-ul nostru.",
    title_en: "The best price is always on our website.",
    subtitle_ro: "Rezervi în câteva secunde, fără comisioane intermediare.",
    subtitle_en: "Book in seconds, no middleman fees.",
    body_ro: "",
    body_en: "",
    primary_cta_label_ro: "Rezervă acum",
    primary_cta_label_en: "Book now",
    primary_cta_url: "",
    secondary_cta_label_ro: "Vorbește cu noi",
    secondary_cta_label_en: "Talk to us",
    secondary_cta_url: "/contact",
    items_json: [
      { icon_key: "check-circle", label_ro: "Cel mai bun preț garantat", label_en: "Best direct rate", is_active: true, sort_order: 0 },
      { icon_key: "clock", label_ro: "Confirmare rapidă", label_en: "Fast confirmation", is_active: true, sort_order: 1 },
      { icon_key: "shield", label_ro: "Fără taxe ascunse", label_en: "No hidden fees", is_active: true, sort_order: 2 },
      { icon_key: "phone", label_ro: "Suport direct", label_en: "Direct support", is_active: true, sort_order: 3 },
    ],
  },
};

// ── Schema for the admin editor ───────────────────────────────────────────
export type ItemFieldSpec =
  | { key: string; label: string; type: "text" | "textarea"; bilingual?: boolean }
  | { key: string; label: string; type: "icon" };

export type SectionFieldSpec =
  | { kind?: "text"; key: string; label: string; multiline?: boolean; nonLocalized?: boolean }
  | { kind: "items"; key: string; label: string; itemLabel: string; itemFields: ItemFieldSpec[] };

const COMMON_ITEM_ICON: ItemFieldSpec = { key: "icon_key", label: "Icon", type: "icon" };

export const SECTION_FIELDS: Record<string, SectionFieldSpec[]> = {
  hero: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title_line1", label: "Title line 1" },
    { key: "title_line2", label: "Title line 2" },
    { key: "subtitle", label: "Subtitle", multiline: true },
    { key: "primary_cta_label", label: "Primary CTA label" },
    { key: "secondary_cta_label", label: "Secondary CTA label" },
  ],
  about: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "paragraph1", label: "Paragraph 1", multiline: true },
    { key: "paragraph2", label: "Paragraph 2", multiline: true },
  ],
  amenities: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
  ],
  location: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
  ],
  contact: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
  ],
  footer: [{ key: "tagline", label: "Tagline", multiline: true }],

  trust_strip: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle", multiline: true },
    {
      kind: "items",
      key: "items_json",
      label: "Trust items",
      itemLabel: "Item",
      itemFields: [
        COMMON_ITEM_ICON,
        { key: "label", label: "Label", type: "text", bilingual: true },
        { key: "description", label: "Description", type: "textarea", bilingual: true },
      ],
    },
  ],
  why_us: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle", multiline: true },
    {
      kind: "items",
      key: "items_json",
      label: "Reasons",
      itemLabel: "Reason",
      itemFields: [
        COMMON_ITEM_ICON,
        { key: "title", label: "Title", type: "text", bilingual: true },
        { key: "description", label: "Description", type: "textarea", bilingual: true },
      ],
    },
  ],
  guest_convenience: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle", multiline: true },
    { key: "body", label: "Body", multiline: true },
    { key: "image_url", label: "Image URL", nonLocalized: true },
    { key: "primary_cta_label", label: "Primary CTA label" },
    { key: "primary_cta_url", label: "Primary CTA URL", nonLocalized: true },
    {
      kind: "items",
      key: "items_json",
      label: "Service highlights",
      itemLabel: "Highlight",
      itemFields: [
        COMMON_ITEM_ICON,
        { key: "title", label: "Title", type: "text", bilingual: true },
        { key: "description", label: "Description", type: "textarea", bilingual: true },
      ],
    },
  ],
  home_cta: [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle", multiline: true },
    { key: "body", label: "Body", multiline: true },
    { key: "primary_cta_label", label: "Primary CTA label" },
    { key: "primary_cta_url", label: "Primary CTA URL", nonLocalized: true },
    { key: "secondary_cta_label", label: "Secondary CTA label" },
    { key: "secondary_cta_url", label: "Secondary CTA URL", nonLocalized: true },
    {
      kind: "items",
      key: "items_json",
      label: "Benefit bullets",
      itemLabel: "Bullet",
      itemFields: [
        COMMON_ITEM_ICON,
        { key: "label", label: "Label", type: "text", bilingual: true },
        { key: "description", label: "Description", type: "textarea", bilingual: true },
      ],
    },
  ],
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContentMap>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const lang = useLang();

  const load = async () => {
    const { data } = await supabase.from("site_content").select("section_key, content");
    if (data) {
      const map: SiteContentMap = { ...DEFAULT_CONTENT };
      for (const row of data as { section_key: string; content: Record<string, SiteContentValue> }[]) {
        map[row.section_key] = { ...(DEFAULT_CONTENT[row.section_key] ?? {}), ...(row.content ?? {}) };
      }
      setContent(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return { content, loading, reload: load, lang };
};

/** Read a localized scalar string from a section. */
export const get = (content: SiteContentMap, section: string, key: string, lang?: Lang) => {
  const sec = (content[section] ?? DEFAULT_CONTENT[section]) as Record<string, string> | undefined;
  const effective: Lang =
    lang ??
    ((typeof window !== "undefined" && (localStorage.getItem("guesthub_lang") || "ro").startsWith("en"))
      ? "en"
      : "ro");
  return (
    pickLocalizedJson(sec, key, effective) ||
    pickLocalizedJson(DEFAULT_CONTENT[section] as Record<string, string> | undefined, key, effective)
  );
};

/** Read a non-localized raw value (e.g. URLs). */
export const getRaw = (content: SiteContentMap, section: string, key: string): string => {
  const sec = content[section] ?? DEFAULT_CONTENT[section];
  const v = sec?.[key];
  if (typeof v === "string") return v;
  const dv = DEFAULT_CONTENT[section]?.[key];
  return typeof dv === "string" ? dv : "";
};

/** Read the active items array from a repeatable section (sorted by sort_order). */
export const getItems = (content: SiteContentMap, section: string): SectionItem[] => {
  const sec = content[section] ?? DEFAULT_CONTENT[section];
  const raw = sec?.items_json;
  const list: SectionItem[] = Array.isArray(raw)
    ? (raw as SectionItem[])
    : (DEFAULT_CONTENT[section]?.items_json as SectionItem[] | undefined) ?? [];
  return list
    .filter((it) => it && it.is_active !== false)
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
};
