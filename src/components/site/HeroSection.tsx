import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  image: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  size?: "full" | "compact";
  align?: "center" | "left";
};

export const HeroSection = ({
  image,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  size = "full",
  align = "center",
}: HeroSectionProps) => {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        size === "full" ? "min-h-[92vh]" : "min-h-[56vh] md:min-h-[64vh]"
      )}
    >
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div
        className={cn(
          "relative container-narrow flex h-full min-h-inherit flex-col justify-end pb-16 pt-28 md:pb-24 md:pt-40",
          size === "full" ? "min-h-[92vh]" : "min-h-[56vh] md:min-h-[64vh]",
          align === "center" ? "items-center text-center" : "items-start text-left"
        )}
      >
        {eyebrow && (
          <p className="eyebrow text-background/80 mb-5 animate-fade-up">{eyebrow}</p>
        )}
        <h1
          className={cn(
            "text-background font-serif animate-fade-up",
            size === "full"
              ? "text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl"
              : "text-4xl md:text-6xl max-w-3xl"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-base md:text-lg text-background/85 animate-fade-up">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-up">
            {primaryCta && (
              <Button asChild size="lg" className="min-w-44">
                <a href={primaryCta.href}>{primaryCta.label}</a>
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-44 bg-transparent text-background border-background/70 hover:bg-background hover:text-foreground"
              >
                <a href={secondaryCta.href}>{secondaryCta.label}</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
