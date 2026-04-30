import { Link, useParams } from "react-router-dom";
import { Users, BedDouble, Ruler, ArrowLeft, Check } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import RoomCard from "@/components/site/RoomCard";
import CTASection from "@/components/site/CTASection";
import { Button } from "@/components/ui/button";
import { rooms, property } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";
import NotFound from "./NotFound";

const RoomDetail = () => {
  const { slug } = useParams();
  const room = rooms.find((r) => r.slug === slug);
  usePageMeta(
    room ? `${room.name} — ${property.property_name}` : "Room",
    room?.short_description
  );

  if (!room) return <NotFound />;

  const related = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img src={room.image} alt={room.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative container-narrow h-full flex flex-col justify-end pb-12 pt-32 text-background">
          <Link to="/rooms" className="inline-flex items-center gap-1.5 text-sm mb-4 opacity-85 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> All rooms
          </Link>
          <h1 className="text-5xl md:text-7xl max-w-3xl">{room.name}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex flex-wrap gap-6 text-sm border-b border-border pb-6">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {room.capacity} guests</span>
              <span className="inline-flex items-center gap-2"><BedDouble className="h-4 w-4 text-primary" /> {room.bed_type}</span>
              <span className="inline-flex items-center gap-2"><Ruler className="h-4 w-4 text-primary" /> {room.size_sqm} m²</span>
            </div>
            <div>
              <p className="eyebrow mb-3">About this room</p>
              <p className="text-lg leading-relaxed text-foreground/90">{room.long_description}</p>
            </div>
            <div>
              <p className="eyebrow mb-4">Amenities</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Gallery</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {room.gallery.map((src, i) => (
                  <img key={i} src={src} alt={`${room.name} ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit rounded-lg border border-border bg-card p-6 md:p-8 shadow-card">
            <p className="eyebrow">From</p>
            <p className="font-serif text-4xl mt-1">€{room.price_from}<span className="text-base text-muted-foreground">/night</span></p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>Check-in from {property.checkin_time}</p>
              <p>Check-out by {property.checkout_time}</p>
              <p>Free cancellation up to 48h before arrival</p>
            </div>
            <Button asChild size="lg" className="w-full mt-6">
              <a href={property.booking_url}>Book this room</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full mt-2">
              <Link to="/contact">Ask a question</Link>
            </Button>
          </aside>
        </div>
      </section>

      <section className="section bg-secondary/40">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl mb-10">You might also like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => <RoomCard key={r.slug} room={r} />)}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to make it yours?"
        primary={{ label: "Book Direct", href: property.booking_url }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </SiteLayout>
  );
};

export default RoomDetail;
