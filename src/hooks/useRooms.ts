import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { rooms as mockRooms, type Room } from "@/data/mock";
import { useLang, pickLocalized, pickLocalizedArray } from "@/lib/i18nContent";

export type DBRoom = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  capacity: number | null;
  bed_type: string | null;
  amenities: string[] | null;
  main_image_url: string | null;
  gallery_image_urls: string[] | null;
  is_active: boolean;
  sort_order: number | null;
  // Bilingual columns
  name_ro?: string | null;
  name_en?: string | null;
  short_description_ro?: string | null;
  short_description_en?: string | null;
  long_description_ro?: string | null;
  long_description_en?: string | null;
  amenities_ro?: string[] | null;
  amenities_en?: string[] | null;
};

/**
 * Returns rooms in the public {Room} shape used by RoomCard etc.
 * Localizes text fields based on the active language (RO/EN), with RO fallback.
 */
export const useRooms = () => {
  const lang = useLang();
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [dbRooms, setDbRooms] = useState<DBRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (!error && data && data.length > 0) {
        const rows = data as unknown as DBRoom[];
        setDbRooms(rows);
        const mapped: Room[] = rows.map((r) => {
          const fallback = mockRooms.find((m) => m.slug === r.slug);
          const row = r as unknown as Record<string, unknown>;
          const name = pickLocalized(row, "name", lang) || r.name;
          const short = pickLocalized(row, "short_description", lang) || r.short_description || fallback?.short_description || "";
          const long = pickLocalized(row, "long_description", lang) || r.long_description || fallback?.long_description || "";
          const amenities = pickLocalizedArray(row, "amenities", lang);
          return {
            slug: r.slug,
            name,
            short_description: short,
            long_description: long,
            capacity: r.capacity ?? fallback?.capacity ?? 2,
            bed_type: r.bed_type ?? fallback?.bed_type ?? "",
            size_sqm: fallback?.size_sqm ?? 24,
            price_from: fallback?.price_from ?? 99,
            image: r.main_image_url ?? fallback?.image ?? mockRooms[0].image,
            gallery:
              r.gallery_image_urls && r.gallery_image_urls.length > 0
                ? r.gallery_image_urls
                : fallback?.gallery ?? [],
            amenities: amenities.length > 0 ? amenities : (r.amenities ?? fallback?.amenities ?? []),
          };
        });
        setRooms(mapped);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { rooms, dbRooms, loading };
};
