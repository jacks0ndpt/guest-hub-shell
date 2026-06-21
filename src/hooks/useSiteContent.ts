import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pickLocalizedJson, useLang, type Lang } from "@/lib/i18nContent";

export type SiteContentMap = Record<string, Record<string, string>>;

/**
 * Bilingual defaults. Each editable string exists as `<key>_ro` and `<key>_en`.
 * Legacy single-language keys are still read as a final fallback.
 */
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
};

/** Field schema for the admin editor (per language). */
export const SECTION_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
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
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContentMap>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const lang = useLang();

  const load = async () => {
    const { data } = await supabase.from("site_content").select("section_key, content");
    if (data) {
      const map: SiteContentMap = { ...DEFAULT_CONTENT };
      for (const row of data as { section_key: string; content: Record<string, string> }[]) {
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

/**
 * Language-aware reader.
 *  - Looks up `<key>_<lang>`, then `<key>_ro`, then legacy `<key>`.
 *  - Caller does not need to know the active language.
 */
export const get = (content: SiteContentMap, section: string, key: string, lang?: Lang) => {
  const sec = content[section] ?? DEFAULT_CONTENT[section];
  const effective: Lang =
    lang ??
    ((typeof window !== "undefined" && (localStorage.getItem("guesthub_lang") || "ro").startsWith("en"))
      ? "en"
      : "ro");
  return pickLocalizedJson(sec, key, effective) || pickLocalizedJson(DEFAULT_CONTENT[section], key, effective);
};
