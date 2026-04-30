import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { property } from "@/data/mock";

export const ContactSection = () => {
  return (
    <section className="section">
      <div className="container-narrow grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="eyebrow mb-3">Say hello</p>
          <h2 className="text-4xl md:text-5xl mb-6">We're always happy to help.</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Have a question about your stay, a special request, or need a recommendation in Brașov? Reach us any way you like.
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${property.phone}`} className="hover:text-primary">{property.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${property.email}`} className="hover:text-primary">{property.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <a href={`https://wa.me/${property.whatsapp.replace(/\D/g, "")}`} className="hover:text-primary">
                WhatsApp {property.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{property.address}, {property.city}, {property.country}</span>
            </li>
          </ul>
        </div>

        <form
          className="bg-card rounded-lg p-6 md:p-8 shadow-card space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="font-serif text-2xl">Send a message</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block mb-1.5">Name</label>
              <input className="w-full h-11 px-3 rounded-md border border-input bg-background" placeholder="Your name" />
            </div>
            <div>
              <label className="eyebrow block mb-1.5">Email</label>
              <input type="email" className="w-full h-11 px-3 rounded-md border border-input bg-background" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-1.5">Subject</label>
            <input className="w-full h-11 px-3 rounded-md border border-input bg-background" placeholder="Booking inquiry" />
          </div>
          <div>
            <label className="eyebrow block mb-1.5">Message</label>
            <textarea rows={5} className="w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="Tell us about your stay..." />
          </div>
          <Button type="submit" className="w-full">Send inquiry</Button>
          <p className="text-xs text-muted-foreground">This demo form is not yet connected — a real backend will be added later.</p>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
