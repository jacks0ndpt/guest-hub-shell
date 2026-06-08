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
};

const ServiceItemDialog = ({ open, onOpenChange, initial, categories, onSaved }: Props) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ServiceItemRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ? { ...initial } : empty);
  }, [initial, open]);

  const set = <K extends keyof ServiceItemRow>(k: K, v: ServiceItemRow[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      category_id: form.category_id,
      price_estimate: form.price_estimate ?? 0,
      is_paid_extra: form.is_paid_extra,
      requires_staff_confirmation: form.requires_staff_confirmation,
      is_active: form.is_active,
      sort_order: form.sort_order ?? 0,
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
          <div className="space-y-2">
            <Label htmlFor="title">{t("admin.serviceDialog.title")}</Label>
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">{t("admin.serviceDialog.description")}</Label>
            <Textarea
              id="desc"
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
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
