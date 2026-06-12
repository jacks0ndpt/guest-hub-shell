import SiteLayout from "@/components/site/SiteLayout";
import RoomCard from "@/components/site/RoomCard";
import CTASection from "@/components/site/CTASection";
import { useProperty } from "@/hooks/useProperty";
import { useRooms } from "@/hooks/useRooms";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTranslation } from "react-i18next";

const Rooms = () => {
  const { merged: property } = useProperty();
  const { rooms } = useRooms();
  const { t } = useTranslation();
  usePageMeta(t("site.rooms.metaTitle", { name: property.property_name }), t("site.rooms.metaDesc"));
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">{t("site.rooms.eyebrow")}</p>
          <h1 className="text-5xl md:text-7xl">{t("site.rooms.title")}</h1>
          <p className="mt-6 text-muted-foreground text-lg">{t("site.rooms.subtitle")}</p>
        </div>
      </section>
      <section className="section">
        <div className="container-narrow grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => <RoomCard key={r.slug} room={r} />)}
        </div>
      </section>
      <CTASection
        title={t("site.rooms.ctaTitle")}
        description={t("site.rooms.ctaDesc")}
        primary={{ label: t("site.rooms.ctaPrimary"), href: property.booking_url }}
        secondary={{ label: t("site.rooms.ctaSecondary"), href: "/contact" }}
      />
    </SiteLayout>
  );
};

export default Rooms;
