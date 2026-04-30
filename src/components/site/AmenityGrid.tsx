import {
  Wifi, Coffee, Car, Sparkles, ConciergeBell, Mountain, PawPrint, Leaf, type LucideIcon,
} from "lucide-react";
import { amenities } from "@/data/mock";

const iconMap: Record<string, LucideIcon> = {
  Wifi, Coffee, Car, Sparkles, ConciergeBell, Mountain, PawPrint, Leaf,
};

export const AmenityGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      {amenities.map((a) => {
        const Icon = iconMap[a.icon] ?? Sparkles;
        return (
          <div key={a.label} className="text-center md:text-left">
            <Icon className="h-7 w-7 text-primary mx-auto md:mx-0" strokeWidth={1.25} />
            <h4 className="font-serif text-xl mt-4">{a.label}</h4>
            <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AmenityGrid;
