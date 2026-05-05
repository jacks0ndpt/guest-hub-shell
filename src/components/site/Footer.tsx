import { Link } from "react-router-dom";
import { property as mock } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { useSiteContent, get } from "@/hooks/useSiteContent";

export const Footer = () => {
  const { merged: property } = useProperty();
  const { content } = useSiteContent();
  const tagline = get(content, "footer", "tagline");
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container-narrow py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/40 text-primary font-serif">
              {mock.logo_placeholder}
            </span>
            <span className="font-serif text-2xl">{property.property_name}</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            {tagline || mock.short_description}
          </p>
          <div className="flex gap-4 pt-2">
            {mock.social.map((s) => (
              <a key={s.label} href={s.url} className="text-sm underline-offset-4 hover:underline">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rooms" className="hover:text-primary">Rooms</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/offers" className="hover:text-primary">Offers</Link></li>
            <li><Link to="/location" className="hover:text-primary">Location</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{property.address}</li>
            <li>{property.city}, {property.country}</li>
            <li><a href={`tel:${property.phone}`} className="hover:text-primary">{property.phone}</a></li>
            <li><a href={`mailto:${property.email}`} className="hover:text-primary">{property.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-narrow py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {property.property_name}. All rights reserved.</p>
          <p>Check-in {property.checkin_time} · Check-out {property.checkout_time}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
