import { useHomepageSection } from "@/hooks/useHomepageSection";
import { resolveSectionIcon } from "@/lib/sectionIcons";

export const TrustStrip = () => {
  const { items, title, eyebrow, subtitle, loading } = useHomepageSection("trust_strip", "label");

  if (loading) return null;
  if (!items || items.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-narrow py-10">
        {(eyebrow || title) && (
          <div className="mb-8 max-w-2xl">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            {title && <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>}
            {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        )}
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6">
          {items.map((it, idx) => {
            const Icon = resolveSectionIcon(it.iconKey);
            return (
              <li key={idx} className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-sm">{it.title}</p>
                  {it.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{it.description}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default TrustStrip;
