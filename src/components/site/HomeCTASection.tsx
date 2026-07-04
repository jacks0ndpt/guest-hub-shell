import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomepageSection } from "@/hooks/useHomepageSection";
import { useProperty } from "@/hooks/useProperty";

type Props = {
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackPrimaryLabel?: string;
  fallbackSecondaryLabel?: string;
  fallbackEyebrow?: string;
};

export const HomeCTASection = ({
  fallbackTitle,
  fallbackDescription,
  fallbackPrimaryLabel,
  fallbackSecondaryLabel,
  fallbackEyebrow,
}: Props) => {
  const { merged: property } = useProperty();
  const { title, eyebrow, subtitle, body, primaryCta, secondaryCta, items, loading } =
    useHomepageSection("home_cta", "label");

  if (loading) return null;

  const finalTitle = title || fallbackTitle || "";
  const finalEyebrow = eyebrow || fallbackEyebrow || "";
  const finalDescription = subtitle || body || fallbackDescription || "";
  const primaryLabel = primaryCta.label || fallbackPrimaryLabel || "";
  const secondaryLabel = secondaryCta.label || fallbackSecondaryLabel || "";
  const primaryHref = primaryCta.url || property.booking_url || "/contact";
  const secondaryHref = secondaryCta.url || "/contact";

  if (!finalTitle) return null;

  return (
    <section className="bg-ink text-background">
      <div className="container-narrow py-20 md:py-28 text-center max-w-3xl">
        {finalEyebrow && <p className="eyebrow mb-4 opacity-80">{finalEyebrow}</p>}
        <h2 className="text-4xl md:text-6xl">{finalTitle}</h2>
        {finalDescription && (
          <p className="mt-5 text-base md:text-lg opacity-85">{finalDescription}</p>
        )}

        {items.length > 0 && (
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm opacity-90">
            {items.map((it, idx) => (
              <li key={idx} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{it.title}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          {primaryLabel && (
            <Button asChild size="lg" className="min-w-44">
              <a href={primaryHref} target={primaryHref.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                {primaryLabel}
              </a>
            </Button>
          )}
          {secondaryLabel && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-background border-background/60 hover:bg-background hover:text-foreground"
            >
              <a href={secondaryHref}>{secondaryLabel}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeCTASection;
