import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { property as mockProperty, type PropertySettings } from "@/data/mock";

export type DBPropertySettings = {
  id?: string;
  property_name: string;
  property_type: string | null;
  logo_url?: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  booking_url: string | null;
  currency: string | null;
  language_default: string | null;
  checkin_time: string | null;
  checkout_time: string | null;
};

const fromMock = (): DBPropertySettings => ({
  property_name: mockProperty.property_name,
  property_type: mockProperty.property_type,
  primary_color: mockProperty.primary_color,
  secondary_color: mockProperty.secondary_color,
  address: mockProperty.address,
  city: mockProperty.city,
  country: mockProperty.country,
  phone: mockProperty.phone,
  email: mockProperty.email,
  whatsapp: mockProperty.whatsapp,
  booking_url: mockProperty.booking_url,
  currency: mockProperty.currency,
  language_default: mockProperty.language_default,
  checkin_time: mockProperty.checkin_time,
  checkout_time: mockProperty.checkout_time,
});

export const useProperty = () => {
  const [property, setProperty] = useState<DBPropertySettings | null>(fromMock());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("property_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data) {
        setProperty(data as DBPropertySettings);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Helpers used elsewhere in the app
  const merged: PropertySettings = {
    ...mockProperty,
    property_name: property?.property_name ?? mockProperty.property_name,
    property_type: property?.property_type ?? mockProperty.property_type,
    address: property?.address ?? mockProperty.address,
    city: property?.city ?? mockProperty.city,
    country: property?.country ?? mockProperty.country,
    phone: property?.phone ?? mockProperty.phone,
    email: property?.email ?? mockProperty.email,
    whatsapp: property?.whatsapp ?? mockProperty.whatsapp,
    booking_url: property?.booking_url ?? mockProperty.booking_url,
    currency: property?.currency ?? mockProperty.currency,
    language_default: property?.language_default ?? mockProperty.language_default,
    checkin_time: property?.checkin_time ?? mockProperty.checkin_time,
    checkout_time: property?.checkout_time ?? mockProperty.checkout_time,
    primary_color: property?.primary_color ?? mockProperty.primary_color,
    secondary_color: property?.secondary_color ?? mockProperty.secondary_color,
  };

  return { property, merged, loading };
};
