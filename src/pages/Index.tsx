import { Link } from "react-router-dom";
import { ArrowRight, QrCode, Smartphone, Sparkles } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import HeroSection from "@/components/site/HeroSection";
import RoomCard from "@/components/site/RoomCard";
import AmenityGrid from "@/components/site/AmenityGrid";
import GalleryGrid from "@/components/site/GalleryGrid";
import TestimonialSection from "@/components/site/TestimonialSection";
import CTASection from "@/components/site/CTASection";
import MapPlaceholder from "@/components/site/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { heroHotel } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { useRooms } from "@/hooks/useRooms";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useSiteContent, get } from "@/hooks/useSiteContent";

const Index = () => {
  const { merged: property, property: dbProp } = useProperty();
  const { rooms } = useRooms();
  const { content } = useSiteContent();
  usePageMeta(
    `${property.property_name} — Boutique stays in ${property.city}`,
    property.short_description
  );

  return (
    <SiteLayout>
      <HeroSection
        image={dbProp?.hero_image_url || heroHotel}
        eyebrow={get(content, "hero", "eyebrow") || `${property.property_type} · ${property.city}, ${property.country}`}
        title={<>{get(content, "hero", "title_line1")}<br className="hidden md:block" /> {get(content, "hero", "title_line2")}</>}
        subtitle={get(content, "hero", "subtitle") || property.short_description}
        primaryCta={{ label: get(content, "hero", "primary_cta_label") || "Book Direct", href: property.booking_url }}
        secondaryCta={{ label: get(content, "hero", "secondary_cta_label") || "Explore Rooms", href: "/rooms" }}
      />

      {/* Positioning */}
      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="eyebrow mb-3">{get(content, "about", "eyebrow")} {property.property_name}</p>
            <h2 className="text-4xl md:text-5xl">{get(content, "about", "title")}</h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>{get(content, "about", "paragraph1")}</p>
            <p>{get(content, "about", "paragraph2")}</p>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="section bg-secondary/40">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div className="max-w-xl">
              <p className="eyebrow mb-3">Our rooms</p>
              <h2 className="text-4xl md:text-5xl">Rooms made for rest.</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/rooms">View all rooms <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 3).map((r) => <RoomCard key={r.slug} room={r} />)}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section">
        <div className="container-narrow">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow mb-3">{get(content, "amenities", "eyebrow")}</p>
            <h2 className="text-4xl md:text-5xl">{get(content, "amenities", "title")}</h2>
          </div>
          <AmenityGrid />
        </div>
      </section>

      {/* GuestHub teaser */}
      <section className="section bg-ink text-background">
        <div className="container-narrow grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-background/70 mb-3">Guest experience</p>
            <h2 className="text-4xl md:text-5xl">A smoother stay from arrival to checkout.</h2>
            <p className="mt-6 text-background/80 max-w-md">
              Need fresh towels, a late checkout, or a restaurant recommendation? At {property.property_name}, guests can reach reception and request services digitally — quietly, without waiting on hold.
            </p>
            <p className="mt-4 text-background/60 text-sm max-w-md">
              Modern service, without the friction. Built in.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: QrCode, label: "Scan & request", text: "A quick QR in your room connects you to reception." },
              { icon: Smartphone, label: "Message us", text: "Chat, call, or WhatsApp — whatever works for you." },
              { icon: Sparkles, label: "Fresh towels", text: "Send a request and we'll handle it silently." },
              { icon: ArrowRight, label: "Late checkout", text: "Ask for extra time. We'll do our best to say yes." },
            ].map((f) => (
              <div key={f.label} className="border border-background/15 rounded-lg p-5 bg-background/5">
                <f.icon className="h-5 w-5 text-background/80" strokeWidth={1.5} />
                <p className="font-serif text-xl mt-3">{f.label}</p>
                <p className="text-sm text-background/70 mt-1">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <p className="eyebrow mb-3">Gallery</p>
              <h2 className="text-4xl md:text-5xl">A look around.</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/gallery">Full gallery <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <GalleryGrid filterable={false} limit={6} />
        </div>
      </section>

      {/* Location preview */}
      <section className="section bg-secondary/40">
        <div className="container-narrow grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-3">{get(content, "location", "eyebrow")}</p>
            <h2 className="text-4xl md:text-5xl">{get(content, "location", "title")}</h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              {get(content, "location", "description")}
            </p>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/location">Explore the area <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <MapPlaceholder />
        </div>
      </section>

      <TestimonialSection />

      <CTASection
        eyebrow="Plan your stay"
        title="Book direct and get the best rate."
        description="No booking fees, no commission markup — just the real price and a direct line to our reception."
        primary={{ label: "Book Direct", href: property.booking_url }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </SiteLayout>
  );
};

export default Index;
