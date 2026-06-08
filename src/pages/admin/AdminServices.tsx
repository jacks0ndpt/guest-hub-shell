import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ServiceItemDialog, { ServiceItemRow } from "@/components/admin/ServiceItemDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Category = { id: string; name: string };

const AdminServices = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.servicesPage.title")} — ${t("admin.admin")}`, "");
  const [items, setItems] = useState<ServiceItemRow[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceItemRow | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: itemData }, { data: catData }] = await Promise.all([
      supabase.from("service_items").select("*").order("sort_order"),
      supabase.from("service_categories").select("id, name").order("sort_order"),
    ]);
    setItems((itemData as ServiceItemRow[]) ?? []);
    setCats((catData as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (i: ServiceItemRow, active: boolean) => {
    const { error } = await supabase.from("service_items").update({ is_active: active }).eq("id", i.id!);
    if (error) toast({ title: t("admin.servicesPage.failed"), description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("service_items").delete().eq("id", id);
    if (error) toast({ title: t("admin.servicesPage.failed"), description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.servicesPage.deleted") }); load(); }
  };

  const grouped: { cat: Category | null; items: ServiceItemRow[] }[] = [
    ...cats.map((c) => ({ cat: c, items: items.filter((i) => i.category_id === c.id) })),
    { cat: null, items: items.filter((i) => !i.category_id) },
  ].filter((g) => g.items.length > 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow">{t("admin.servicesPage.eyebrow")}</p>
            <h1 className="font-serif text-4xl mt-1">{t("admin.servicesPage.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("admin.servicesPage.subtitle")}</p>
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> {t("admin.servicesPage.newItem")}
          </Button>
        </header>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : grouped.length === 0 ? (
          <p className="text-muted-foreground">{t("admin.servicesPage.noItems")}</p>
        ) : (
          <div className="space-y-8">
            {grouped.map((g) => (
              <section key={g.cat?.id ?? "none"} className="space-y-3">
                <h2 className="font-serif text-xl">{g.cat?.name ?? t("admin.servicesPage.uncategorized")}</h2>
                <div className="rounded-lg border border-border bg-card divide-y divide-border">
                  {g.items.map((i) => (
                    <div key={i.id} className="p-4 flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-medium">{i.title}</p>
                        {i.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{i.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {i.is_paid_extra ? (
                            <Badge>{t("admin.requestsPage.paid")} · €{Number(i.price_estimate ?? 0).toFixed(2)}</Badge>
                          ) : (
                            <Badge variant="secondary">{t("admin.servicesPage.free")}</Badge>
                          )}
                          {i.requires_staff_confirmation && (
                            <Badge variant="outline">{t("admin.servicesPage.staffConfirm")}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={i.is_active}
                            onCheckedChange={(v) => toggleActive(i, v)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {i.is_active ? t("common.active") : t("common.hidden")}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => { setEditing(i); setOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" /> {t("common.edit")}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("admin.servicesPage.deleteTitle", { title: i.title })}</AlertDialogTitle>
                              <AlertDialogDescription>{t("admin.servicesPage.deleteDesc")}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(i.id!)}>{t("common.delete")}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <ServiceItemDialog
          open={open}
          onOpenChange={setOpen}
          initial={editing}
          categories={cats}
          onSaved={load}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
