import { Button } from "@/components/ui/button";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: "light" | "dark";
};

export const CTASection = ({ eyebrow, title, description, primary, secondary, variant = "dark" }: Props) => {
  const dark = variant === "dark";
  return (
    <section className={dark ? "bg-ink text-background" : "bg-secondary"}>
      <div className="container-narrow py-20 md:py-28 text-center max-w-3xl">
        {eyebrow && <p className="eyebrow mb-4 opacity-80">{eyebrow}</p>}
        <h2 className="text-4xl md:text-6xl">{title}</h2>
        {description && <p className="mt-5 text-base md:text-lg opacity-85">{description}</p>}
        {(primary || secondary) && (
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
            {primary && (
              <Button asChild size="lg" className="min-w-44">
                <a href={primary.href}>{primary.label}</a>
              </Button>
            )}
            {secondary && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className={dark ? "bg-transparent text-background border-background/60 hover:bg-background hover:text-foreground" : ""}
              >
                <a href={secondary.href}>{secondary.label}</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;
