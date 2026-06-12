import SiteLayout from "@/components/site/SiteLayout";
import ContactSection from "@/components/site/ContactSection";
import CTASection from "@/components/site/CTASection";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { merged: property } = useProperty();
  const { t } = useTranslation();
  usePageMeta(t("site.contact.metaTitle", { name: property.property_name }), t("site.contact.metaDesc"));
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">{t("site.contact.eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl">{t("site.contact.title")}</h1>
        </div>
      </section>
      <ContactSection />
      <CTASection
        title={t("site.contact.ctaTitle")}
        primary={{ label: t("site.contact.ctaPrimary"), href: property.booking_url }}
      />
    </SiteLayout>
  );
};

export default Contact;
