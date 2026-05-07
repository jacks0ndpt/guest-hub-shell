import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { property as mockProperty } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { merged: property, property: dbProp } = useProperty();
  const { t } = useTranslation();
  void mockProperty;
  const offersEnabled = dbProp?.offers_page_enabled ?? true;
  const baseLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/rooms", label: t("nav.rooms") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/offers", label: t("nav.offers"), offersOnly: true as const },
    { to: "/location", label: t("nav.location") },
    { to: "/contact", label: t("nav.contact") },
  ];
  const links = baseLinks.filter((l) => !l.offersOnly || offersEnabled);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        transparent
          ? "bg-transparent text-background"
          : "bg-background/85 backdrop-blur-md border-b border-border text-foreground"
      )}
    >
      <div className="container-narrow flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label={property.property_name}>
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border text-sm font-serif",
              transparent ? "border-background/60" : "border-primary/40 text-primary"
            )}
          >
            {property.logo_placeholder}
          </span>
          <span className="font-serif text-xl leading-none">{property.property_name}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm tracking-wide transition-opacity hover:opacity-70",
                  isActive && "underline underline-offset-8 decoration-1"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            asChild
            size="sm"
            className={cn(
              transparent &&
                "bg-background text-foreground hover:bg-background/90"
            )}
          >
            <a href={property.booking_url} target="_blank" rel="noopener noreferrer">{t("nav.bookDirect")}</a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background text-foreground">
          <div className="container-narrow flex flex-col py-6 gap-5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn("text-lg font-serif", isActive && "text-primary")
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button asChild className="mt-2 w-full">
              <a href={property.booking_url}>Book Direct</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
