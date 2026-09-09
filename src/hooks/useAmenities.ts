import { useMemo } from "react";
import { useAmenitiesQuery } from "@/lib/publicQueries";
import { useLang } from "@/lib/i18nContent";

export type DBAmenity = {
  id: string;
  icon_key: string;
  label_ro: string;
  label_en: string | null;
  description_ro: string | null;
  description_en: string | null;
  is_active: boolean;
  show_on_homepage: boolean;
  show_on_room_pages: boolean;
  sort_order: number;
};

export type LocalizedAmenity = {
  id: string;
  icon_key: string;
  label: string;
  description: string;
  show_on_homepage: boolean;
  show_on_room_pages: boolean;
};

type Options = {
  scope?: "all" | "homepage" | "room";
};

export const useAmenities = ({ scope = "all" }: Options = {}) => {
  const lang = useLang();
  const { data, isLoading: loading } = useAmenitiesQuery();
  const rows = (data as DBAmenity[] | undefined) ?? [];

  const items = useMemo<LocalizedAmenity[]>(() => {
    return rows
      .filter((a) => {
        if (scope === "homepage") return a.show_on_homepage;
        if (scope === "room") return a.show_on_room_pages;
        return true;
      })
      .map((a) => {
        const label =
          (lang === "en" ? a.label_en : a.label_ro) ||
          a.label_ro ||
          a.label_en ||
          "";
        const description =
          (lang === "en" ? a.description_en : a.description_ro) ||
          a.description_ro ||
          a.description_en ||
          "";
        return {
          id: a.id,
          icon_key: a.icon_key,
          label,
          description,
          show_on_homepage: a.show_on_homepage,
          show_on_room_pages: a.show_on_room_pages,
        };
      });
  }, [rows, lang, scope]);

  return { items, rows, loading };
};
