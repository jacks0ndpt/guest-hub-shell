import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAmenities } from "@/hooks/useAmenities";
import { resolveSectionIcon } from "@/lib/sectionIcons";

const fallbackKeys = [
  { icon: "wifi", key: "wifi" },
  { icon: "coffee", key: "breakfast" },
  { icon: "car", key: "parking" },
  { icon: "sparkles", key: "housekeeping" },
  { icon: "check-circle", key: "reception" },
  { icon: "mountain", key: "views" },
  { icon: "heart", key: "pets" },
  { icon: "sun", key: "garden" },
];

type Props = {
  /** Which scope of amenities to render. Defaults to homepage. */
  scope?: "homepage" | "room" | "all";
  /** Optional cap. */
  limit?: number;
};

export const AmenityGrid = ({ scope = "homepage", limit }: Props) => {
  const { t } = useTranslation();
  const { items, loading } = useAmenities({ scope });

  const visible = typeof limit === "number" ? items.slice(0, limit) : items;

  const cellClass =
    "flex flex-col items-center text-center md:items-start md:text-left rounded-xl border border-border/70 bg-card p-5 md:p-6 shadow-card/50 transition hover:shadow-card";
  const iconWrap =
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-4";

  if (!loading && visible.length === 0) {
    const staticItems = typeof limit === "number" ? fallbackKeys.slice(0, limit) : fallbackKeys;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {staticItems.map((a) => {
          const Icon = resolveSectionIcon(a.icon);
          return (
            <div key={a.key} className={cellClass}>
              <span className={iconWrap}>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h4 className="font-serif text-lg leading-tight">{t(`data.amenities.${a.key}.label`)}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`data.amenities.${a.key}.desc`)}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {visible.map((a) => {
        const Icon = resolveSectionIcon(a.icon_key) ?? Sparkles;
        return (
          <div key={a.id} className={cellClass}>
            <span className={iconWrap}>
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h4 className="font-serif text-lg leading-tight">{a.label}</h4>
            {a.description && (
              <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AmenityGrid;
