import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { property as mock } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { useSiteContent, get } from "@/hooks/useSiteContent";

export const Footer = () => {
  const { merged: property } = useProperty();
  const { content, lang } = useSiteContent();
  const { t } = useTranslation();
  const tagline = get(content, "footer", "tagline", lang);
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
          <h4 className="eyebrow mb-4">{t("footer.explore")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/rooms" className="hover:text-primary">{t("nav.rooms")}</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">{t("nav.gallery")}</Link></li>
            <li><Link to="/offers" className="hover:text-primary">{t("nav.offers")}</Link></li>
            <li><Link to="/location" className="hover:text-primary">{t("nav.location")}</Link></li>
            <li><Link to="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">{t("footer.contact")}</h4>
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
          <p>© {new Date().getFullYear()} {property.property_name}. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <p>{t("footer.checkin")} {property.checkin_time} · {t("footer.checkout")} {property.checkout_time}</p>
            <Link to="/admin/login" className="hover:text-foreground opacity-60 hover:opacity-100 transition-opacity">
              {t("footer.staff")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
