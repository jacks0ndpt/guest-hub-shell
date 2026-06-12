import SiteLayout from "@/components/site/SiteLayout";
import MapPlaceholder from "@/components/site/MapPlaceholder";
import CTASection from "@/components/site/CTASection";
import { MapPin, Car, Train, ParkingCircle } from "lucide-react";
import { nearbyAttractions, transport } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTranslation } from "react-i18next";

const Location = () => {
  const { merged: property } = useProperty();
  const { t } = useTranslation();
  usePageMeta(
    t("site.location.metaTitle", { name: property.property_name }),
    t("site.location.metaDesc", { city: property.city, country: property.country }),
  );
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
              <p className="font-serif text-2xl">{property.address}</p>
              <p className="text-muted-foreground">{property.city}, {property.country}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> {t("site.location.nearby")}</p>
              <ul className="divide-y divide-border border-t border-b border-border">
                {nearbyAttractions.map((n) => (
                  <li key={n.name} className="py-3 flex justify-between text-sm">
                    <span>{n.name}</span>
                    <span className="text-muted-foreground">{n.distance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <MapPlaceholder />
        </div>
      </section>

      <section className="section bg-secondary/40">
        <div className="container-narrow grid md:grid-cols-2 gap-10">
          <div>
            <p className="eyebrow mb-3 flex items-center gap-2"><Train className="h-4 w-4" /> {t("site.location.gettingHere")}</p>
            <ul className="space-y-3">
              {transport.map((tr) => (
                <li key={tr.label} className="flex justify-between border-b border-border pb-3 text-sm">
                  <span>{tr.label}</span>
                  <span className="text-muted-foreground">{tr.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="eyebrow flex items-center gap-2"><ParkingCircle className="h-4 w-4" /> {t("site.location.parking")}</p>
            <p className="text-muted-foreground">{t("site.location.parkingBody")}</p>
            <p className="eyebrow flex items-center gap-2 pt-4"><Car className="h-4 w-4" /> {t("site.location.gettingAround")}</p>
            <p className="text-muted-foreground">{t("site.location.gettingAroundBody")}</p>
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
