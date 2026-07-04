import { useHomepageSection } from "@/hooks/useHomepageSection";
import { resolveSectionIcon } from "@/lib/sectionIcons";

export const WhyUsSection = () => {
  const { items, title, eyebrow, subtitle, loading } = useHomepageSection("why_us", "title");

  if (loading) return null;
  if (!title && (!items || items.length === 0)) return null;

  return (
    <section className="section">
      <div className="container-narrow">
        <div className="max-w-2xl mb-14">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && <h2 className="text-4xl md:text-5xl">{title}</h2>}
          {subtitle && <p className="mt-5 text-muted-foreground">{subtitle}</p>}
        </div>
        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((it, idx) => {
              const Icon = resolveSectionIcon(it.iconKey);
              return (
                <div key={idx} className="text-center md:text-left">
                  <Icon className="h-7 w-7 text-primary mx-auto md:mx-0" strokeWidth={1.25} />
                  <h3 className="font-serif text-xl mt-4">{it.title}</h3>
                  {it.description && (
                    <p className="text-sm text-muted-foreground mt-1">{it.description}</p>
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
