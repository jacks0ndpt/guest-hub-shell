import { Button } from "@/components/ui/button";
import { useHomepageSection } from "@/hooks/useHomepageSection";
import { resolveSectionIcon } from "@/lib/sectionIcons";
import { ArrowRight } from "lucide-react";

export const GuestConvenienceSection = () => {
  const { items, title, eyebrow, subtitle, body, imageUrl, primaryCta, loading } =
    useHomepageSection("guest_convenience", "title");

  if (loading) return null;
  if (!title && (!items || items.length === 0)) return null;

  return (
    <section className="section bg-secondary/40">
      <div className="container-narrow grid md:grid-cols-2 gap-12 items-center">
        <div>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && <h2 className="text-4xl md:text-5xl">{title}</h2>}
          {subtitle && <p className="mt-5 text-muted-foreground max-w-md">{subtitle}</p>}
          {body && <p className="mt-4 text-muted-foreground max-w-md">{body}</p>}
          {primaryCta.label && (
            <Button asChild className="mt-8" variant="outline">
              <a href={primaryCta.url || "/guest"}>
                {primaryCta.label} <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || "Guest convenience"}
              loading="lazy"
              className="rounded-lg w-full aspect-[4/3] object-cover"
            />
          ) : items.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((it, idx) => {
                const Icon = resolveSectionIcon(it.iconKey);
                return (
                  <div key={idx} className="border border-border rounded-lg p-5 bg-card">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    <p className="font-serif text-lg mt-3">{it.title}</p>
                    {it.description && (
                      <p className="text-sm text-muted-foreground mt-1">{it.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default GuestConvenienceSection;
