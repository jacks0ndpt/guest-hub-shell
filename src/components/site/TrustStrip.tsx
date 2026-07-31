import { useHomepageSection } from "@/hooks/useHomepageSection";
import { resolveSectionIcon } from "@/lib/sectionIcons";

export const TrustStrip = () => {
  const { items, title, eyebrow, subtitle, loading } = useHomepageSection("trust_strip", "label");

  if (loading) return null;
  if (!items || items.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container-narrow py-8 md:py-10">
        {(eyebrow || title) && (
          <div className="mb-6 max-w-2xl">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            {title && <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>}
            {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        )}

        {/* Mobile: horizontal snap-scroll. Desktop: even grid. */}
        <ul
          className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 -mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto snap-x snap-mandatory md:overflow-visible scrollbar-hide"
        >
          {items.map((it, idx) => {
            const Icon = resolveSectionIcon(it.iconKey);
            return (
              <li
                key={idx}
                className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-auto flex items-center gap-3 rounded-lg bg-background/80 md:bg-transparent border border-border md:border-0 p-4 md:p-0"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex flex-col justify-center">
                  <p className="font-medium text-sm leading-snug">{it.title}</p>
                  {it.description && (
                    <p className="text-xs leading-snug text-muted-foreground mt-1 line-clamp-2">
                      {it.description}
                    </p>
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
