import SiteLayout from "@/components/site/SiteLayout";
import GalleryGrid from "@/components/site/GalleryGrid";
import CTASection from "@/components/site/CTASection";
import { property } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";

const Gallery = () => {
  usePageMeta(`Gallery — ${property.property_name}`, "A visual tour of our rooms, lobby, breakfast, and the Brașov surroundings.");
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">Gallery</p>
          <h1 className="text-5xl md:text-7xl">A look around {property.property_name}.</h1>
        </div>
      </section>
      <section className="section">
        <div className="container-narrow">
          <GalleryGrid />
        </div>
      </section>
      <CTASection
        title="Come see it in person."
        primary={{ label: "Book Direct", href: property.booking_url }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </SiteLayout>
  );
};

export default Gallery;
