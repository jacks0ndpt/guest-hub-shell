import SiteLayout from "@/components/site/SiteLayout";
import ContactSection from "@/components/site/ContactSection";
import CTASection from "@/components/site/CTASection";
import { property } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";

const Contact = () => {
  usePageMeta(`Contact — ${property.property_name}`, "Reach our reception by phone, email, or WhatsApp.");
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-secondary/40">
        <div className="container-narrow max-w-3xl">
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="text-5xl md:text-7xl">Let's talk.</h1>
        </div>
      </section>
      <ContactSection />
      <CTASection
        title="Ready to book?"
        primary={{ label: "Book Direct", href: property.booking_url }}
      />
    </SiteLayout>
  );
};

export default Contact;
