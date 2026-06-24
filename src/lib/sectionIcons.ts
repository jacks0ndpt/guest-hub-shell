import {
  Coffee,
  ParkingCircle,
  Wifi,
  MapPin,
  MessageCircle,
  Heart,
  Shield,
  Flame,
  Star,
  Clock,
  Car,
  Bath,
  Phone,
  CheckCircle2,
  Sparkles,
  Bed,
  Utensils,
  Mountain,
  Sun,
  type LucideIcon,
} from "lucide-react";

/**
 * Safe whitelist of icon keys that can be referenced from editable site_content
 * sections. Any unknown / unsafe key falls back to a neutral default.
 */
export const SECTION_ICONS: Record<string, LucideIcon> = {
  coffee: Coffee,
  parking: ParkingCircle,
  wifi: Wifi,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  heart: Heart,
  shield: Shield,
  flame: Flame,
  star: Star,
  clock: Clock,
  car: Car,
  towel: Bath,
  phone: Phone,
  "check-circle": CheckCircle2,
  sparkles: Sparkles,
  bed: Bed,
  utensils: Utensils,
  mountain: Mountain,
  sun: Sun,
};

export const ICON_KEYS = Object.keys(SECTION_ICONS);

export const resolveSectionIcon = (key?: string | null): LucideIcon =>
  (key && SECTION_ICONS[key]) || Sparkles;
