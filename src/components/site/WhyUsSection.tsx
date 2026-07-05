import { useHomepageSection } from "@/hooks/useHomepageSection";
import { resolveSectionIcon } from "@/lib/sectionIcons";

export const WhyUsSection = () => {
  const { items, title, eyebrow, subtitle, loading } = useHomepageSection("why_us", "title");

  if (loading) return null;
  if (!title && (!items || items.length === 0)) return null;

  return (
    <section className="section">
      <div className="container-narrow">
        <div className="max-w-2xl mb-12 md:mb-16">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && <h2 className="text-4xl md:text-5xl">{title}</h2>}
          {subtitle && <p className="mt-5 text-muted-foreground">{subtitle}</p>}
        </div>
        {items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((it, idx) => {
              const Icon = resolveSectionIcon(it.iconKey);
              return (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-border bg-card p-6 shadow-card transition hover:shadow-soft hover:-translate-y-0.5"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-serif text-xl mt-5">{it.title}</h3>
                  {it.description && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {it.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyUsSection;
