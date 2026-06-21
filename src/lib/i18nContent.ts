import { useTranslation } from "react-i18next";

export type Lang = "ro" | "en";

/** Hook returning the current public language ("ro" by default). */
export const useLang = (): Lang => {
  const { i18n } = useTranslation();
  const raw = (i18n.resolvedLanguage || i18n.language || "ro").slice(0, 2);
  return raw === "en" ? "en" : "ro";
};

/**
 * Pick a localized string field from a DB row, with graceful fallbacks.
 *  - Tries `<base>_<lang>` first.
 *  - Falls back to `<base>_ro` (Romanian primary).
 *  - Falls back to legacy column `<base>`.
 *  - Returns empty string when nothing is set.
 */
export const pickLocalized = (
  row: Record<string, unknown> | null | undefined,
  base: string,
  lang: Lang,
): string => {
  if (!row) return "";
  const order = lang === "en" ? [`${base}_en`, `${base}_ro`, base] : [`${base}_ro`, base, `${base}_en`];
  for (const k of order) {
    const v = row[k];
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return "";
};

/** Same as `pickLocalized` for `text[]` fields. */
export const pickLocalizedArray = (
  row: Record<string, unknown> | null | undefined,
  base: string,
  lang: Lang,
): string[] => {
  if (!row) return [];
  const order = lang === "en" ? [`${base}_en`, `${base}_ro`, base] : [`${base}_ro`, base, `${base}_en`];
  for (const k of order) {
    const v = row[k];
    if (Array.isArray(v) && v.length > 0) return v as string[];
  }
  return [];
};

/** Pick localized value from a `site_content` JSON section ({ key_ro, key_en, ... }). */
export const pickLocalizedJson = (
  section: Record<string, string> | undefined,
  key: string,
  lang: Lang,
): string => {
  if (!section) return "";
  const order = lang === "en" ? [`${key}_en`, `${key}_ro`, key] : [`${key}_ro`, key, `${key}_en`];
  for (const k of order) {
    const v = section[k];
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return "";
};
