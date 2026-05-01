import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { rooms as mockRooms, type Room } from "@/data/mock";

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
};

/**
 * Returns rooms in the public {Room} shape used by RoomCard etc.
 * Falls back to mock images when DB rooms have no images yet.
 */
export const useRooms = () => {
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
        setDbRooms(data as DBRoom[]);
        const mapped: Room[] = (data as DBRoom[]).map((r) => {
          const fallback = mockRooms.find((m) => m.slug === r.slug);
          return {
            slug: r.slug,
            name: r.name,
            short_description: r.short_description ?? fallback?.short_description ?? "",
            long_description: r.long_description ?? fallback?.long_description ?? "",
            capacity: r.capacity ?? fallback?.capacity ?? 2,
            bed_type: r.bed_type ?? fallback?.bed_type ?? "",
            size_sqm: fallback?.size_sqm ?? 24,
            price_from: fallback?.price_from ?? 99,
            image: r.main_image_url ?? fallback?.image ?? mockRooms[0].image,
            gallery:
              r.gallery_image_urls && r.gallery_image_urls.length > 0
                ? r.gallery_image_urls
                : fallback?.gallery ?? [],
            amenities: r.amenities ?? fallback?.amenities ?? [],
          };
        });
        setRooms(mapped);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, dbRooms, loading };
};
