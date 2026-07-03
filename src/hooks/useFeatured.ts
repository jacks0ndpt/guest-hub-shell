import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRooms } from "@/hooks/useRooms";
import type { Room } from "@/data/mock";
import { useLang, pickLocalized } from "@/lib/i18nContent";

type Offer = {
  id: string;
  slug: string;
  is_active: boolean;
  sort_order: number | null;
  title: string;
  title_ro?: string | null;
  title_en?: string | null;
  description?: string | null;
  description_ro?: string | null;
  description_en?: string | null;
  badge?: string | null;
  badge_ro?: string | null;
  badge_en?: string | null;
  image_url?: string | null;
  [k: string]: unknown;
};

const readIds = (raw: unknown): string[] => (Array.isArray(raw) ? (raw as string[]) : []);

/**
 * Returns the rooms to feature on the homepage:
 *  - honours the admin-selected order in property_settings.home_featured_rooms
 *  - filters out inactive rooms
 *  - if no featured selection, falls back to the first `fallbackCount` active rooms
 */
export const useFeaturedRooms = (fallbackCount = 3) => {
  const { rooms, dbRooms, loading } = useRooms();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("property_settings")
        .select("home_featured_rooms")
        .limit(1)
        .maybeSingle();
      setIds(readIds((data as { home_featured_rooms?: unknown } | null)?.home_featured_rooms));
    })();
  }, []);

  const featured = useMemo<Room[]>(() => {
    if (ids.length === 0) return rooms.slice(0, fallbackCount);
    // Map DB ids → public Room shape via slug
    const activeSlugsById = new Map(dbRooms.filter((r) => r.is_active !== false).map((r) => [r.id, r.slug]));
    const bySlug = new Map(rooms.map((r) => [r.slug, r]));
    return ids
      .map((id) => activeSlugsById.get(id))
      .filter((slug): slug is string => !!slug)
      .map((slug) => bySlug.get(slug))
      .filter((r): r is Room => !!r);
  }, [ids, rooms, dbRooms, fallbackCount]);

  return { rooms: featured, loading };
};

/**
 * Featured offers for the homepage in admin-selected order, active only.
 * Falls back to active offers by sort_order.
 */
export const useFeaturedOffers = (fallbackCount = 3) => {
  const lang = useLang();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: offerData }, { data: prop }] = await Promise.all([
        supabase.from("offers").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("property_settings").select("home_featured_offers").limit(1).maybeSingle(),
      ]);
      if (cancelled) return;
      setOffers((offerData as Offer[]) ?? []);
      setIds(readIds((prop as { home_featured_offers?: unknown } | null)?.home_featured_offers));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const featured = useMemo(() => {
    const source = ids.length === 0
      ? offers.slice(0, fallbackCount)
      : ids.map((id) => offers.find((o) => o.id === id)).filter((o): o is Offer => !!o);
    return source.map((o) => {
      const row = o as unknown as Record<string, unknown>;
      return {
        ...o,
        title: pickLocalized(row, "title", lang) || o.title,
        description: pickLocalized(row, "description", lang) || o.description || "",
        badge: pickLocalized(row, "badge", lang) || o.badge || "",
      };
    });
  }, [offers, ids, lang, fallbackCount]);

  return { offers: featured, loading };
};
