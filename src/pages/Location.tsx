import SiteLayout from "@/components/site/SiteLayout";
import MapPlaceholder from "@/components/site/MapPlaceholder";
import CTASection from "@/components/site/CTASection";
import { MapPin, Car, ParkingCircle } from "lucide-react";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTranslation } from "react-i18next";
import { useSiteContent, get, getItems } from "@/hooks/useSiteContent";
import { useLang } from "@/lib/i18nContent";

const Location = () => {
  const { merged: property } = useProperty();
  const { t } = useTranslation();
  const { content, lang } = useSiteContent();
  const currentLang = useLang();

  usePageMeta(
    t("site.location.metaTitle", { name: property.property_name }),
    t("site.location.metaDesc", { city: property.city, country: property.country }),
  );

  const transportRows = getItems(content, "location_details");
  const parkingHeading =
    get(content, "location_details", "parking_heading", lang) ||
    t("site.location.parking");
  const parkingBody =
    get(content, "location_details", "parking_body", lang) ||
    t("site.location.parkingBody");
  const gettingAroundHeading =
    get(content, "location_details", "getting_around_heading", lang) ||
    t("site.location.gettingAround");
  const gettingAroundBody =
    get(content, "location_details", "getting_around_body", lang) ||
    t("site.location.gettingAroundBody");

  const pickL = (row: Record<string, unknown>, base: string): string => {
    const order = currentLang === "en" ? [`${base}_en`, `${base}_ro`, base] : [`${base}_ro`, base, `${base}_en`];
    for (const k of order) {
      const v = row[k];
      if (typeof v === "string" && v.trim().length > 0) return v;
    }
    return "";
  };

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">{t("site.location.eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl">{t("site.location.title", { city: property.city })}</h1>
          <p className="mt-6 text-muted-foreground text-lg">{t("site.location.subtitle")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-3">{t("site.location.address")}</p>
              <p className="font-serif text-2xl">{property.property_name}</p>
              <p className="text-muted-foreground">{property.address}</p>
              <p className="text-muted-foreground">{property.city}, {property.country}</p>
            </div>
            {transportRows.length > 0 && (
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> {t("site.location.nearby")}</p>
                <ul className="divide-y divide-border border-t border-b border-border">
                  {transportRows.map((row, i) => {
                    const label = pickL(row as Record<string, unknown>, "label");
                    const time = pickL(row as Record<string, unknown>, "time");
                    if (!label) return null;
                    return (
                      <li key={i} className="py-3 flex justify-between gap-3 text-sm">
                        <span>{label}</span>
                        <span className="text-muted-foreground shrink-0">{time}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <MapPlaceholder />
        </div>
      </section>

            <p className="eyebrow flex items-center gap-2">
              <ParkingCircle className="h-4 w-4" /> {parkingHeading}
            </p>
            {parkingBody && <p className="text-muted-foreground">{parkingBody}</p>}
            <p className="eyebrow flex items-center gap-2 pt-4">
              <Car className="h-4 w-4" /> {gettingAroundHeading}
            </p>
            {gettingAroundBody && (
              <p className="text-muted-foreground">{gettingAroundBody}</p>
            )}
          </div>
        </div>
      </section>

      <CTASection
        title={t("site.location.ctaTitle")}
        primary={{ label: t("site.location.ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("site.location.ctaSecondary"), href: property.booking_url }}
      />
    </SiteLayout>
  );
};

export default Location;
