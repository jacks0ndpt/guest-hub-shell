import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import SiteLayout from "@/components/site/SiteLayout";
import HeroSection from "@/components/site/HeroSection";
import RoomCard from "@/components/site/RoomCard";
import OfferCard from "@/components/site/OfferCard";
import AmenityGrid from "@/components/site/AmenityGrid";
import GalleryGrid from "@/components/site/GalleryGrid";
import TestimonialSection from "@/components/site/TestimonialSection";
import TrustStrip from "@/components/site/TrustStrip";
import WhyUsSection from "@/components/site/WhyUsSection";
import GuestConvenienceSection from "@/components/site/GuestConvenienceSection";
import HomeCTASection from "@/components/site/HomeCTASection";
import MapPlaceholder from "@/components/site/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { heroHotel } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { useFeaturedRooms, useFeaturedOffers } from "@/hooks/useFeatured";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useSiteContent, get } from "@/hooks/useSiteContent";
import { useLang, pickLocalizedArray } from "@/lib/i18nContent";
import { useTranslation } from "react-i18next";
import type { Offer } from "@/data/mock";

const Index = () => {
  const { merged: property, property: dbProp } = useProperty();
  const { rooms: featuredRooms } = useFeaturedRooms(3);
  const { offers: featuredOffers } = useFeaturedOffers(3);
  const { content, lang } = useSiteContent();
  const currentLang = useLang();
  const { t } = useTranslation();
  usePageMeta(
    `${property.property_name} — ${t("site.home.metaSuffix", { city: property.city })}`,
    property.short_description
  );

  const offerCards: Offer[] = featuredOffers.map((o) => {
    const row = o as unknown as Record<string, unknown>;
    const perks = pickLocalizedArray(row, "perks", currentLang);
    return {
      slug: (o as any).slug,
      title: o.title,
      description: o.description || "",
      badge: o.badge || "",
      perks: perks.length > 0 ? perks : ((o as any).perks ?? []),
    };
  });

  return (
    <SiteLayout>
      <HeroSection
        image={dbProp?.hero_image_url || heroHotel}
        eyebrow={get(content, "hero", "eyebrow", lang) || `${property.property_type} · ${property.city}, ${property.country}`}
        title={<>{get(content, "hero", "title_line1", lang)}<br className="hidden md:block" /> {get(content, "hero", "title_line2", lang)}</>}
        subtitle={get(content, "hero", "subtitle", lang) || property.short_description}
        primaryCta={{ label: get(content, "hero", "primary_cta_label", lang) || t("site.home.heroFallbackPrimary"), href: property.booking_url }}
        secondaryCta={{ label: get(content, "hero", "secondary_cta_label", lang) || t("site.home.heroFallbackSecondary"), href: "/rooms" }}
      />

      {/* Trust strip (admin-managed) */}
      <TrustStrip />

      {/* Positioning */}
      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="eyebrow mb-3">{get(content, "about", "eyebrow", lang)} {property.property_name}</p>
            <h2 className="text-4xl md:text-5xl">{get(content, "about", "title", lang)}</h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>{get(content, "about", "paragraph1", lang)}</p>
            <p>{get(content, "about", "paragraph2", lang)}</p>
          </div>
        </div>
      </section>

      {/* Rooms (featured) */}
      {featuredRooms.length > 0 && (
        <section className="section bg-secondary/40">
          <div className="container-narrow">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div className="max-w-xl">
                <p className="eyebrow mb-3">{t("site.home.ourRoomsEyebrow")}</p>
                <h2 className="text-4xl md:text-5xl">{t("site.home.ourRoomsTitle")}</h2>
              </div>
              <Button asChild variant="outline">
                <Link to="/rooms">{t("site.home.viewAllRooms")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((r) => <RoomCard key={r.slug} room={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why us (admin-managed) */}
      <WhyUsSection />

      {/* Amenities */}
      <section className="section">
        <div className="container-narrow">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow mb-3">{get(content, "amenities", "eyebrow", lang)}</p>
            <h2 className="text-4xl md:text-5xl">{get(content, "amenities", "title", lang)}</h2>
          </div>
          <AmenityGrid scope="homepage" />
        </div>
      </section>

      {/* Guest convenience (admin-managed) */}
      <GuestConvenienceSection />

      {/* Offers (featured) */}
      {offerCards.length > 0 && (
        <section className="section">
          <div className="container-narrow">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div className="max-w-xl">
                <p className="eyebrow mb-3">{t("site.offers.eyebrow", { defaultValue: "Offers" })}</p>
                <h2 className="text-4xl md:text-5xl">{t("site.offers.title", { defaultValue: "Special offers" })}</h2>
              </div>
              <Button asChild variant="outline">
                <Link to="/offers">{t("site.offers.viewAll", { defaultValue: "View all offers" })} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerCards.map((o) => <OfferCard key={o.slug} offer={o} />)}
            </div>
          </div>
        </section>
      )}

      {/* Gallery preview */}
      <section className="section bg-secondary/40">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <p className="eyebrow mb-3">{t("site.home.galleryEyebrow")}</p>
              <h2 className="text-4xl md:text-5xl">{t("site.home.galleryTitle")}</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/gallery">{t("site.home.fullGallery")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <GalleryGrid filterable={false} limit={6} />
        </div>
      </section>

      {/* Location preview */}
      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow mb-3">{get(content, "location", "eyebrow", lang)}</p>
            <h2 className="text-4xl md:text-5xl">{get(content, "location", "title", lang)}</h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              {get(content, "location", "description", lang)}
            </p>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/location">{t("site.home.exploreArea")} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <MapPlaceholder />
        </div>
      </section>

      <TestimonialSection />

      {/* Final CTA (admin-managed with i18n fallback) */}
      <HomeCTASection
        fallbackEyebrow={t("site.home.ctaEyebrow")}
        fallbackTitle={t("site.home.ctaTitle")}
        fallbackDescription={t("site.home.ctaDescription")}
        fallbackPrimaryLabel={t("site.home.ctaPrimary")}
        fallbackSecondaryLabel={t("site.home.ctaSecondary")}
      />
    </SiteLayout>
  );
};

export default Index;
