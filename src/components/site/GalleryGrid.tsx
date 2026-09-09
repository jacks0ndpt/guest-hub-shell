import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { gallery as mockImages, type GalleryItem } from "@/data/mock";
import { useGalleryQuery } from "@/lib/publicQueries";
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
  const { data } = useGalleryQuery(!items);

  const fetched = useMemo<GalleryItem[] | null>(() => {
    if (items || !data) return null;
    if (data.length === 0) return mockImages;
    return data.map((d) => {
      const row = d as Record<string, unknown>;
      return {
        src: String(row.image_url ?? ""),
        alt: pickLocalized(row, "alt", lang) || String(row.alt ?? ""),
        category: ((row.category as string) ?? "rooms") as GalleryItem["category"],
      };
    });
  }, [items, data, lang]);

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
