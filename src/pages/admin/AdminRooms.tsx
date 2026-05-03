import { useEffect, useState } from "react";
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
  usePageMeta("Rooms — Admin", "Manage your rooms and their details.");
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
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Room deleted" }); load(); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow">Rooms</p>
            <h1 className="font-serif text-4xl mt-1">Rooms</h1>
            <p className="text-muted-foreground mt-2">
              Active rooms appear on the public website.
            </p>
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> New room
          </Button>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rooms.length === 0 ? (
          <p className="text-muted-foreground">No rooms yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((r) => (
              <Card key={r.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  {r.main_image_url ? (
                    <img src={r.main_image_url} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
                      No image
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
                    <Badge variant="secondary">{r.capacity} guests</Badge>
                    {r.bed_type && <Badge variant="secondary">{r.bed_type}</Badge>}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch checked={r.is_active} onCheckedChange={(v) => toggleActive(r, v)} />
                      <span className="text-xs text-muted-foreground">
                        {r.is_active ? "Active" : "Hidden"}
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
                            <AlertDialogTitle>Delete “{r.name}”?</AlertDialogTitle>
                            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(r.id!)}>Delete</AlertDialogAction>
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
