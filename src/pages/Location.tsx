import SiteLayout from "@/components/site/SiteLayout";
import MapPlaceholder from "@/components/site/MapPlaceholder";
import CTASection from "@/components/site/CTASection";
import { MapPin, Car, Train, ParkingCircle } from "lucide-react";
import { nearbyAttractions, transport } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";

const Location = () => {
  const { merged: property } = useProperty();
  usePageMeta(`Location — ${property.property_name}`, `Find us in ${property.city}, ${property.country}.`);
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">Location</p>
          <h1 className="text-5xl md:text-7xl">In the heart of {property.city}.</h1>
          <p className="mt-6 text-muted-foreground text-lg">
            Moments from the old town, minutes from the mountains, and a short drive from everything worth seeing in the Carpathians.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-3">Address</p>
              <p className="font-serif text-2xl">{property.address}</p>
              <p className="text-muted-foreground">{property.city}, {property.country}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Nearby</p>
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
            <p className="eyebrow mb-3 flex items-center gap-2"><Train className="h-4 w-4" /> Getting here</p>
            <ul className="space-y-3">
              {transport.map((t) => (
                <li key={t.label} className="flex justify-between border-b border-border pb-3 text-sm">
                  <span>{t.label}</span>
                  <span className="text-muted-foreground">{t.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="eyebrow flex items-center gap-2"><ParkingCircle className="h-4 w-4" /> Parking</p>
            <p className="text-muted-foreground">
              Free on-site parking is available for all guests on a first-come basis. We recommend arriving before 20:00 to secure a spot during busier weekends.
            </p>
            <p className="eyebrow flex items-center gap-2 pt-4"><Car className="h-4 w-4" /> Getting around</p>
            <p className="text-muted-foreground">
              Most of Brașov's old town is easily walkable. Taxis are inexpensive, and Uber/Bolt work well. For the mountains, we can help arrange a rental car or a private driver.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Questions about getting here?"
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Book Direct", href: property.booking_url }}
      />
    </SiteLayout>
  );
};

export default Location;
