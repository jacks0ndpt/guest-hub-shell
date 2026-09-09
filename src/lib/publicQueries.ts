import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Shared React Query layer for public (unauthenticated) website data.
 *
 * Every public dataset is fetched at most once per staleTime window and shared
 * across every component that asks for it — this removes the duplicate
 * property_settings / site_content / rooms / offers requests the homepage used
 * to fire once per section.
 */
export const PUBLIC_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const PUBLIC_GC_TIME = 30 * 60 * 1000;

const publicQueryOptions = {
  staleTime: PUBLIC_STALE_TIME,
  gcTime: PUBLIC_GC_TIME,
  retry: 1,
  refetchOnWindowFocus: false as const,
  refetchOnReconnect: false as const,
};

const rowsOf = <T,>(data: unknown): T[] => (Array.isArray(data) ? (data as T[]) : []);

export const usePublicQuery = <T,>(key: unknown[], fn: () => Promise<T>) =>
  useQuery({ queryKey: key, queryFn: fn, ...publicQueryOptions });

/* ---------------------------------- data --------------------------------- */

export const usePropertySettingsQuery = () =>
  usePublicQuery(["public", "property_settings"], async () => {
    const { data, error } = await supabase
      .from("property_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as Record<string, unknown> | null;
  });

export const useSiteContentQuery = () =>
  usePublicQuery(["public", "site_content"], async () => {
    const { data, error } = await supabase.from("site_content").select("section_key, content");
    if (error) throw error;
    return rowsOf<{ section_key: string; content: Record<string, unknown> }>(data);
  });

export const useRoomsQuery = () =>
  usePublicQuery(["public", "rooms"], async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return rowsOf<Record<string, unknown>>(data);
  });

export const useOffersQuery = () =>
  usePublicQuery(["public", "offers"], async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return rowsOf<Record<string, unknown>>(data);
  });

export const useAmenitiesQuery = () =>
  usePublicQuery(["public", "amenities"], async () => {
    const { data, error } = await supabase
      .from("amenities")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return rowsOf<Record<string, unknown>>(data);
  });

export const useTestimonialsQuery = () =>
  usePublicQuery(["public", "testimonials"], async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return rowsOf<Record<string, unknown>>(data);
  });

export const useGalleryQuery = (enabled = true) =>
  useQuery({
    queryKey: ["public", "site_gallery"],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_gallery")
        .select("image_url, alt, alt_ro, alt_en, category")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return rowsOf<Record<string, unknown>>(data);
    },
    ...publicQueryOptions,
  });
