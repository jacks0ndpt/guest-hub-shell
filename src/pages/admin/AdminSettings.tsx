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
  phone: string;
  email: string;
  whatsapp: string;
  booking_url: string;
  address: string;
  checkin_time: string;
  checkout_time: string;
  currency: string;
  primary_color: string;
  secondary_color: string;
};

const empty: Settings = {
  property_name: "",
  phone: "",
  email: "",
  whatsapp: "",
  booking_url: "",
  address: "",
  checkin_time: "",
  checkout_time: "",
  currency: "EUR",
  primary_color: "#8b7355",
  secondary_color: "#c9b99a",
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
          phone: data.phone ?? "",
          email: data.email ?? "",
          whatsapp: data.whatsapp ?? "",
          booking_url: data.booking_url ?? "",
          address: data.address ?? "",
          checkin_time: data.checkin_time ?? "",
          checkout_time: data.checkout_time ?? "",
          currency: data.currency ?? "EUR",
          primary_color: data.primary_color ?? "#8b7355",
          secondary_color: data.secondary_color ?? "#c9b99a",
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
                <div className="space-y-2">
                  <Label htmlFor="property_name">Property name</Label>
                  <Input
                    id="property_name"
                    value={form.property_name}
                    onChange={(e) => set("property_name", e.target.value)}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={form.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking_url">Booking URL</Label>
                    <Input
                      id="booking_url"
                      value={form.booking_url}
                      onChange={(e) => set("booking_url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin">Check-in time</Label>
                    <Input
                      id="checkin"
                      placeholder="15:00"
                      value={form.checkin_time}
                      onChange={(e) => set("checkin_time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout">Check-out time</Label>
                    <Input
                      id="checkout"
                      placeholder="11:00"
                      value={form.checkout_time}
                      onChange={(e) => set("checkout_time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={form.currency}
                      onChange={(e) => set("currency", e.target.value)}
                    />
                  </div>
                </div>

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
                      <Input
                        value={form.primary_color}
                        onChange={(e) => set("primary_color", e.target.value)}
                      />
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
                      <Input
                        value={form.secondary_color}
                        onChange={(e) => set("secondary_color", e.target.value)}
                      />
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
