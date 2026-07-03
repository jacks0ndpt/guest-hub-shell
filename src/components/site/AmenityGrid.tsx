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

  if (!loading && visible.length === 0) {
    // Fallback to legacy static i18n content when DB is empty.
    const staticItems = typeof limit === "number" ? fallbackKeys.slice(0, limit) : fallbackKeys;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {staticItems.map((a) => {
          const Icon = resolveSectionIcon(a.icon);
          return (
            <div key={a.key} className="text-center md:text-left">
              <Icon className="h-7 w-7 text-primary mx-auto md:mx-0" strokeWidth={1.25} />
              <h4 className="font-serif text-xl mt-4">{t(`data.amenities.${a.key}.label`)}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t(`data.amenities.${a.key}.desc`)}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      {visible.map((a) => {
        const Icon = resolveSectionIcon(a.icon_key) ?? Sparkles;
        return (
          <div key={a.id} className="text-center md:text-left">
            <Icon className="h-7 w-7 text-primary mx-auto md:mx-0" strokeWidth={1.25} />
            <h4 className="font-serif text-xl mt-4">{a.label}</h4>
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
