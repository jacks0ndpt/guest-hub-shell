import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

type RequestRow = {
  id: string;
  created_at: string;
  status: string;
  request_type: string | null;
  service_item_id: string | null;
  room_code_id: string | null;
};

export type EnrichedRequest = RequestRow & {
  room_label: string;
  service_title: string;
};

type Ctx = {
  newCount: number;
  recent: EnrichedRequest[];
  bumpKey: number;
  refresh: () => Promise<void>;
};

const RealtimeRequestsContext = createContext<Ctx>({
  newCount: 0,
  recent: [],
  bumpKey: 0,
  refresh: async () => {},
});

const SOUND_KEY = "guesthub.notify.sound";

const playBeep = () => {
  try {
    if (localStorage.getItem(SOUND_KEY) !== "1") return;
    const AudioCtx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    o.start(now);
    o.stop(now + 0.42);
    o.onended = () => ctx.close();
  } catch {
    /* ignore */
  }
};

export const RealtimeRequestsProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [newCount, setNewCount] = useState(0);
  const [recent, setRecent] = useState<EnrichedRequest[]>([]);
  const [bumpKey, setBumpKey] = useState(0);
  const roomsRef = useRef<Record<string, string>>({});
  const itemsRef = useRef<Record<string, string>>({});
  const initialLoadDoneRef = useRef(false);

  const loadMeta = useCallback(async () => {
    const [r, i] = await Promise.all([
      supabase.from("room_codes").select("id, room_label"),
      supabase.from("service_items").select("id, title"),
    ]);
    if (r.data) roomsRef.current = Object.fromEntries(r.data.map((x: { id: string; room_label: string }) => [x.id, x.room_label]));
    if (i.data) itemsRef.current = Object.fromEntries(i.data.map((x: { id: string; title: string }) => [x.id, x.title]));
  }, []);

  const enrich = useCallback((row: RequestRow): EnrichedRequest => ({
    ...row,
    room_label: row.room_code_id ? roomsRef.current[row.room_code_id] ?? "—" : "—",
    service_title: row.service_item_id ? itemsRef.current[row.service_item_id] ?? "—" : row.request_type ?? "—",
  }), []);

  const refresh = useCallback(async () => {
    const [countRes, recentRes] = await Promise.all([
      supabase.from("guest_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("guest_requests").select("id, created_at, status, request_type, service_item_id, room_code_id").eq("status", "new").order("created_at", { ascending: false }).limit(5),
    ]);
    setNewCount(countRes.count ?? 0);
    setRecent((recentRes.data ?? []).map((r) => enrich(r as RequestRow)));
  }, [enrich]);

  useEffect(() => {
    if (!isAdmin) {
      setNewCount(0);
      setRecent([]);
      initialLoadDoneRef.current = false;
      return;
    }

    let cancelled = false;
    (async () => {
      await loadMeta();
      await refresh();
      if (!cancelled) initialLoadDoneRef.current = true;
    })();

    const channel = supabase
      .channel("admin-guest-requests")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guest_requests" }, (payload) => {
        const row = payload.new as RequestRow;
        const enriched = enrich(row);
        setBumpKey((k) => k + 1);
        refresh();
        if (initialLoadDoneRef.current) {
          toast({
            title: t("admin.realtime.newRequestTitle", { room: enriched.room_label, service: enriched.service_title }),
            description: t("admin.realtime.newRequestDescription"),
            action: (
              <button
                onClick={() => navigate("/admin/requests")}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium hover:bg-secondary"
              >
                {t("admin.realtime.viewRequest")}
              </button>
            ),
          });
          playBeep();
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "guest_requests" }, () => {
        setBumpKey((k) => k + 1);
        refresh();
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [isAdmin, loadMeta, refresh, enrich, navigate, t]);

  return (
    <RealtimeRequestsContext.Provider value={{ newCount, recent, bumpKey, refresh }}>
      {children}
    </RealtimeRequestsContext.Provider>
  );
};

export const useRealtimeRequests = () => useContext(RealtimeRequestsContext);
