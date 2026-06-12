import {
  Wifi, Coffee, Car, Sparkles, ConciergeBell, Mountain, PawPrint, Leaf, type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, LucideIcon> = {
  Wifi, Coffee, Car, Sparkles, ConciergeBell, Mountain, PawPrint, Leaf,
};

const items = [
  { icon: "Wifi", key: "wifi" },
  { icon: "Coffee", key: "breakfast" },
  { icon: "Car", key: "parking" },
  { icon: "Sparkles", key: "housekeeping" },
  { icon: "ConciergeBell", key: "reception" },
  { icon: "Mountain", key: "views" },
  { icon: "PawPrint", key: "pets" },
  { icon: "Leaf", key: "garden" },
];

export const AmenityGrid = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      {items.map((a) => {
        const Icon = iconMap[a.icon] ?? Sparkles;
        return (
          <div key={a.key} className="text-center md:text-left">
            <Icon className="h-7 w-7 text-primary mx-auto md:mx-0" strokeWidth={1.25} />
            <h4 className="font-serif text-xl mt-4">{t(`data.amenities.${a.key}.label`)}</h4>
            <p className="text-sm text-muted-foreground mt-1">{t(`data.amenities.${a.key}.desc`)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AmenityGrid;
