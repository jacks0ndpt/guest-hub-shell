import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestActions from "@/components/admin/RequestActions";

type RequestRow = {
  id: string;
  created_at: string;
  status: string;
  request_type: string | null;
  guest_name: string | null;
  guest_contact: string | null;
  guest_note: string | null;
  staff_note: string | null;
  estimated_value: number | null;
  service_item_id: string | null;
  room_code_id: string | null;
};

type ItemMeta = { title: string; category_id: string | null; is_paid_extra: boolean };

const STATUS_COLORS: Record<string, string> = {
  new: "bg-accent/15 text-accent",
  in_progress: "bg-primary/15 text-primary",
  accepted: "bg-primary/15 text-primary",
  done: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In progress",
  accepted: "Accepted",
  done: "Done",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const AdminRequests = () => {
  usePageMeta("Guest requests — Admin", "Review and manage guest requests.");
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [items, setItems] = useState<Record<string, ItemMeta>>({});
  const [rooms, setRooms] = useState<Record<string, string>>({});
  const [cats, setCats] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [paidOnly, setPaidOnly] = useState(false);
  const [datePreset, setDatePreset] = useState<string>("all");
  const [sort, setSort] = useState<"new" | "old">("new");

  const load = async () => {
    setLoading(true);
    const [reqRes, itemRes, roomRes, catRes] = await Promise.all([
      supabase.from("guest_requests").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("service_items").select("id, title, category_id, is_paid_extra"),
      supabase.from("room_codes").select("id, room_label"),
      supabase.from("service_categories").select("id, name"),
    ]);
    if (reqRes.data) setRows(reqRes.data as RequestRow[]);
    if (itemRes.data) {
      setItems(
        Object.fromEntries(
          (itemRes.data as { id: string; title: string; category_id: string | null; is_paid_extra: boolean }[]).map(
            (i) => [i.id, { title: i.title, category_id: i.category_id, is_paid_extra: i.is_paid_extra }],
          ),
        ),
      );
    }
    if (roomRes.data) setRooms(Object.fromEntries(roomRes.data.map((r: { id: string; room_label: string }) => [r.id, r.room_label])));
    if (catRes.data) setCats(Object.fromEntries(catRes.data.map((c: { id: string; name: string }) => [c.id, c.name])));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let r = [...rows];
    if (statusFilter !== "all") r = r.filter((x) => x.status === statusFilter);
    if (roomFilter !== "all") r = r.filter((x) => x.room_code_id === roomFilter);
    if (catFilter !== "all") {
      r = r.filter((x) => {
        const it = x.service_item_id ? items[x.service_item_id] : undefined;
        return it?.category_id === catFilter;
      });
    }
    if (paidOnly) {
      r = r.filter((x) => {
        const it = x.service_item_id ? items[x.service_item_id] : undefined;
        return it?.is_paid_extra;
      });
    }
    if (datePreset !== "all") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      if (datePreset === "month") start.setDate(1);
      r = r.filter((x) => new Date(x.created_at) >= start);
    }
    r.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sort === "new" ? db - da : da - db;
    });
    return r;
  }, [rows, statusFilter, roomFilter, catFilter, paidOnly, datePreset, sort, items]);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow">Requests</p>
            <h1 className="font-serif text-4xl mt-1">Guest requests</h1>
            <p className="text-muted-foreground mt-2">Live feed from in-room QR codes.</p>
          </div>
          <Button variant="outline" onClick={load}>Refresh</Button>
        </header>

        {/* Filters */}
        <div className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(STATUS_LABEL).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Room</Label>
            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(rooms).map(([id, label]) => (
                  <SelectItem key={id} value={id}>Room {label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(cats).map(([id, name]) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Select value={datePreset} onValueChange={setDatePreset}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Sort</Label>
            <Select value={sort} onValueChange={(v) => setSort(v as "new" | "old")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Newest first</SelectItem>
                <SelectItem value="old">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2 pb-1">
            <Switch id="paid" checked={paidOnly} onCheckedChange={setPaidOnly} />
            <Label htmlFor="paid" className="text-sm">Paid extras only</Label>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
            <Inbox className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <p className="font-serif text-xl mt-4">No guest requests yet</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Requests submitted through the QR GuestHub will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block rounded-lg border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
                    const it = r.service_item_id ? items[r.service_item_id] : undefined;
                    const catName = it?.category_id ? cats[it.category_id] : null;
                    return (
                      <tr key={r.id} className="align-top">
                        <td className="px-4 py-3">
                          <span className="font-medium">{r.room_code_id ? rooms[r.room_code_id] ?? "—" : "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{it?.title ?? "Service"}</p>
                          <p className="text-xs text-muted-foreground">
                            {catName ?? "—"}{it?.is_paid_extra && " · Paid"}
                          </p>
                          {r.guest_note && <p className="text-xs mt-1 max-w-xs">{r.guest_note}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {r.guest_name || "—"}
                          {r.guest_contact && <div>{r.guest_contact}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={STATUS_COLORS[r.status] ?? ""} variant="secondary">
                            {STATUS_LABEL[r.status] ?? r.status}
                          </Badge>
                          {r.staff_note && (
                            <p className="text-xs text-muted-foreground mt-1 italic max-w-xs">
                              “{r.staff_note}”
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {r.estimated_value && Number(r.estimated_value) > 0
                            ? `€${Number(r.estimated_value).toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <RequestActions
                            id={r.id}
                            status={r.status}
                            isPaid={!!it?.is_paid_extra}
                            staffNote={r.staff_note}
                            onChanged={load}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {filtered.map((r) => {
                const it = r.service_item_id ? items[r.service_item_id] : undefined;
                const catName = it?.category_id ? cats[it.category_id] : null;
                return (
                  <div key={r.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{it?.title ?? "Service"}</p>
                      <Badge className={STATUS_COLORS[r.status] ?? ""} variant="secondary">
                        {STATUS_LABEL[r.status] ?? r.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Room {r.room_code_id ? rooms[r.room_code_id] : "?"} · {catName ?? "—"}
                      {it?.is_paid_extra && " · Paid"}
                    </p>
                    {(r.guest_name || r.guest_contact) && (
                      <p className="text-xs">{r.guest_name}{r.guest_contact ? ` · ${r.guest_contact}` : ""}</p>
                    )}
                    {r.guest_note && <p className="text-sm">{r.guest_note}</p>}
                    {r.staff_note && (
                      <p className="text-xs text-muted-foreground italic">Staff: “{r.staff_note}”</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(r.created_at).toLocaleString()}</span>
                      {r.estimated_value && Number(r.estimated_value) > 0 ? (
                        <span>€{Number(r.estimated_value).toFixed(2)}</span>
                      ) : null}
                    </div>
                    <div className="pt-1">
                      <RequestActions
                        id={r.id}
                        status={r.status}
                        isPaid={!!it?.is_paid_extra}
                        staffNote={r.staff_note}
                        onChanged={load}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRequests;
