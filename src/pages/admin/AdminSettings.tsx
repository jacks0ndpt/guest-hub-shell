import { FormEvent, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";

type Settings = {
  id?: string;
  property_name: string;
  property_type: string;
  phone: string;
  email: string;
  whatsapp: string;
  booking_url: string;
  address: string;
  city: string;
  country: string;
  checkin_time: string;
  checkout_time: string;
  currency: string;
  language_default: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
};

const empty: Settings = {
  property_name: "",
  property_type: "",
  phone: "",
  email: "",
  whatsapp: "",
  booking_url: "",
  address: "",
  city: "",
  country: "",
  checkin_time: "",
  checkout_time: "",
  currency: "EUR",
  language_default: "en",
  primary_color: "#8b7355",
  secondary_color: "#c9b99a",
  logo_url: "",
};

const AdminSettings = () => {
  usePageMeta("Settings — Admin", "Edit property name, contacts and brand colors.");
  const [form, setForm] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("property_settings").select("*").limit(1).maybeSingle();
      if (data) {
        setForm({
          id: data.id,
          property_name: data.property_name ?? "",
          property_type: data.property_type ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          whatsapp: data.whatsapp ?? "",
          booking_url: data.booking_url ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          checkin_time: data.checkin_time ?? "",
          checkout_time: data.checkout_time ?? "",
          currency: data.currency ?? "EUR",
          language_default: data.language_default ?? "en",
          primary_color: data.primary_color ?? "#8b7355",
          secondary_color: data.secondary_color ?? "#c9b99a",
          logo_url: data.logo_url ?? "",
        });
      }
      setLoading(false);
    })();
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      delete (payload as { id?: string }).id;
      const { error } = form.id
        ? await supabase.from("property_settings").update(payload).eq("id", form.id)
        : await supabase.from("property_settings").insert(payload);
      if (error) throw error;
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const field = (id: keyof Settings, label: string, type = "text", placeholder?: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={(form[id] as string) ?? ""}
        onChange={(e) => set(id, e.target.value as never)}
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <header>
          <p className="eyebrow">Settings</p>
          <h1 className="font-serif text-4xl mt-1">Property settings</h1>
          <p className="text-muted-foreground mt-2">
            These values power the public website and guest experience.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {field("property_name", "Property name")}
                  {field("property_type", "Property type", "text", "Hotel, B&B, Motel…")}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {field("phone", "Phone")}
                  {field("email", "Email", "email")}
                  {field("whatsapp", "WhatsApp")}
                  {field("booking_url", "Booking URL")}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {field("address", "Address")}
                  {field("city", "City")}
                  {field("country", "Country")}
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  {field("checkin_time", "Check-in", "text", "15:00")}
                  {field("checkout_time", "Check-out", "text", "11:00")}
                  {field("currency", "Currency")}
                  {field("language_default", "Default language")}
                </div>

                {field("logo_url", "Logo URL")}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary">Primary color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primary"
                        type="color"
                        value={form.primary_color}
                        onChange={(e) => set("primary_color", e.target.value)}
                        className="h-10 w-16 p-1"
                      />
                      <Input value={form.primary_color} onChange={(e) => set("primary_color", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary">Secondary color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondary"
                        type="color"
                        value={form.secondary_color}
                        onChange={(e) => set("secondary_color", e.target.value)}
                        className="h-10 w-16 p-1"
                      />
                      <Input value={form.secondary_color} onChange={(e) => set("secondary_color", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
