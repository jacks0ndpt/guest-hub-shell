import SiteLayout from "@/components/site/SiteLayout";
import OfferCard from "@/components/site/OfferCard";
import CTASection from "@/components/site/CTASection";
import { offers, property } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";

const Offers = () => {
  usePageMeta(`Offers — ${property.property_name}`, "Seasonal packages and special rates when you book direct.");
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">Offers</p>
          <h1 className="text-5xl md:text-7xl">Stay a little longer, a little better.</h1>
          <p className="mt-6 text-muted-foreground text-lg">
            A few simple packages, available only when you book direct with us.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-narrow grid md:grid-cols-3 gap-6">
          {offers.map((o) => <OfferCard key={o.slug} offer={o} />)}
        </div>
      </section>
      <CTASection
        title="Questions about an offer?"
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Book Direct", href: property.booking_url }}
      />
    </SiteLayout>
  );
};

export default Offers;
