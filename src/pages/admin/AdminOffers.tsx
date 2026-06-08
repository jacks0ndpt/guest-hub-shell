import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";

type Offer = {
  id?: string;
  slug: string;
  title: string;
  description: string | null;
  badge: string | null;
  perks: string[] | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number | null;
};

const empty: Offer = {
  slug: "",
  title: "",
  description: "",
  badge: "",
  perks: [],
  image_url: "",
  is_active: true,
  sort_order: 0,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminOffers = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.offersPage.title")} — ${t("admin.admin")}`, "");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageEnabled, setPageEnabled] = useState(true);
  const [propId, setPropId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Offer>(empty);
  const [perksStr, setPerksStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: offerData }, { data: prop }] = await Promise.all([
      supabase.from("offers").select("*").order("sort_order"),
      supabase.from("property_settings").select("id, offers_page_enabled").limit(1).maybeSingle(),
    ]);
    setOffers((offerData as Offer[]) ?? []);
    if (prop) {
      setPropId(prop.id as string);
      setPageEnabled(Boolean((prop as any).offers_page_enabled ?? true));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePage = async (v: boolean) => {
    setPageEnabled(v);
    if (propId) {
      await supabase.from("property_settings").update({ offers_page_enabled: v }).eq("id", propId);
      toast({ title: v ? t("admin.offersPage.enabled") : t("admin.offersPage.disabled") });
    }
  };

  const startEdit = (o?: Offer) => {
    const f = o ?? empty;
    setForm(f);
    setPerksStr((f.perks ?? []).join("\n"));
    setOpen(true);
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `offers/${form.slug || slugify(form.title) || "offer"}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file);
    if (error) {
      toast({ title: t("common.uploadFailed"), description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setForm((p) => ({ ...p, image_url: data.publicUrl }));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      description: form.description || null,
      badge: form.badge || null,
      perks: perksStr.split("\n").map((s) => s.trim()).filter(Boolean),
      image_url: form.image_url || null,
      is_active: form.is_active,
      sort_order: form.sort_order ?? 0,
    };
    const { error } = form.id
      ? await supabase.from("offers").update(payload).eq("id", form.id)
      : await supabase.from("offers").insert(payload);
    setSaving(false);
    if (error) toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
    else {
      toast({ title: form.id ? t("admin.offersPage.updated") : t("admin.offersPage.created") });
      setOpen(false);
      load();
    }
  };

  const remove = async (id: string) => {
    await supabase.from("offers").delete().eq("id", id);
    load();
  };

  const toggleActive = async (o: Offer, v: boolean) => {
    await supabase.from("offers").update({ is_active: v }).eq("id", o.id!);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow">{t("admin.offersPage.eyebrow")}</p>
            <h1 className="font-serif text-4xl mt-1">{t("admin.offersPage.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("admin.offersPage.subtitle")}</p>
          </div>
          <Button onClick={() => startEdit()}>
            <Plus className="h-4 w-4" /> {t("admin.offersPage.newOffer")}
          </Button>
        </header>

        <Card>
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{t("admin.offersPage.offersPage")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.offersPage.offersPageHint")}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{pageEnabled ? t("admin.offersPage.visible") : t("common.hidden")}</span>
              <Switch checked={pageEnabled} onCheckedChange={togglePage} />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : offers.length === 0 ? (
          <p className="text-muted-foreground">{t("admin.offersPage.noOffers")}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map((o) => (
              <Card key={o.id} className="overflow-hidden flex flex-col">
                {o.image_url && (
                  <div className="aspect-[4/3] bg-secondary overflow-hidden">
                    <img src={o.image_url} alt={o.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                  {o.badge && <Badge variant="secondary" className="self-start">{o.badge}</Badge>}
                  <h3 className="font-serif text-xl">{o.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{o.description}</p>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                    {(o.perks ?? []).slice(0, 3).map((p) => <li key={p}>· {p}</li>)}
                  </ul>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch checked={o.is_active} onCheckedChange={(v) => toggleActive(o, v)} />
                      <span className="text-xs text-muted-foreground">
                        {o.is_active ? t("common.active") : t("common.hidden")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => startEdit(o)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(o.id!)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {form.id ? t("admin.offersPage.edit") : t("admin.offersPage.new")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("admin.offersPage.fTitle")}</Label>
                  <Input
                    required
                    value={form.title}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, title: e.target.value }));
                      if (!form.id && !form.slug)
                        setForm((p) => ({ ...p, slug: slugify(e.target.value) }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("admin.offersPage.fSlug")}</Label>
                  <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("admin.offersPage.fBadge")}</Label>
                <Input value={form.badge ?? ""} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Save 15%" />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.offersPage.fDescription")}</Label>
                <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.offersPage.fPerks")}</Label>
                <Textarea rows={4} value={perksStr} onChange={(e) => setPerksStr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("common.image")}</Label>
                {form.image_url && <img src={form.image_url} className="w-full max-h-40 object-cover rounded-md border border-border" />}
                <div className="flex gap-2">
                  <Input value={form.image_url ?? ""} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} placeholder={t("common.imageURLOrUpload")} />
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 items-end">
                <div className="space-y-2">
                  <Label>{t("common.sortOrder")}</Label>
                  <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                  <Label>{t("common.active")}</Label>
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
                </div>
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? t("common.saving") : t("admin.offersPage.save")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;
