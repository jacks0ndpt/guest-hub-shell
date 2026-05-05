import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContentMap = Record<string, Record<string, string>>;

export const DEFAULT_CONTENT: SiteContentMap = {
  hero: {
    eyebrow: "",
    title_line1: "A warm stay between the",
    title_line2: "mountains and the old town.",
    subtitle: "",
    primary_cta_label: "Book Direct",
    secondary_cta_label: "Explore Rooms",
  },
  about: {
    eyebrow: "About",
    title: "24 quiet rooms. One honest kind of hospitality.",
    paragraph1:
      "We're a small boutique hotel a few minutes from Brașov's old town — built around the idea that a good stay is simple: a quiet room, good coffee, and people who actually know the city.",
    paragraph2:
      "No filler, no theatrics. Just the details that matter, done well — from your arrival to your last morning.",
  },
  amenities: { eyebrow: "Amenities", title: "Everything you need. Nothing you don't." },
  location: {
    eyebrow: "Location",
    title: "Steps from Brașov old town.",
    description:
      "6 minutes to Piața Sfatului on foot, 20 minutes to Poiana Brașov ski slopes by car, and the Carpathian ridge visible from most of our rooms.",
  },
  contact: {
    eyebrow: "Say hello",
    title: "We're always happy to help.",
    description:
      "Have a question about your stay, a special request, or need a recommendation in Brașov? Reach us any way you like.",
  },
  footer: { tagline: "A boutique hotel — calm rooms, honest service, everything you need a tap away." },
};

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

  return { content, loading, reload: load };
};

export const get = (content: SiteContentMap, section: string, key: string) =>
  content[section]?.[key] ?? DEFAULT_CONTENT[section]?.[key] ?? "";
