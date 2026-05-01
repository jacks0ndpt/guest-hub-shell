import SiteLayout from "@/components/site/SiteLayout";
import RoomCard from "@/components/site/RoomCard";
import CTASection from "@/components/site/CTASection";
import { useProperty } from "@/hooks/useProperty";
import { useRooms } from "@/hooks/useRooms";
import { usePageMeta } from "@/hooks/usePageMeta";

const Rooms = () => {
  const { merged: property } = useProperty();
  const { rooms } = useRooms();
  usePageMeta(`Rooms — ${property.property_name}`, "Browse our 24 rooms, from cozy doubles to mountain-view deluxes.");
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">Our rooms</p>
          <h1 className="text-5xl md:text-7xl">Find the room that fits your stay.</h1>
          <p className="mt-6 text-muted-foreground text-lg">
            Four room types, 24 rooms in total. Each one made for rest, with the details we'd want ourselves.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => <RoomCard key={r.slug} room={r} />)}
        </div>
      </section>
      <CTASection
        title="Not sure which room suits you?"
        description="We're happy to help you pick the right fit — just send us a quick message."
        primary={{ label: "Book Direct", href: property.booking_url }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </SiteLayout>
  );
};

export default Rooms;
