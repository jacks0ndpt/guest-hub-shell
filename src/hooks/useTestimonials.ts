import { useTestimonialsQuery } from "@/lib/publicQueries";
import { useLang, pickLocalized, type Lang } from "@/lib/i18nContent";
import { testimonials as mockTestimonials } from "@/data/mock";

export type TestimonialRow = {
  id: string;
  guest_name: string;
  guest_location: string | null;
  rating: number;
  quote_ro: string | null;
  quote_en: string | null;
  source: string | null;
  source_url: string | null;
  avatar_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DisplayTestimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  source: string | null;
  source_url: string | null;
  avatar_url: string | null;
};

const toDisplay = (row: TestimonialRow, lang: Lang): DisplayTestimonial => ({
  id: row.id,
  name: row.guest_name,
  location: row.guest_location ?? "",
  quote: pickLocalized(row as unknown as Record<string, unknown>, "quote", lang),
  rating: row.rating,
  source: row.source,
  source_url: row.source_url,
  avatar_url: row.avatar_url,
});

const mockAsDisplay = (): DisplayTestimonial[] =>
  mockTestimonials.map((t, i) => ({
    id: `mock-${i}`,
    name: t.name,
    location: t.location,
    quote: t.quote,
    rating: t.rating,
    source: null,
    source_url: null,
    avatar_url: null,
  }));

/** Public hook: returns active testimonials, falls back to mock data when empty. */
export const useTestimonials = () => {
  const lang = useLang();
  const { data, isLoading } = useTestimonialsQuery();
  const rows = (data as TestimonialRow[] | undefined) ?? null;

  const items: DisplayTestimonial[] =
    rows === null ? [] : rows.length > 0 ? rows.map((r) => toDisplay(r, lang)) : mockAsDisplay();

  return { items, loading: isLoading, isFallback: rows !== null && rows.length === 0 };
};
