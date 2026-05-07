import { Link } from "react-router-dom";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/data/mock";
import { useProperty } from "@/hooks/useProperty";
import { useTranslation } from "react-i18next";

export const RoomCard = ({ room }: { room: Room }) => {
  const { merged: property } = useProperty();
  const { t } = useTranslation();
  return (
    <article className="group overflow-hidden rounded-lg bg-card shadow-card transition-shadow hover:shadow-soft">
      <Link to={`/rooms/${room.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl leading-tight">
              <Link to={`/rooms/${room.slug}`} className="hover:text-primary">
                {room.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {room.short_description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="eyebrow">From</p>
            <p className="font-serif text-xl">€{room.price_from}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {room.capacity} {t("common.guests")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {room.bed_type}
          </span>
          <span>{room.size_sqm} m²</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
              {a}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/rooms/${room.slug}`}>
              View details <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <a href={property.booking_url}>Book</a>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
