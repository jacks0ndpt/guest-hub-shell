import { useEffect, useState } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import OfferCard from "@/components/site/OfferCard";
import CTASection from "@/components/site/CTASection";
import { offers as mockOffers, type Offer } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const Offers = () => {
  const { merged: property, property: dbProp, loading } = useProperty();
  const [items, setItems] = useState<Offer[] | null>(null);
  const { t } = useTranslation();
  usePageMeta(t("site.offers.metaTitle", { name: property.property_name }), t("site.offers.metaDesc"));

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("offers")
        .select("slug, title, description, badge, perks, is_active, sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (data && data.length > 0) {
        setItems(
          data.map((d: any) => ({
            slug: d.slug,
            title: d.title,
            description: d.description ?? "",
            badge: d.badge ?? "",
            perks: d.perks ?? [],
          })),
        );
      } else {
        setItems(mockOffers);
      }
    })();
  }, []);

  if (!loading && dbProp && (dbProp as any).offers_page_enabled === false) {
    return (
      <SiteLayout>
        <section className="pt-40 pb-20">
          <div className="container-narrow max-w-2xl text-center">
            <p className="eyebrow mb-4">{t("site.offers.eyebrow")}</p>
            <h1 className="text-4xl md:text-5xl">{t("site.offers.disabledTitle")}</h1>
            <p className="text-muted-foreground mt-4">{t("site.offers.disabledBody")}</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">{t("site.offers.eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl">{t("site.offers.title")}</h1>
          <p className="mt-6 text-muted-foreground text-lg">{t("site.offers.subtitle")}</p>
        </div>
      </section>
      <section className="section">
        <div className="container-narrow grid md:grid-cols-3 gap-6">
          {(items ?? []).map((o) => <OfferCard key={o.slug} offer={o} />)}
        </div>
      </section>
      <CTASection
        title={t("site.offers.ctaTitle")}
        primary={{ label: t("site.offers.ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("site.offers.ctaSecondary"), href: property.booking_url }}
      />
    </SiteLayout>
  );
};

export default Offers;
