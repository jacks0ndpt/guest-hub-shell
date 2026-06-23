import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, ArrowUp, ArrowDown, Star } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type Row = {
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
};

const empty: Omit<Row, "id"> = {
  guest_name: "",
  guest_location: "",
  rating: 5,
  quote_ro: "",
  quote_en: "",
  source: "",
  source_url: "",
  avatar_url: "",
  is_active: true,
  sort_order: 0,
};

const AdminTestimonials = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.testimonialsPage.title")} — ${t("admin.admin")}`, "");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | (Omit<Row, "id"> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) toast({ title: t("common.loadFailed", { defaultValue: "Load failed" }), description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => setEditing({ ...empty, sort_order: rows.length });
  const openEdit = (r: Row) => setEditing({ ...r });

  const save = async () => {
    if (!editing) return;
    if (!editing.guest_name.trim()) {
      toast({ title: t("admin.testimonialsPage.nameRequired"), variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      guest_name: editing.guest_name.trim(),
      guest_location: editing.guest_location?.trim() || null,
      rating: Math.max(1, Math.min(5, Number(editing.rating) || 5)),
      quote_ro: editing.quote_ro?.trim() || null,
      quote_en: editing.quote_en?.trim() || null,
      source: editing.source?.trim() || null,
      source_url: editing.source_url?.trim() || null,
      avatar_url: editing.avatar_url?.trim() || null,
      is_active: !!editing.is_active,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = "id" in editing && editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("admin.testimonialsPage.saved") });
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm(t("admin.testimonialsPage.confirmDelete"))) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
    else load();
  };

  const toggleActive = async (r: Row) => {
    await supabase.from("testimonials").update({ is_active: !r.is_active }).eq("id", r.id);
    load();
  };

  const move = async (r: Row, dir: -1 | 1) => {
    const idx = rows.findIndex((x) => x.id === r.id);
    const swap = rows[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("testimonials").update({ sort_order: swap.sort_order }).eq("id", r.id),
      supabase.from("testimonials").update({ sort_order: r.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="eyebrow">{t("admin.testimonialsPage.eyebrow")}</p>
            <h1 className="font-serif text-4xl mt-1">{t("admin.testimonialsPage.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("admin.testimonialsPage.subtitle")}</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t("admin.testimonialsPage.add")}
          </Button>
        </header>

        <p className="text-xs text-muted-foreground">{t("admin.bilingualHint")}</p>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : rows.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">{t("admin.testimonialsPage.empty")}</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {rows.map((r, idx) => (
              <Card key={r.id}>
                <CardContent className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{r.guest_name}{r.guest_location ? `, ${r.guest_location}` : ""}</p>
                      <div className="flex gap-0.5 text-gold">
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                      </div>
                      <Badge variant={r.is_active ? "default" : "secondary"}>
                        {r.is_active ? t("common.active") : t("common.hidden")}
                      </Badge>
                      <Badge variant={r.quote_ro?.trim() ? "default" : "secondary"}>RO {r.quote_ro?.trim() ? "✓" : "•"}</Badge>
                      <Badge variant={r.quote_en?.trim() ? "default" : "secondary"}>EN {r.quote_en?.trim() ? "✓" : "•"}</Badge>
                      {r.source && <Badge variant="outline">{r.source}</Badge>}
                    </div>
                    {r.quote_ro && <p className="text-sm text-muted-foreground line-clamp-2">RO: "{r.quote_ro}"</p>}
                    {r.quote_en && <p className="text-sm text-muted-foreground line-clamp-2">EN: "{r.quote_en}"</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => move(r, -1)} disabled={idx === 0} aria-label="Up"><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => move(r, 1)} disabled={idx === rows.length - 1} aria-label="Down"><ArrowDown className="h-4 w-4" /></Button>
                    <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} aria-label={t("common.active")} />
                    <Button size="icon" variant="ghost" onClick={() => openEdit(r)} aria-label={t("common.edit", { defaultValue: "Edit" })}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label={t("common.delete")}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editing && "id" in editing && editing.id ? t("admin.testimonialsPage.editTitle") : t("admin.testimonialsPage.addTitle")}
              </DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t("admin.testimonialsPage.guestName")}</Label>
                    <Input value={editing.guest_name} onChange={(e) => setEditing({ ...editing, guest_name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.testimonialsPage.guestLocation")}</Label>
                    <Input value={editing.guest_location ?? ""} onChange={(e) => setEditing({ ...editing, guest_location: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.testimonialsPage.rating")}</Label>
                    <Input type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.testimonialsPage.sortOrder")}</Label>
                    <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.testimonialsPage.source")}</Label>
                    <Input placeholder="Google" value={editing.source ?? ""} onChange={(e) => setEditing({ ...editing, source: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.testimonialsPage.sourceUrl")}</Label>
                    <Input placeholder="https://" value={editing.source_url ?? ""} onChange={(e) => setEditing({ ...editing, source_url: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>{t("admin.testimonialsPage.avatar")}</Label>
                  <ImageUploader
                    bucket="site-images"
                    pathPrefix="testimonials/avatar"
                    value={editing.avatar_url ?? ""}
                    onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                    label={t("admin.testimonialsPage.avatar")}
                  />
                </div>

                <Tabs defaultValue="ro">
                  <TabsList>
                    <TabsTrigger value="ro">Română</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ro" className="mt-3">
                    <Label>{t("admin.testimonialsPage.quote")} (RO)</Label>
                    <Textarea rows={4} value={editing.quote_ro ?? ""} onChange={(e) => setEditing({ ...editing, quote_ro: e.target.value })} />
                  </TabsContent>
                  <TabsContent value="en" className="mt-3">
                    <Label>{t("admin.testimonialsPage.quote")} (EN)</Label>
                    <Textarea rows={4} value={editing.quote_en ?? ""} onChange={(e) => setEditing({ ...editing, quote_en: e.target.value })} />
                  </TabsContent>
                </Tabs>

                <div className="flex items-center gap-3">
                  <Switch checked={!!editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <Label>{t("admin.testimonialsPage.active")}</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>{t("common.cancel", { defaultValue: "Cancel" })}</Button>
              <Button onClick={save} disabled={saving}>{saving ? t("common.saving") : t("common.save", { defaultValue: "Save" })}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
