import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Inbox, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type RequestRow = {
  id: string;
  created_at: string;
  status: string;
  request_type: string | null;
  guest_name: string | null;
  guest_contact: string | null;
  guest_note: string | null;
  estimated_value: number | null;
  service_item_id: string | null;
  room_code_id: string | null;
};

const AdminRequests = () => {
  usePageMeta("Guest requests — Admin", "Review and manage guest requests.");
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [items, setItems] = useState<Record<string, string>>({});
  const [rooms, setRooms] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [reqRes, itemRes, roomRes] = await Promise.all([
      supabase.from("guest_requests").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("service_items").select("id, title"),
      supabase.from("room_codes").select("id, room_label"),
    ]);
    if (reqRes.data) setRows(reqRes.data as RequestRow[]);
    if (itemRes.data) setItems(Object.fromEntries(itemRes.data.map((i: any) => [i.id, i.title])));
    if (roomRes.data) setRooms(Object.fromEntries(roomRes.data.map((r: any) => [r.id, r.room_label])));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markDone = async (id: string) => {
    const { error } = await supabase
      .from("guest_requests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({ title: "Could not update", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Requests</p>
            <h1 className="font-serif text-4xl mt-1">Guest requests</h1>
            <p className="text-muted-foreground mt-2">
              Live feed from in-room QR codes.
            </p>
          </div>
          <Button variant="outline" onClick={load}>Refresh</Button>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
            <Inbox className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <p className="font-serif text-xl mt-4">No requests yet</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Try the demo at <code className="text-foreground">/r/room-101</code> and submit one.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {rows.map((r) => (
              <div key={r.id} className="p-4 flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      {r.service_item_id ? items[r.service_item_id] ?? "Service" : "Service"}
                    </span>
                    <span className="text-xs uppercase tracking-widest bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                      Room {r.room_code_id ? rooms[r.room_code_id] ?? "?" : "?"}
                    </span>
                    <span
                      className={
                        "text-xs rounded-full px-2 py-0.5 " +
                        (r.status === "completed"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent")
                      }
                    >
                      {r.status}
                    </span>
                    {r.estimated_value && Number(r.estimated_value) > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        €{Number(r.estimated_value).toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                  {(r.guest_name || r.guest_contact) && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.guest_name}
                      {r.guest_name && r.guest_contact ? " · " : ""}
                      {r.guest_contact}
                    </p>
                  )}
                  {r.guest_note && <p className="text-sm mt-1">{r.guest_note}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                {r.status !== "completed" && (
                  <Button size="sm" variant="outline" onClick={() => markDone(r.id)}>
                    <Check className="h-4 w-4" /> Mark done
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRequests;
