import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTestimonials } from "@/hooks/useTestimonials";

export const TestimonialSection = () => {
  const { t } = useTranslation();
  const { items, loading } = useTestimonials();

  if (loading || items.length === 0) {
    // Keep section silent while loading; mock fallback inside hook keeps it populated otherwise.
    if (loading) return null;
  }

  return (
    <section className="section bg-secondary/40">
      <div className="container-narrow">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">{t("site.testimonials.eyebrow")}</p>
          <h2 className="text-4xl md:text-5xl">{t("site.testimonials.title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <figure key={item.id} className="bg-card rounded-lg p-8 shadow-card flex flex-col">
              <div className="flex gap-0.5 text-gold mb-4">
                {Array.from({ length: Math.max(0, Math.min(5, Math.round(item.rating))) }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-serif text-xl leading-snug flex-1">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground flex items-center gap-3">
                {item.avatar_url && (
                  <img
                    src={item.avatar_url}
                    alt={item.name}
                    className="h-8 w-8 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <span>
                  — {item.name}
                  {item.location ? `, ${item.location}` : ""}
                  {item.source && (
                    <>
                      {" · "}
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="underline hover:text-foreground"
                        >
                          {item.source}
                        </a>
                      ) : (
                        item.source
                      )}
                    </>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
