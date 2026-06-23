import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { gallery as mockImages, type GalleryItem } from "@/data/mock";
import { supabase } from "@/integrations/supabase/client";
import { useLang, pickLocalized } from "@/lib/i18nContent";

type Category = GalleryItem["category"] | "all";

type Props = {
  items?: GalleryItem[];
  filterable?: boolean;
  limit?: number;
};

export const GalleryGrid = ({ items, filterable = true, limit }: Props) => {
  const { t } = useTranslation();
  const lang = useLang();
  const [active, setActive] = useState<Category>("all");
  const [fetched, setFetched] = useState<GalleryItem[] | null>(items ? null : null);

  useEffect(() => {
    if (items) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_gallery")
        .select("image_url, alt, alt_ro, alt_en, category")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (data && data.length > 0) {
        setFetched(
          data.map((d) => ({
            src: d.image_url,
            alt: pickLocalized(d as unknown as Record<string, unknown>, "alt", lang) || d.alt || "",
            category: (d.category ?? "rooms") as GalleryItem["category"],
          })),
        );
      } else {
        setFetched(mockImages);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items, lang]);

  const source = items ?? fetched ?? [];

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t("site.gallery.filters.all") },
    { key: "rooms", label: t("site.gallery.filters.rooms") },
    { key: "lobby", label: t("site.gallery.filters.lobby") },
    { key: "breakfast", label: t("site.gallery.filters.breakfast") },
    { key: "exterior", label: t("site.gallery.filters.exterior") },
    { key: "surroundings", label: t("site.gallery.filters.surroundings") },
  ];
  const filtered = useMemo(() => {
    const list = active === "all" ? source : source.filter((i) => i.category === active);
    return limit ? list.slice(0, limit) : list;
  }, [active, source, limit]);

  return (
    <div>
      {filterable && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm border transition-colors",
                active === c.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            className={cn(
              "overflow-hidden rounded-lg bg-muted",
              i % 5 === 0 ? "md:row-span-2 md:col-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]",
            )}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </figure>
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;
