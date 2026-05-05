import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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
  const [form, setForm] = useState<RoomRow>(empty);
  const [amenStr, setAmenStr] = useState("");
  const [galleryStr, setGalleryStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const f = initial ? { ...initial } : empty;
    setForm(f);
    setAmenStr((f.amenities ?? []).join(", "));
    setGalleryStr((f.gallery_image_urls ?? []).join("\n"));
  }, [initial, open]);

  const set = <K extends keyof RoomRow>(k: K, v: RoomRow[K]) => setForm((p) => ({ ...p, [k]: v }));

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
      gallery_image_urls: galleryStr.split("\n").map((s) => s.trim()).filter(Boolean),
      is_active: form.is_active,
      sort_order: form.sort_order ?? 0,
    };
    const { error } = form.id
      ? await supabase.from("rooms").update(payload).eq("id", form.id)
      : await supabase.from("rooms").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: form.id ? "Room updated" : "Room created" });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {form.id ? "Edit room" : "New room"}
          </DialogTitle>
          <DialogDescription>Active rooms appear on the public site.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
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
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="short">Short description</Label>
            <Input id="short" value={form.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long">Long description</Label>
            <Textarea id="long" rows={3} value={form.long_description ?? ""} onChange={(e) => set("long_description", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cap">Capacity</Label>
              <Input id="cap" type="number" min={1} value={form.capacity ?? 2} onChange={(e) => set("capacity", Number(e.target.value))} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="bed">Bed type</Label>
              <Input id="bed" value={form.bed_type ?? ""} onChange={(e) => set("bed_type", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amen">Amenities (comma separated)</Label>
            <Input id="amen" value={amenStr} onChange={(e) => setAmenStr(e.target.value)} placeholder="WiFi, AC, TV" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="img">Main image URL</Label>
            <Input id="img" value={form.main_image_url ?? ""} onChange={(e) => set("main_image_url", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gal">Gallery image URLs (one per line)</Label>
            <Textarea id="gal" rows={3} value={galleryStr} onChange={(e) => setGalleryStr(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="sort">Sort order</Label>
              <Input id="sort" type="number" value={form.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-2.5">
              <Label htmlFor="active">Active</Label>
              <Switch id="active" checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : "Save room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;
