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
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  DEFAULT_CONTENT,
  SECTION_FIELDS,
  type SiteContentMap,
  type SiteContentValue,
  type SectionItem,
  type SectionFieldSpec,
} from "@/hooks/useSiteContent";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import SectionItemsEditor from "@/components/admin/SectionItemsEditor";
import { Trash2 } from "lucide-react";

type GalleryRow = {
  id: string;
  image_url: string;
  alt: string | null;
  category: string;
  sort_order: number | null;
  is_active: boolean;
  alt_ro?: string | null;
  alt_en?: string | null;
};

const isTextField = (
  f: SectionFieldSpec,
): f is Extract<SectionFieldSpec, { kind?: "text" }> => f.kind !== "items";

const asString = (v: SiteContentValue | undefined): string =>
  typeof v === "string" ? v : "";

const AdminContent = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.contentPage.title")} — ${t("admin.admin")}`, "");
  const [content, setContent] = useState<SiteContentMap>(DEFAULT_CONTENT);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [heroUrl, setHeroUrl] = useState("");
  const [propId, setPropId] = useState<string | null>(null);
  const [heroSaving, setHeroSaving] = useState(false);

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
      for (const row of contentRows as { section_key: string; content: Record<string, SiteContentValue> }[]) {
        map[row.section_key] = { ...(DEFAULT_CONTENT[row.section_key] ?? {}), ...(row.content ?? {}) };
      }
      setContent(map);
    }
    if (prop) {
      setPropId(prop.id as string);
      setHeroUrl((prop as { hero_image_url?: string }).hero_image_url ?? "");
    }
    setGallery((galRows as GalleryRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const setField = (section: string, key: string, value: SiteContentValue) =>
    setContent((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));

  const sectionName = (s: string) => t(`admin.contentPage.sections.${s}`, { defaultValue: s });
  const sectionDesc = (s: string) => t(`admin.contentPage.sections.${s}Desc`, { defaultValue: "" });

  const saveSection = async (section: string) => {
    setSavingKey(section);
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: section, content: content[section] as unknown as never },
        { onConflict: "section_key" },
      );
    setSavingKey(null);
    if (error) toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
    else
      toast({
        title: t("admin.contentPage.sectionSaved", { name: sectionName(section) }),
        description: t("admin.contentPage.sectionSavedDesc"),
      });
  };

  const saveHero = async () => {
    if (!propId) return;
    setHeroSaving(true);
    const { error } = await supabase
      .from("property_settings")
      .update({ hero_image_url: heroUrl || null })
      .eq("id", propId);
    setHeroSaving(false);
    if (error) toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
    else toast({ title: t("admin.contentPage.heroSaved") });
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
    if (error) toast({ title: t("common.saveFailed"), description: error.message, variant: "destructive" });
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

  // RO/EN completion only considers bilingual scalar text fields.
  const isComplete = (sec: Record<string, SiteContentValue>, fields: SectionFieldSpec[], lng: "ro" | "en") =>
    fields
      .filter(isTextField)
      .filter((f) => !f.nonLocalized)
      .every((f) => asString(sec[`${f.key}_${lng}`]).trim().length > 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header>
          <p className="eyebrow">{t("admin.contentPage.eyebrow")}</p>
          <h1 className="font-serif text-4xl mt-1">{t("admin.contentPage.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("admin.contentPage.subtitle")}</p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <Tabs defaultValue="sections">
            <TabsList>
              <TabsTrigger value="sections">{t("admin.contentPage.textSections")}</TabsTrigger>
              <TabsTrigger value="hero">{t("admin.contentPage.heroImage")}</TabsTrigger>
              <TabsTrigger value="gallery">{t("admin.contentPage.gallery")}</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="space-y-5 mt-5">
              <p className="text-xs text-muted-foreground">
                {t("admin.bilingualHint", {
                  defaultValue: "Content is not translated automatically. Add Romanian and English copy manually.",
                })}
              </p>
              {Object.entries(SECTION_FIELDS).map(([section, fields]) => {
                const sec = (content[section] ?? {}) as Record<string, SiteContentValue>;
                const roComplete = isComplete(sec, fields, "ro");
                const enComplete = isComplete(sec, fields, "en");
                const textFields = fields.filter(isTextField);
                const itemFields = fields.filter(
                  (f): f is Extract<SectionFieldSpec, { kind: "items" }> => f.kind === "items",
                );
                const nonLocalizedTextFields = textFields.filter((f) => f.nonLocalized);
                const bilingualTextFields = textFields.filter((f) => !f.nonLocalized);

                return (
                  <Card key={section}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h2 className="font-serif text-2xl">{sectionName(section)}</h2>
                          <p className="text-sm text-muted-foreground">{sectionDesc(section)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={roComplete ? "default" : "secondary"}>RO {roComplete ? "✓" : "•"}</Badge>
                          <Badge variant={enComplete ? "default" : "secondary"}>EN {enComplete ? "✓" : "•"}</Badge>
                        </div>
                      </div>

                      {nonLocalizedTextFields.length > 0 && (
                        <div className="grid gap-3 md:grid-cols-2">
                          {nonLocalizedTextFields.map((f) => (
                            <div key={f.key} className="space-y-1.5 md:col-span-2">
                              <Label>{f.label}</Label>
                              {f.multiline ? (
                                <Textarea
                                  rows={3}
                                  value={asString(sec[f.key])}
                                  onChange={(e) => setField(section, f.key, e.target.value)}
                                />
                              ) : (
                                <Input
                                  value={asString(sec[f.key])}
                                  onChange={(e) => setField(section, f.key, e.target.value)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {bilingualTextFields.length > 0 && (
                        <Tabs defaultValue="ro">
                          <TabsList>
                            <TabsTrigger value="ro">Română</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                          </TabsList>
                          {(["ro", "en"] as const).map((lng) => (
                            <TabsContent key={lng} value={lng} className="mt-4">
                              <div className="grid gap-3">
                                {bilingualTextFields.map((f) => {
                                  const fullKey = `${f.key}_${lng}`;
                                  return (
                                    <div key={fullKey} className="space-y-1.5">
                                      <Label>
                                        {f.label} ({lng.toUpperCase()})
                                      </Label>
                                      {f.multiline ? (
                                        <Textarea
                                          rows={3}
                                          value={asString(sec[fullKey])}
                                          onChange={(e) => setField(section, fullKey, e.target.value)}
                                        />
                                      ) : (
                                        <Input
                                          value={asString(sec[fullKey])}
                                          onChange={(e) => setField(section, fullKey, e.target.value)}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      )}

                      {itemFields.map((f) => (
                        <div key={f.key} className="space-y-2 pt-2 border-t">
                          <Label className="text-base">{f.label}</Label>
                          <SectionItemsEditor
                            itemLabel={f.itemLabel}
                            itemFields={f.itemFields}
                            value={Array.isArray(sec[f.key]) ? (sec[f.key] as SectionItem[]) : []}
                            onChange={(next) => setField(section, f.key, next)}
                          />
                        </div>
                      ))}

                      <div className="flex justify-end">
                        <Button onClick={() => saveSection(section)} disabled={savingKey === section}>
                          {savingKey === section ? t("common.saving") : t("admin.contentPage.saveSection")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="hero" className="mt-5">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl">{t("admin.contentPage.heroImage")}</h2>
                    <p className="text-sm text-muted-foreground">{t("admin.contentPage.heroDesc")}</p>
                  </div>
                  <ImageUploader
                    bucket="site-images"
                    pathPrefix="hero/hero"
                    value={heroUrl}
                    onChange={setHeroUrl}
                    label={t("admin.contentPage.heroLabel")}
                  />
                  <div className="flex justify-end">
                    <Button onClick={saveHero} disabled={heroSaving}>
                      {heroSaving ? t("common.saving") : t("admin.contentPage.saveHero")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-5 space-y-5">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl">{t("admin.contentPage.gallery")}</h2>
                    <p className="text-sm text-muted-foreground">{t("admin.contentPage.galleryDesc")}</p>
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
                <p className="text-muted-foreground">{t("admin.contentPage.noGallery")}</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((g) => (
                    <Card key={g.id} className="overflow-hidden">
                      <img src={g.image_url} alt={g.alt ?? ""} className="aspect-[4/3] w-full object-cover" />
                      <CardContent className="p-3 space-y-2">
                        <Input
                          placeholder={`${t("admin.contentPage.altText")} (RO)`}
                          defaultValue={g.alt_ro ?? g.alt ?? ""}
                          onBlur={(e) =>
                            updateGallery(g.id, { alt_ro: e.target.value, alt: e.target.value } as Partial<GalleryRow>)
                          }
                        />
                        <Input
                          placeholder={`${t("admin.contentPage.altText")} (EN)`}
                          defaultValue={g.alt_en ?? ""}
                          onBlur={(e) => updateGallery(g.id, { alt_en: e.target.value } as Partial<GalleryRow>)}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <select
                            className="h-9 text-sm rounded-md border border-input bg-background px-2"
                            defaultValue={g.category}
                            onChange={(e) => updateGallery(g.id, { category: e.target.value })}
                          >
                            <option value="rooms">{t("admin.contentPage.categories.rooms")}</option>
                            <option value="lobby">{t("admin.contentPage.categories.lobby")}</option>
                            <option value="breakfast">{t("admin.contentPage.categories.breakfast")}</option>
                            <option value="exterior">{t("admin.contentPage.categories.exterior")}</option>
                            <option value="surroundings">{t("admin.contentPage.categories.surroundings")}</option>
                          </select>
                          <Badge variant={g.is_active ? "default" : "secondary"}>
                            {g.is_active ? t("common.active") : t("common.hidden")}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeGallery(g.id)}
                            aria-label={t("common.delete")}
                          >
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
