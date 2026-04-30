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
import { heroHotel, property, rooms } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";

const Index = () => {
  usePageMeta(
    `${property.property_name} — Boutique stays in ${property.city}`,
    property.short_description
  );

  return (
    <SiteLayout>
      <HeroSection
        image={heroHotel}
        eyebrow={`${property.property_type} · ${property.city}, ${property.country}`}
        title={<>A warm stay between the<br className="hidden md:block" /> mountains and the old town.</>}
        subtitle={property.short_description}
        primaryCta={{ label: "Book Direct", href: property.booking_url }}
        secondaryCta={{ label: "Explore Rooms", href: "/rooms" }}
      />

      {/* Positioning */}
      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="eyebrow mb-3">About {property.property_name}</p>
            <h2 className="text-4xl md:text-5xl">24 quiet rooms. One honest kind of hospitality.</h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>
              We're a small boutique hotel a few minutes from Brașov's old town — built around the idea that a good stay is simple: a quiet room, good coffee, and people who actually know the city.
            </p>
            <p>
              No filler, no theatrics. Just the details that matter, done well — from your arrival to your last morning.
            </p>
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
            <p className="eyebrow mb-3">Amenities</p>
            <h2 className="text-4xl md:text-5xl">Everything you need. Nothing you don't.</h2>
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
            <p className="eyebrow mb-3">Location</p>
            <h2 className="text-4xl md:text-5xl">Steps from Brașov old town.</h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              6 minutes to Piața Sfatului on foot, 20 minutes to Poiana Brașov ski slopes by car, and the Carpathian ridge visible from most of our rooms.
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
