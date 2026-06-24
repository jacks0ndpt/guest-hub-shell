import { useSiteContent, get, getRaw, getItems, type SectionItem } from "@/hooks/useSiteContent";
import { pickLocalizedJson, type Lang } from "@/lib/i18nContent";

export type LocalizedSection = {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl: string;
  primaryCta: { label: string; url: string };
  secondaryCta: { label: string; url: string };
  items: LocalizedSectionItem[];
};

export type LocalizedSectionItem = {
  iconKey: string;
  title: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  raw: SectionItem;
};

const pickItemString = (item: SectionItem, base: string, lang: Lang): string =>
  pickLocalizedJson(item as unknown as Record<string, string>, base, lang);

/**
 * Read one of the new editable homepage sections in a UI-friendly shape.
 * Pass either `"label"` or `"title"` as the per-item title base — different
 * sections store the headline under different keys.
 */
export const useHomepageSection = (
  sectionKey: "trust_strip" | "why_us" | "guest_convenience" | "home_cta",
  itemTitleBase: "label" | "title" = "title",
): LocalizedSection & { loading: boolean } => {
  const { content, loading, lang } = useSiteContent();

  const items = getItems(content, sectionKey).map<LocalizedSectionItem>((it) => ({
    iconKey: (it.icon_key as string) ?? "",
    title:
      pickItemString(it, itemTitleBase, lang) ||
      pickItemString(it, itemTitleBase === "label" ? "title" : "label", lang),
    description: pickItemString(it, "description", lang),
    isActive: it.is_active !== false,
    sortOrder: it.sort_order ?? 0,
    raw: it,
  }));

  return {
    loading,
    eyebrow: get(content, sectionKey, "eyebrow", lang),
    title: get(content, sectionKey, "title", lang),
    subtitle: get(content, sectionKey, "subtitle", lang),
    body: get(content, sectionKey, "body", lang),
    imageUrl: getRaw(content, sectionKey, "image_url"),
    primaryCta: {
      label: get(content, sectionKey, "primary_cta_label", lang),
      url: getRaw(content, sectionKey, "primary_cta_url"),
    },
    secondaryCta: {
      label: get(content, sectionKey, "secondary_cta_label", lang),
      url: getRaw(content, sectionKey, "secondary_cta_url"),
    },
    items,
  };
};
