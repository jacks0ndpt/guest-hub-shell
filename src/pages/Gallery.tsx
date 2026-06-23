import SiteLayout from "@/components/site/SiteLayout";
import GalleryGrid from "@/components/site/GalleryGrid";
import CTASection from "@/components/site/CTASection";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTranslation } from "react-i18next";

const Gallery = () => {
  const { merged: property } = useProperty();
  const { t } = useTranslation();
  usePageMeta(t("site.gallery.metaTitle", { name: property.property_name }), t("site.gallery.metaDesc"));

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">{t("site.gallery.eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl">{t("site.gallery.title", { name: property.property_name })}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container-narrow">
          <GalleryGrid />
        </div>
      </section>
      <CTASection
        title={t("site.gallery.ctaTitle")}
        primary={{ label: t("site.gallery.ctaPrimary"), href: property.booking_url }}
        secondary={{ label: t("site.gallery.ctaSecondary"), href: "/contact" }}
      />
    </SiteLayout>
  );
};

export default Gallery;
