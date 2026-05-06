import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_CONTENT, SECTION_FIELDS, type SiteContentMap } from "@/hooks/useSiteContent";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import { Trash2 } from "lucide-react";

const SECTION_LABELS: Record<string, { name: string; description: string }> = {
  hero: { name: "Hero", description: "Headline and CTAs on the homepage." },
  about: { name: "About", description: "Short story about the property." },
  amenities: { name: "Amenities", description: "Heading for the amenities grid." },
  location: { name: "Location", description: "Location preview on the homepage." },
  contact: { name: "Contact", description: "Heading and intro on the contact section." },
  footer: { name: "Footer", description: "Tagline shown in the footer." },
};

type GalleryRow = { id: string; image_url: string; alt: string | null; category: string; sort_order: number | null; is_active: boolean };

const AdminContent = () => {
  usePageMeta("Content — Admin", "Edit your website content sections, hero image, and gallery.");
  const [content, setContent] = useState<SiteContentMap>(DEFAULT_CONTENT);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hero image
  const [heroUrl, setHeroUrl] = useState("");
  const [propId, setPropId] = useState<string | null>(null);
  const [heroSaving, setHeroSaving] = useState(false);

  // Gallery
  const [gallery, setGallery] = useState<GalleryRow[]>([]);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: contentRows }, { data: prop }, { data: galRows }] = await Promise.all([
      supabase.from("site_content").select("section_key, content"),
      supabase.from("property_settings").select("id, hero_image_url").limit(1).maybeSingle(),
      supabase.from("site_gallery").select("*").order("sort_order"),
    ]);
    if (contentRows) {
      const map: SiteContentMap = { ...DEFAULT_CONTENT };
      for (const row of contentRows as { section_key: string; content: Record<string, string> }[]) {
        map[row.section_key] = { ...(DEFAULT_CONTENT[row.section_key] ?? {}), ...(row.content ?? {}) };
      }
      setContent(map);
    }
    if (prop) {
      setPropId(prop.id as string);
      setHeroUrl((prop as any).hero_image_url ?? "");
    }
    setGallery((galRows as GalleryRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const setField = (section: string, key: string, value: string) =>
    setContent((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));

  const saveSection = async (section: string) => {
    setSavingKey(section);
    const { error } = await supabase
      .from("site_content")
      .upsert({ section_key: section, content: content[section] }, { onConflict: "section_key" });
    setSavingKey(null);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: `${SECTION_LABELS[section]?.name ?? section} saved`, description: "Live on the website." });
  };

  const saveHero = async () => {
    if (!propId) return;
    setHeroSaving(true);
    const { error } = await supabase.from("property_settings").update({ hero_image_url: heroUrl || null }).eq("id", propId);
    setHeroSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Hero image saved" });
  };

  const addGalleryImages = async (urls: string[]) => {
    const newOnes = urls.filter((u) => !gallery.some((g) => g.image_url === u));
    if (newOnes.length === 0) return;
    const rows = newOnes.map((u, i) => ({
      image_url: u,
      alt: "",
      category: "rooms",
      sort_order: gallery.length + i,
      is_active: true,
    }));
    const { error } = await supabase.from("site_gallery").insert(rows);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else loadAll();
  };

  const removeGallery = async (id: string) => {
    await supabase.from("site_gallery").delete().eq("id", id);
    loadAll();
  };

  const updateGallery = async (id: string, patch: Partial<GalleryRow>) => {
    await supabase.from("site_gallery").update(patch).eq("id", id);
    loadAll();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header>
          <p className="eyebrow">Content</p>
          <h1 className="font-serif text-4xl mt-1">Website content</h1>
          <p className="text-muted-foreground mt-2">
            Edit the copy, hero image, and gallery shown on the public website.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <Tabs defaultValue="sections">
            <TabsList>
              <TabsTrigger value="sections">Text sections</TabsTrigger>
              <TabsTrigger value="hero">Hero image</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="space-y-5 mt-5">
              {Object.entries(SECTION_FIELDS).map(([section, fields]) => (
                <Card key={section}>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h2 className="font-serif text-2xl">{SECTION_LABELS[section]?.name ?? section}</h2>
                      <p className="text-sm text-muted-foreground">{SECTION_LABELS[section]?.description}</p>
                    </div>
                    <div className="grid gap-3">
                      {fields.map((f) => (
                        <div key={f.key} className="space-y-1.5">
                          <Label>{f.label}</Label>
                          {f.multiline ? (
                            <Textarea rows={3} value={content[section]?.[f.key] ?? ""} onChange={(e) => setField(section, f.key, e.target.value)} />
                          ) : (
                            <Input value={content[section]?.[f.key] ?? ""} onChange={(e) => setField(section, f.key, e.target.value)} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => saveSection(section)} disabled={savingKey === section}>
                        {savingKey === section ? "Saving…" : "Save section"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="hero" className="mt-5">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl">Hero image</h2>
                    <p className="text-sm text-muted-foreground">
                      The main background image at the top of the homepage.
                    </p>
                  </div>
                  <ImageUploader
                    bucket="site-images"
                    pathPrefix="hero/hero"
                    value={heroUrl}
                    onChange={setHeroUrl}
                    label="Homepage hero image"
                  />
                  <div className="flex justify-end">
                    <Button onClick={saveHero} disabled={heroSaving}>
                      {heroSaving ? "Saving…" : "Save hero"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-5 space-y-5">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl">Gallery</h2>
                    <p className="text-sm text-muted-foreground">
                      Upload images shown on the public Gallery page.
                    </p>
                  </div>
                  <MultiImageUploader
                    bucket="site-images"
                    pathPrefix="gallery/g"
                    values={[]}
                    onChange={addGalleryImages}
                  />
                </CardContent>
              </Card>

              {gallery.length === 0 ? (
                <p className="text-muted-foreground">No images yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((g) => (
                    <Card key={g.id} className="overflow-hidden">
                      <img src={g.image_url} alt={g.alt ?? ""} className="aspect-[4/3] w-full object-cover" />
                      <CardContent className="p-3 space-y-2">
                        <Input placeholder="Alt text" defaultValue={g.alt ?? ""} onBlur={(e) => updateGallery(g.id, { alt: e.target.value })} />
                        <div className="flex items-center justify-between gap-2">
                          <select
                            className="h-9 text-sm rounded-md border border-input bg-background px-2"
                            defaultValue={g.category}
                            onChange={(e) => updateGallery(g.id, { category: e.target.value })}
                          >
                            <option value="rooms">Rooms</option>
                            <option value="lobby">Lobby</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="exterior">Exterior</option>
                            <option value="surroundings">Surroundings</option>
                          </select>
                          <Badge variant={g.is_active ? "default" : "secondary"}>
                            {g.is_active ? "Active" : "Hidden"}
                          </Badge>
                          <Button size="icon" variant="ghost" onClick={() => removeGallery(g.id)} aria-label="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
