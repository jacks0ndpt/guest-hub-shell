import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ServiceItemRow = {
  id?: string;
  title: string;
  description: string | null;
  category_id: string | null;
  price_estimate: number | null;
  is_paid_extra: boolean;
  requires_staff_confirmation: boolean;
  is_active: boolean;
  sort_order: number | null;
  title_ro?: string | null;
  title_en?: string | null;
  description_ro?: string | null;
  description_en?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: ServiceItemRow | null;
  categories: { id: string; name: string }[];
  onSaved: () => void;
};

const empty: ServiceItemRow = {
  title: "",
  description: "",
  category_id: null,
  price_estimate: 0,
  is_paid_extra: false,
  requires_staff_confirmation: false,
  is_active: true,
  sort_order: 0,
  title_ro: "",
  title_en: "",
  description_ro: "",
  description_en: "",
};

const ServiceItemDialog = ({ open, onOpenChange, initial, categories, onSaved }: Props) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ServiceItemRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const f = initial ? { ...initial } : empty;
    if (!f.title_ro) f.title_ro = f.title ?? "";
    if (!f.description_ro) f.description_ro = f.description ?? "";
    setForm(f);
  }, [initial, open]);

  const set = <K extends keyof ServiceItemRow>(k: K, v: ServiceItemRow[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const titleRo = (form.title_ro ?? "").trim();
    const titleEn = (form.title_en ?? "").trim();
    const payload: any = {
      title: titleRo || titleEn || form.title,
      description: (form.description_ro ?? "") || form.description || null,
      category_id: form.category_id,
      price_estimate: form.price_estimate ?? 0,
      is_paid_extra: form.is_paid_extra,
      requires_staff_confirmation: form.requires_staff_confirmation,
      is_active: form.is_active,
      sort_order: form.sort_order ?? 0,
      title_ro: titleRo || null,
      title_en: titleEn || null,
      description_ro: form.description_ro || null,
      description_en: form.description_en || null,
    };
    const { error } = form.id
      ? await supabase.from("service_items").update(payload).eq("id", form.id)
      : await supabase.from("service_items").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: form.id ? t("admin.serviceDialog.updated") : t("admin.serviceDialog.created") });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {form.id ? t("admin.serviceDialog.edit") : t("admin.serviceDialog.new")}
          </DialogTitle>
          <DialogDescription>{t("admin.serviceDialog.desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Tabs defaultValue="ro">
            <TabsList>
              <TabsTrigger value="ro">Română</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TabsContent value="ro" className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label>{t("admin.serviceDialog.title")} (RO)</Label>
                <Input value={form.title_ro ?? ""} onChange={(e) => set("title_ro", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.serviceDialog.description")} (RO)</Label>
                <Textarea rows={2} value={form.description_ro ?? ""} onChange={(e) => set("description_ro", e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="en" className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label>{t("admin.serviceDialog.title")} (EN)</Label>
                <Input value={form.title_en ?? ""} onChange={(e) => set("title_en", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.serviceDialog.description")} (EN)</Label>
                <Textarea rows={2} value={form.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)} />
              </div>
            </TabsContent>
          </Tabs>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("admin.serviceDialog.category")}</Label>
              <Select
                value={form.category_id ?? "none"}
                onValueChange={(v) => set("category_id", v === "none" ? null : v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("common.none")}</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{t("admin.serviceDialog.priceEstimate")}</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price_estimate ?? 0}
                onChange={(e) => set("price_estimate", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">{t("common.sortOrder")}</Label>
              <Input
                id="sort"
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-md border border-border p-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="paid">{t("admin.serviceDialog.paidExtra")}</Label>
              <Switch id="paid" checked={form.is_paid_extra} onCheckedChange={(v) => set("is_paid_extra", v)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="staff">{t("admin.serviceDialog.staffConfirmation")}</Label>
              <Switch
                id="staff"
                checked={form.requires_staff_confirmation}
                onCheckedChange={(v) => set("requires_staff_confirmation", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">{t("common.active")}</Label>
              <Switch id="active" checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? t("common.saving") : t("common.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceItemDialog;
