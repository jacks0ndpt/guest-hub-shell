import { MapPin } from "lucide-react";
import { property } from "@/data/mock";

export const MapPlaceholder = () => {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gradient-warm border border-border">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, hsl(var(--accent) / 0.25), transparent 55%), radial-gradient(circle at 75% 65%, hsl(var(--primary) / 0.25), transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="grid place-items-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-soft">
          <MapPin className="h-5 w-5" />
        </div>
        <p className="font-serif text-2xl mt-4">{property.property_name}</p>
        <p className="text-sm text-muted-foreground">
          {property.address}, {property.city}, {property.country}
        </p>
        <p className="text-xs text-muted-foreground mt-3">Interactive map coming soon</p>
      </div>
    </div>
  );
};

export default MapPlaceholder;
