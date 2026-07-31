import { MapPin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/hooks/useProperty";

export const MapPlaceholder = () => {
  const { t } = useTranslation();
  const { property, merged } = useProperty();

  const embedUrl = property?.map_embed_url?.trim() || "";
  const mapsUrl =
    property?.maps_url?.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      [merged.property_name, merged.address, merged.city, merged.country].filter(Boolean).join(", "),
    )}`;

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-border shadow-card">
        <iframe
          src={embedUrl}
          title={t("site.map.title", { name: merged.property_name })}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block w-full aspect-[16/9] border-0"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-gradient-warm p-8 text-center shadow-card">
      <div className="mx-auto grid place-items-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-soft">
        <MapPin className="h-5 w-5" />
      </div>
      <p className="font-serif text-2xl mt-4">{merged.property_name}</p>
      <p className="text-sm text-muted-foreground">
        {[merged.address, merged.city, merged.country].filter(Boolean).join(", ")}
      </p>
      <Button asChild variant="outline" className="mt-5">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          {t("site.map.openInMaps")} <ExternalLink className="ml-1.5 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

export default MapPlaceholder;
