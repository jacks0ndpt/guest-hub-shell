import { useEffect, useState } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import GalleryGrid from "@/components/site/GalleryGrid";
import CTASection from "@/components/site/CTASection";
import { gallery as mockGallery, type GalleryItem } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";

const Gallery = () => {
  const { merged: property } = useProperty();
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  usePageMeta(`Gallery — ${property.property_name}`, "A visual tour of our rooms, lobby, breakfast, and the surroundings.");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_gallery")
        .select("image_url, alt, category")
        .eq("is_active", true)
        .order("sort_order");
      if (data && data.length > 0) {
        setItems(
          data.map((d: any) => ({
            src: d.image_url,
            alt: d.alt ?? "",
            category: (d.category ?? "rooms") as GalleryItem["category"],
          })),
        );
      } else {
        setItems(mockGallery);
      }
    })();
  }, []);

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
          {items && <GalleryGrid items={items} />}
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
