import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import RoomDialog, { RoomRow } from "@/components/admin/RoomDialog";
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

const AdminRooms = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.roomsPage.title")} — ${t("admin.admin")}`, "");
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RoomRow | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("rooms").select("*").order("sort_order");
    setRooms((data as RoomRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (r: RoomRow, active: boolean) => {
    const { error } = await supabase.from("rooms").update({ is_active: active }).eq("id", r.id!);
    if (error) toast({ title: t("admin.servicesPage.failed"), description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) toast({ title: t("admin.servicesPage.failed"), description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.roomsPage.deleted") }); load(); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow">{t("admin.roomsPage.eyebrow")}</p>
            <h1 className="font-serif text-4xl mt-1">{t("admin.roomsPage.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("admin.roomsPage.subtitle")}</p>
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> {t("admin.roomsPage.newRoom")}
          </Button>
        </header>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : rooms.length === 0 ? (
          <p className="text-muted-foreground">{t("admin.roomsPage.noRooms")}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((r) => (
              <Card key={r.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  {r.main_image_url ? (
                    <img src={r.main_image_url} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
                      {t("common.noImage")}
                    </div>
                  )}
                </div>
                <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-serif text-xl">{r.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.slug}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.short_description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{r.capacity} {t("admin.roomsPage.guests")}</Badge>
                    {r.bed_type && <Badge variant="secondary">{r.bed_type}</Badge>}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch checked={r.is_active} onCheckedChange={(v) => toggleActive(r, v)} />
                      <span className="text-xs text-muted-foreground">
                        {r.is_active ? t("common.active") : t("common.hidden")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("admin.roomsPage.deleteTitle", { name: r.name })}</AlertDialogTitle>
                            <AlertDialogDescription>{t("admin.roomsPage.deleteDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(r.id!)}>{t("common.delete")}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <RoomDialog open={open} onOpenChange={setOpen} initial={editing} onSaved={load} />
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
