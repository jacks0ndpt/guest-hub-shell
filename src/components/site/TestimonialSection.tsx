import { Star } from "lucide-react";
import { testimonials } from "@/data/mock";

export const TestimonialSection = () => {
  return (
    <section className="section bg-secondary/40">
      <div className="container-narrow">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">Guest stories</p>
          <h2 className="text-4xl md:text-5xl">Kind words from recent stays.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="bg-card rounded-lg p-8 shadow-card flex flex-col">
              <div className="flex gap-0.5 text-gold mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-serif text-xl leading-snug flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                — {t.name}, {t.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
