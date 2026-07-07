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

export type InboxItem = {
  id: string;
  kind: "contact" | "feedback";
  created_at: string;
  title: string;
  subtitle: string;
  rating?: number | null;
  room_label?: string;
};

type Ctx = {
  newCount: number;
  recent: EnrichedRequest[];
  newMessagesCount: number;
  newContactCount: number;
  newFeedbackCount: number;
  recentMessages: InboxItem[];
  bellCount: number;
  bumpKey: number;
  refresh: () => Promise<void>;
  refreshMessages: () => Promise<void>;
};

const RealtimeRequestsContext = createContext<Ctx>({
  newCount: 0,
  recent: [],
  newMessagesCount: 0,
  newContactCount: 0,
  newFeedbackCount: 0,
  recentMessages: [],
  bellCount: 0,
  bumpKey: 0,
  refresh: async () => {},
  refreshMessages: async () => {},
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
  const [newContactCount, setNewContactCount] = useState(0);
  const [newFeedbackCount, setNewFeedbackCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<InboxItem[]>([]);
  const [bumpKey, setBumpKey] = useState(0);
  const roomsRef = useRef<Record<string, string>>({});
  const itemsRef = useRef<Record<string, string>>({});
  const initialLoadDoneRef = useRef(false);
  const initialMsgsDoneRef = useRef(false);

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

  const refreshMessages = useCallback(async () => {
    const [cCount, fCount, cRecent, fRecent] = await Promise.all([
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("private_feedback").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("contact_messages").select("id, created_at, name, email, subject").eq("status", "new").order("created_at", { ascending: false }).limit(5),
      supabase.from("private_feedback").select("id, created_at, rating, comment, room_code_id").eq("status", "new").order("created_at", { ascending: false }).limit(5),
    ]);
    setNewContactCount(cCount.count ?? 0);
    setNewFeedbackCount(fCount.count ?? 0);
    const items: InboxItem[] = [
      ...(cRecent.data ?? []).map((m: { id: string; created_at: string; name: string; email: string; subject: string | null }) => ({
        id: `c-${m.id}`,
        kind: "contact" as const,
        created_at: m.created_at,
        title: t("admin.realtime.newContactShort", { name: m.name || m.email }),
        subtitle: m.subject || m.email,
      })),
      ...(fRecent.data ?? []).map((f: { id: string; created_at: string; rating: number | null; comment: string | null; room_code_id: string | null }) => ({
        id: `f-${f.id}`,
        kind: "feedback" as const,
        created_at: f.created_at,
        title: t("admin.realtime.newFeedbackShort", { room: f.room_code_id ? roomsRef.current[f.room_code_id] ?? "—" : "—" }),
        subtitle: f.rating ? `${f.rating}★ ${f.comment ?? ""}`.trim() : (f.comment ?? ""),
        rating: f.rating,
        room_label: f.room_code_id ? roomsRef.current[f.room_code_id] ?? "—" : "—",
      })),
    ]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 8);
    setRecentMessages(items);
  }, [t]);

  useEffect(() => {
    if (!isAdmin) {
      setNewCount(0);
      setRecent([]);
      setNewContactCount(0);
      setNewFeedbackCount(0);
      setRecentMessages([]);
      initialLoadDoneRef.current = false;
      initialMsgsDoneRef.current = false;
      return;
    }

    let cancelled = false;
    (async () => {
      await loadMeta();
      await Promise.all([refresh(), refreshMessages()]);
      if (!cancelled) {
        initialLoadDoneRef.current = true;
        initialMsgsDoneRef.current = true;
      }
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
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_messages" }, (payload) => {
        const row = payload.new as { id: string; name: string; email: string };
        refreshMessages();
        if (initialMsgsDoneRef.current) {
          toast({
            title: t("admin.realtime.newContactTitle"),
            description: row.name || row.email,
            action: (
              <button
                onClick={() => navigate("/admin/messages")}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium hover:bg-secondary"
              >
                {t("admin.realtime.viewMessages")}
              </button>
            ),
          });
          playBeep();
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "contact_messages" }, () => {
        refreshMessages();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "private_feedback" }, (payload) => {
        const row = payload.new as { id: string; rating: number | null; room_code_id: string | null };
        refreshMessages();
        if (initialMsgsDoneRef.current) {
          const room = row.room_code_id ? roomsRef.current[row.room_code_id] ?? "—" : "—";
          const attention = row.rating != null && row.rating <= 3;
          toast({
            title: attention
              ? t("admin.realtime.newFeedbackAttention", { room })
              : t("admin.realtime.newFeedbackTitle", { room }),
            description: row.rating ? `${row.rating}★` : undefined,
            variant: attention ? "destructive" : "default",
            action: (
              <button
                onClick={() => navigate("/admin/messages")}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium hover:bg-secondary"
              >
                {t("admin.realtime.viewMessages")}
              </button>
            ),
          });
          playBeep();
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "private_feedback" }, () => {
        refreshMessages();
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [isAdmin, loadMeta, refresh, refreshMessages, enrich, navigate, t]);

  const newMessagesCount = newContactCount + newFeedbackCount;
  const bellCount = newCount + newMessagesCount;

  return (
    <RealtimeRequestsContext.Provider
      value={{
        newCount,
        recent,
        newMessagesCount,
        newContactCount,
        newFeedbackCount,
        recentMessages,
        bellCount,
        bumpKey,
        refresh,
        refreshMessages,
      }}
    >
      {children}
    </RealtimeRequestsContext.Provider>
  );
};

export const useRealtimeRequests = () => useContext(RealtimeRequestsContext);
