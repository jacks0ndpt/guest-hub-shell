import { useEffect } from "react";
import { useProperty } from "@/hooks/useProperty";

// Convert hex (#rrggbb) to "h s% l%" string for CSS HSL variables.
const hexToHslString = (hex: string): string | null => {
  const m = /^#?([a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

/** Applies the property's primary/secondary colors as CSS variables on <html>. */
const PropertyTheme = () => {
  const { merged } = useProperty();
  useEffect(() => {
    const root = document.documentElement;
    const primary = hexToHslString(merged.primary_color);
    const secondary = hexToHslString(merged.secondary_color);
    if (primary) {
      root.style.setProperty("--primary", primary);
      root.style.setProperty("--ring", primary);
      root.style.setProperty("--accent", primary);
    }
    if (secondary) {
      root.style.setProperty("--secondary", secondary);
    }
  }, [merged.primary_color, merged.secondary_color]);
  return null;
};

export default PropertyTheme;
