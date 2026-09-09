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
  trustNote?: string;
  size?: "full" | "compact";
  align?: "center" | "left";
  /** When true, hide the background image and render a neutral placeholder instead. */
  imageLoading?: boolean;
};

export const HeroSection = ({
  image,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  trustNote,
  size = "full",
  align = "center",
  imageLoading = false,
}: HeroSectionProps) => {
  const isExternal = (href?: string) => !!href && /^https?:\/\//i.test(href);
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        size === "full" ? "min-h-[92vh]" : "min-h-[56vh] md:min-h-[64vh]"
      )}
    >
      {imageLoading ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary"
        />
      ) : (
        <img
          src={image}
          alt=""
          aria-hidden
          width={1920}
          height={1280}
          loading="eager"
          decoding="async"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ fetchpriority: "high" } as any)}
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
      )}
      {/* Layered warm overlay for readability + editorial mood */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-transparent mix-blend-multiply" />


      <div
        className={cn(
          "relative container-narrow flex flex-col justify-end pb-14 pt-28 md:pb-24 md:pt-40",
          size === "full" ? "min-h-[92vh]" : "min-h-[56vh] md:min-h-[64vh]",
          align === "center" ? "items-center text-center" : "items-start text-left"
        )}
      >
        {eyebrow && (
          <p className="eyebrow text-background/85 mb-5 animate-fade-up">{eyebrow}</p>
        )}
        <h1
          className={cn(
            "text-background font-serif animate-fade-up text-balance",
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
          <div
            className={cn(
              "mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-up",
              align === "center" && "sm:justify-center"
            )}
          >
            {primaryCta && (
              <Button asChild size="lg" className="min-w-44 shadow-soft">
                <a
                  href={primaryCta.href}
                  target={isExternal(primaryCta.href) ? "_blank" : undefined}
                  rel={isExternal(primaryCta.href) ? "noopener noreferrer" : undefined}
                >
                  {primaryCta.label}
                </a>
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-44 bg-background/10 text-background border-background/60 backdrop-blur-sm hover:bg-background hover:text-foreground"
              >
                <a href={secondaryCta.href}>{secondaryCta.label}</a>
              </Button>
            )}
          </div>
        )}
        {trustNote && (
          <p className="mt-6 text-xs md:text-sm text-background/75 max-w-md animate-fade-up">
            {trustNote}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
