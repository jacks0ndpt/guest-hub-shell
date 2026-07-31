import { useProperty } from "@/hooks/useProperty";

export const DEFAULT_CURRENCY = "RON";

export const normalizeCurrency = (value?: string | null): string => {
  const code = (value || "").trim().toUpperCase();
  return code.length > 0 ? code : DEFAULT_CURRENCY;
};

/**
 * Display-only currency helper. No conversion is performed — the numeric
 * value is rendered as-is with the currency chosen in admin settings.
 */
export const formatPrice = (amount: number | string, currency?: string | null): string =>
  `${amount} ${normalizeCurrency(currency)}`;

export const useCurrency = () => {
  const { merged, property } = useProperty();
  const currency = normalizeCurrency(property?.currency ?? merged.currency);
  return {
    currency,
    format: (amount: number | string) => formatPrice(amount, currency),
  };
};
