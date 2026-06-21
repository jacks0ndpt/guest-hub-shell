import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang, pickLocalized } from "@/lib/i18nContent";

export type RoomCode = {
  id: string;
  qr_code_slug: string;
  room_label: string;
  is_active: boolean;
};

export type ServiceCategory = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  is_active: boolean;
};

export type ServiceItem = {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price_estimate: number | null;
  is_paid_extra: boolean;
  requires_staff_confirmation: boolean;
  sort_order: number | null;
  is_active: boolean;
};

/** Demo fallbacks (used only if Supabase returns nothing). */
const fallbackCategories: ServiceCategory[] = [
  { id: "fb-housekeeping", name: "Housekeeping", description: "Towels, cleaning, pillows", icon: "Sparkles", sort_order: 1, is_active: true },
  { id: "fb-reception", name: "Reception", description: "Ask the front desk", icon: "ConciergeBell", sort_order: 2, is_active: true },
  { id: "fb-extras", name: "Paid Extras", description: "Optional add-ons", icon: "Plus", sort_order: 3, is_active: true },
  { id: "fb-local", name: "Local Help", description: "Around the area", icon: "MapPin", sort_order: 4, is_active: true },
  { id: "fb-feedback", name: "Feedback", description: "Tell us privately", icon: "MessageCircle", sort_order: 5, is_active: true },
];

const fb = (cat: string, title: string, price = 0, paid = false, staff = false): ServiceItem => ({
  id: `fb-${cat}-${title}`.toLowerCase().replace(/\s+/g, "-"),
  category_id: cat,
  title,
  description: null,
  price_estimate: price,
  is_paid_extra: paid,
  requires_staff_confirmation: staff,
  sort_order: 0,
  is_active: true,
});

const fallbackItems: ServiceItem[] = [
  fb("fb-housekeeping", "Extra towels"),
  fb("fb-housekeeping", "Room cleaning"),
  fb("fb-housekeeping", "Extra pillows"),
  fb("fb-reception", "Ask reception"),
  fb("fb-reception", "Maintenance issue", 0, false, true),
  fb("fb-reception", "Wake-up call"),
  fb("fb-extras", "Late checkout", 20, true, true),
  fb("fb-extras", "Breakfast add-on", 12, true, true),
  fb("fb-extras", "Airport transfer", 35, true, true),
  fb("fb-extras", "Parking reservation", 10, true, true),
  fb("fb-local", "Taxi request", 0, false, true),
  fb("fb-local", "Restaurant recommendation"),
  fb("fb-local", "Things to do nearby"),
  fb("fb-feedback", "Private feedback"),
];

export const useGuestHub = () => {
  const lang = useLang();
  const [categories, setCategories] = useState<ServiceCategory[]>(fallbackCategories);
  const [items, setItems] = useState<ServiceItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [catRes, itemRes] = await Promise.all([
        supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("service_items").select("*").eq("is_active", true).order("sort_order"),
      ]);
      if (cancelled) return;
      if (!catRes.error && catRes.data && catRes.data.length > 0) {
        const rows = catRes.data as unknown as ServiceCategory[];
        const localized = rows.map((c) => {
          const row = c as unknown as Record<string, unknown>;
          return {
            ...c,
            name: pickLocalized(row, "name", lang) || c.name,
            description: pickLocalized(row, "description", lang) || c.description,
          };
        });
        setCategories(localized);
      }
      if (!itemRes.error && itemRes.data && itemRes.data.length > 0) {
        const rows = itemRes.data as unknown as ServiceItem[];
        const localized = rows.map((it) => {
          const row = it as unknown as Record<string, unknown>;
          return {
            ...it,
            title: pickLocalized(row, "title", lang) || it.title,
            description: pickLocalized(row, "description", lang) || it.description,
          };
        });
        setItems(localized);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { categories, items, loading };
};

export const useRoomCodes = () => {
  const [codes, setCodes] = useState<RoomCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("room_codes")
        .select("*")
        .eq("is_active", true)
        .order("room_label");
      if (cancelled) return;
      if (!error && data) setCodes(data as RoomCode[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { codes, loading };
};

export const useRoomBySlug = (slug?: string) => {
  const [code, setCode] = useState<RoomCode | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("room_codes")
        .select("*")
        .eq("qr_code_slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) setNotFound(true);
      else setCode(data as RoomCode);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { code, loading, notFound };
};
