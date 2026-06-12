import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { Offer } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";

export const OfferCard = ({ offer }: { offer: Offer }) => {
  const { t } = useTranslation();
  const { merged: property } = useProperty();
  return (
    <article className="flex flex-col h-full rounded-lg border border-border bg-card p-8 shadow-card">
      {offer.badge && (
        <span className="self-start text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-accent text-accent-foreground">
          {offer.badge}
        </span>
      )}
      <h3 className="font-serif text-3xl mt-5">{offer.title}</h3>
      <p className="text-muted-foreground mt-3">{offer.description}</p>
      <ul className="mt-6 space-y-2.5 text-sm flex-1">
        {offer.perks.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <Button asChild className="mt-8 w-full">
        <a href={property.booking_url} target="_blank" rel="noopener noreferrer">{t("site.offers.bookThisOffer")}</a>
      </Button>
    </article>
  );
};

export default OfferCard;
