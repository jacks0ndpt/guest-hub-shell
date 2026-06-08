import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import MultiImageUploader from "./MultiImageUploader";

export type RoomRow = {
  id?: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  capacity: number | null;
  bed_type: string | null;
  amenities: string[] | null;
  main_image_url: string | null;
  gallery_image_urls: string[] | null;
  is_active: boolean;
  sort_order: number | null;
};

const empty: RoomRow = {
  name: "",
  slug: "",
  short_description: "",
  long_description: "",
  capacity: 2,
  bed_type: "",
  amenities: [],
  main_image_url: "",
  gallery_image_urls: [],
  is_active: true,
  sort_order: 0,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: RoomRow | null;
  onSaved: () => void;
};

const RoomDialog = ({ open, onOpenChange, initial, onSaved }: Props) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<RoomRow>(empty);
  const [amenStr, setAmenStr] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const f = initial ? { ...initial } : empty;
    setForm(f);
    setAmenStr((f.amenities ?? []).join(", "));
    setGallery(f.gallery_image_urls ?? []);
  }, [initial, open]);

  const set = <K extends keyof RoomRow>(k: K, v: RoomRow[K]) => setForm((p) => ({ ...p, [k]: v }));

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${(form.slug || slugify(form.name) || "room")}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("room-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) {
      toast({ title: t("common.uploadFailed"), description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("room-images").getPublicUrl(path);
    set("main_image_url", data.publicUrl);
    setUploading(false);
    toast({ title: t("common.imageUploaded") });
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description || null,
      long_description: form.long_description || null,
      capacity: form.capacity ?? 2,
      bed_type: form.bed_type || null,
      amenities: amenStr.split(",").map((s) => s.trim()).filter(Boolean),
      main_image_url: form.main_image_url || null,
      gallery_image_urls: gallery,
      is_active: form.is_active,
      sort_order: form.sort_order ?? 0,
    };
    const { error } = form.id
      ? await supabase.from("rooms").update(payload).eq("id", form.id)
      : await supabase.from("rooms").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
      return;
    }

    if (!form.id) {
      const { data: existing } = await supabase
        .from("room_codes")
        .select("id")
        .eq("qr_code_slug", payload.slug)
        .maybeSingle();
      if (!existing) {
        await supabase.from("room_codes").insert({
          qr_code_slug: payload.slug,
          room_label: payload.name,
          is_active: true,
        });
      }
    }

    toast({
      title: form.id ? t("admin.roomDialog.updated") : t("admin.roomDialog.created"),
      description: form.id ? undefined : t("admin.roomDialog.qrCreated"),
    });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {form.id ? t("admin.roomDialog.edit") : t("admin.roomDialog.new")}
          </DialogTitle>
          <DialogDescription>{t("admin.roomDialog.desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.roomDialog.name")}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!form.id && !form.slug) set("slug", slugify(e.target.value));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">{t("admin.roomDialog.slug")}</Label>
              <Input id="slug" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="short">{t("admin.roomDialog.shortDescription")}</Label>
            <Input id="short" value={form.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long">{t("admin.roomDialog.longDescription")}</Label>
            <Textarea id="long" rows={3} value={form.long_description ?? ""} onChange={(e) => set("long_description", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cap">{t("admin.roomDialog.capacity")}</Label>
              <Input id="cap" type="number" min={1} value={form.capacity ?? 2} onChange={(e) => set("capacity", Number(e.target.value))} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="bed">{t("admin.roomDialog.bedType")}</Label>
              <Input id="bed" value={form.bed_type ?? ""} onChange={(e) => set("bed_type", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amen">{t("admin.roomDialog.amenities")}</Label>
            <Input id="amen" value={amenStr} onChange={(e) => setAmenStr(e.target.value)} placeholder="WiFi, AC, TV" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="img">{t("admin.roomDialog.mainImage")}</Label>
            {form.main_image_url && (
              <img
                src={form.main_image_url}
                alt=""
                className="w-full max-h-48 object-cover rounded-md border border-border"
              />
            )}
            <div className="flex gap-2">
              <Input
                id="img"
                value={form.main_image_url ?? ""}
                onChange={(e) => set("main_image_url", e.target.value)}
                placeholder={t("admin.roomDialog.pastePlaceholder")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {t("common.upload")}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("admin.roomDialog.galleryImages")}</Label>
            <MultiImageUploader
              bucket="room-images"
              pathPrefix={`gallery/${form.slug || slugify(form.name) || "room"}`}
              values={gallery}
              onChange={setGallery}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="sort">{t("common.sortOrder")}</Label>
              <Input id="sort" type="number" value={form.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-2.5">
              <Label htmlFor="active">{t("common.active")}</Label>
              <Switch id="active" checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? t("common.saving") : t("admin.roomDialog.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;
