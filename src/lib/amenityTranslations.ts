import type { Lang } from "./i18nContent";

/**
 * Fallback translations for common room amenity chips.
 * Used only when the DB row doesn't have a proper `amenities_ro` / `amenities_en`
 * localized array. Keeps room cards/details from mixing languages in RO mode.
 */
const MAP: Record<string, { ro: string; en: string }> = {
  "free wi-fi": { ro: "Wi-Fi gratuit", en: "Free Wi-Fi" },
  "wi-fi": { ro: "Wi-Fi gratuit", en: "Free Wi-Fi" },
  "wifi": { ro: "Wi-Fi gratuit", en: "Free Wi-Fi" },
  "smart tv": { ro: "Smart TV", en: "Smart TV" },
  "rain shower": { ro: "Duș tip ploaie", en: "Rain shower" },
  "queen bed": { ro: "Pat Queen", en: "Queen bed" },
  "king bed": { ro: "Pat King", en: "King bed" },
  "double bed": { ro: "Pat dublu", en: "Double bed" },
  "single bed": { ro: "Pat single", en: "Single bed" },
  "air conditioning": { ro: "Aer condiționat", en: "Air conditioning" },
  "ac": { ro: "Aer condiționat", en: "Air conditioning" },
  "breakfast included": { ro: "Mic dejun inclus", en: "Breakfast included" },
  "balcony": { ro: "Balcon", en: "Balcony" },
  "mountain view": { ro: "Vedere la munte", en: "Mountain view" },
  "city view": { ro: "Vedere la oraș", en: "City view" },
  "garden view": { ro: "Vedere la grădină", en: "Garden view" },
  "workspace": { ro: "Zonă de lucru", en: "Workspace" },
  "desk": { ro: "Birou", en: "Desk" },
  "safe": { ro: "Seif", en: "Safe" },
  "minibar": { ro: "Minibar", en: "Minibar" },
  "kettle": { ro: "Fierbător", en: "Kettle" },
  "coffee machine": { ro: "Espressor", en: "Coffee machine" },
  "hair dryer": { ro: "Uscător de păr", en: "Hair dryer" },
  "bathtub": { ro: "Cadă", en: "Bathtub" },
  "sofa": { ro: "Canapea", en: "Sofa" },
  "pet friendly": { ro: "Animale acceptate", en: "Pet friendly" },
  "non smoking": { ro: "Nefumători", en: "Non-smoking" },
  "non-smoking": { ro: "Nefumători", en: "Non-smoking" },
  "parking": { ro: "Parcare", en: "Parking" },
  "free parking": { ro: "Parcare gratuită", en: "Free parking" },
};

export const translateAmenity = (raw: string, lang: Lang): string => {
  if (!raw) return raw;
  const key = raw.trim().toLowerCase();
  const hit = MAP[key];
  if (hit) return lang === "en" ? hit.en : hit.ro;
  return raw;
};

export const translateAmenities = (list: string[], lang: Lang): string[] =>
  list.map((a) => translateAmenity(a, lang));
