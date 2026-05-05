import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_CONTENT, SECTION_FIELDS, type SiteContentMap } from "@/hooks/useSiteContent";

const SECTION_LABELS: Record<string, { name: string; description: string }> = {
  hero: { name: "Hero", description: "Headline and CTAs on the homepage." },
  about: { name: "About", description: "Short story about the property." },
  amenities: { name: "Amenities", description: "Heading for the amenities grid." },
  location: { name: "Location", description: "Location preview on the homepage." },
  contact: { name: "Contact", description: "Heading and intro on the contact section." },
  footer: { name: "Footer", description: "Tagline shown in the footer." },
};

const AdminContent = () => {
  usePageMeta("Content — Admin", "Edit your website content sections.");
  const [content, setContent] = useState<SiteContentMap>(DEFAULT_CONTENT);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("section_key, content");
      if (data) {
        const map: SiteContentMap = { ...DEFAULT_CONTENT };
        for (const row of data as { section_key: string; content: Record<string, string> }[]) {
          map[row.section_key] = { ...(DEFAULT_CONTENT[row.section_key] ?? {}), ...(row.content ?? {}) };
        }
        setContent(map);
      }
      setLoading(false);
    })();
  }, []);

  const setField = (section: string, key: string, value: string) =>
    setContent((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));

  const save = async (section: string) => {
    setSavingKey(section);
    const { error } = await supabase
      .from("site_content")
      .upsert({ section_key: section, content: content[section] }, { onConflict: "section_key" });
    setSavingKey(null);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: `${SECTION_LABELS[section]?.name ?? section} saved`, description: "Changes are live on the website." });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <header>
          <p className="eyebrow">Content</p>
          <h1 className="font-serif text-4xl mt-1">Website content</h1>
          <p className="text-muted-foreground mt-2">
            Edit the copy that appears on the public website. Changes save immediately.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-5">
            {Object.entries(SECTION_FIELDS).map(([section, fields]) => (
              <Card key={section}>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl">{SECTION_LABELS[section]?.name ?? section}</h2>
                    <p className="text-sm text-muted-foreground">
                      {SECTION_LABELS[section]?.description}
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {fields.map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <Label>{f.label}</Label>
                        {f.multiline ? (
                          <Textarea
                            rows={3}
                            value={content[section]?.[f.key] ?? ""}
                            onChange={(e) => setField(section, f.key, e.target.value)}
                          />
                        ) : (
                          <Input
                            value={content[section]?.[f.key] ?? ""}
                            onChange={(e) => setField(section, f.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => save(section)} disabled={savingKey === section}>
                      {savingKey === section ? "Saving…" : "Save section"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
