import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { ICON_KEYS, resolveSectionIcon } from "@/lib/sectionIcons";

type Row = {
  id: string;
  icon_key: string;
  label_ro: string;
  label_en: string | null;
  description_ro: string | null;
  description_en: string | null;
  is_active: boolean;
  show_on_homepage: boolean;
  show_on_room_pages: boolean;
  sort_order: number;
};

const empty: Omit<Row, "id"> = {
  icon_key: "sparkles",
  label_ro: "",
  label_en: "",
  description_ro: "",
  description_en: "",
  is_active: true,
  show_on_homepage: true,
  show_on_room_pages: true,
  sort_order: 0,
};

const AdminAmenities = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.amenitiesPage.title")} — ${t("admin.admin")}`, "");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | (Omit<Row, "id"> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("amenities")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) toast({ title: t("common.loadFailed", { defaultValue: "Load failed" }), description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => setEditing({ ...empty, sort_order: rows.length });
  const openEdit = (r: Row) => setEditing({ ...r });

  const save = async () => {
    if (!editing) return;
    if (!editing.label_ro.trim()) {
      toast({ title: t("admin.amenitiesPage.labelRoRequired"), variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      icon_key: editing.icon_key || "sparkles",
      label_ro: editing.label_ro.trim(),
      label_en: editing.label_en?.trim() || null,
      description_ro: editing.description_ro?.trim() || null,
      description_en: editing.description_en?.trim() || null,
      is_active: !!editing.is_active,
      show_on_homepage: !!editing.show_on_homepage,
      show_on_room_pages: !!editing.show_on_room_pages,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = "id" in editing && editing.id
      ? await supabase.from("amenities").update(payload).eq("id", editing.id)
      : await supabase.from("amenities").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("admin.amenitiesPage.saved") });
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm(t("admin.amenitiesPage.confirmDelete"))) return;
    const { error } = await supabase.from("amenities").delete().eq("id", id);
    if (error) toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
    else load();
  };

  const toggleActive = async (r: Row) => {
    await supabase.from("amenities").update({ is_active: !r.is_active }).eq("id", r.id);
    load();
  };

  const move = async (r: Row, dir: -1 | 1) => {
    const idx = rows.findIndex((x) => x.id === r.id);
    const swap = rows[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("amenities").update({ sort_order: swap.sort_order }).eq("id", r.id),
      supabase.from("amenities").update({ sort_order: r.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="eyebrow">{t("admin.amenitiesPage.eyebrow")}</p>
            <h1 className="font-serif text-4xl mt-1">{t("admin.amenitiesPage.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("admin.amenitiesPage.subtitle")}</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t("admin.amenitiesPage.add")}
          </Button>
        </header>

        <p className="text-xs text-muted-foreground">{t("admin.bilingualHint")}</p>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : rows.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">{t("admin.amenitiesPage.empty")}</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {rows.map((r, idx) => {
              const Icon = resolveSectionIcon(r.icon_key);
              return (
                <Card key={r.id}>
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{r.label_ro}</p>
                        <Badge variant={r.is_active ? "default" : "secondary"}>
                          {r.is_active ? t("common.active") : t("common.hidden")}
                        </Badge>
                        <Badge variant={r.label_en?.trim() ? "default" : "secondary"}>EN {r.label_en?.trim() ? "✓" : "•"}</Badge>
                        {r.show_on_homepage && <Badge variant="outline">{t("admin.amenitiesPage.onHomepage")}</Badge>}
                        {r.show_on_room_pages && <Badge variant="outline">{t("admin.amenitiesPage.onRooms")}</Badge>}
                      </div>
                      {r.description_ro && <p className="text-sm text-muted-foreground line-clamp-2">{r.description_ro}</p>}
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
              );
            })}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editing && "id" in editing && editing.id ? t("admin.amenitiesPage.editTitle") : t("admin.amenitiesPage.addTitle")}
              </DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t("admin.amenitiesPage.icon")}</Label>
                    <Select value={editing.icon_key} onValueChange={(v) => setEditing({ ...editing, icon_key: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ICON_KEYS.map((k) => (
                          <SelectItem key={k} value={k}>{k}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.amenitiesPage.sortOrder")}</Label>
                    <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.amenitiesPage.labelRo")}</Label>
                    <Input value={editing.label_ro} onChange={(e) => setEditing({ ...editing, label_ro: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("admin.amenitiesPage.labelEn")}</Label>
                    <Input value={editing.label_en ?? ""} onChange={(e) => setEditing({ ...editing, label_en: e.target.value })} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>{t("admin.amenitiesPage.descRo")}</Label>
                    <Textarea rows={2} value={editing.description_ro ?? ""} onChange={(e) => setEditing({ ...editing, description_ro: e.target.value })} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>{t("admin.amenitiesPage.descEn")}</Label>
                    <Textarea rows={2} value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                    {t("common.active")}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={editing.show_on_homepage} onCheckedChange={(v) => setEditing({ ...editing, show_on_homepage: v })} />
                    {t("admin.amenitiesPage.onHomepage")}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={editing.show_on_room_pages} onCheckedChange={(v) => setEditing({ ...editing, show_on_room_pages: v })} />
                    {t("admin.amenitiesPage.onRooms")}
                  </label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
              <Button onClick={save} disabled={saving}>{saving ? t("common.saving") : t("common.save", { defaultValue: "Save" })}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAmenities;
