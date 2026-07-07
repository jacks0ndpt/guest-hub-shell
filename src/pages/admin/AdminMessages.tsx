import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useRealtimeRequests } from "@/context/RealtimeRequestsContext";
import { Mail, Trash2, Inbox, Star, MessageSquare, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactMsg = {
  kind: "contact";
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  reply_text: string | null;
  replied_at: string | null;
  created_at: string;
};

type FeedbackMsg = {
  kind: "feedback";
  id: string;
  room_code_id: string | null;
  room_label: string;
  rating: number | null;
  comment: string | null;
  guest_contact: string | null;
  status: string;
  created_at: string;
};

type InboxMsg = ContactMsg | FeedbackMsg;

const statusColor: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  read: "bg-muted text-foreground",
  replied: "bg-emerald-500/15 text-emerald-700",
  archived: "bg-muted text-muted-foreground",
};

type FilterKey = "all" | "contact" | "feedback" | "new" | "archived";

const AdminMessages = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.messagesPage.title")} — ${t("admin.admin")}`, "");
  const { refreshMessages } = useRealtimeRequests();
  const [msgs, setMsgs] = useState<InboxMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<InboxMsg | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  const load = async () => {
    setLoading(true);
    const [cRes, fRes, roomsRes] = await Promise.all([
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("private_feedback").select("*").order("created_at", { ascending: false }),
      supabase.from("room_codes").select("id, room_label"),
    ]);
    const roomMap: Record<string, string> = Object.fromEntries(
      (roomsRes.data ?? []).map((r: { id: string; room_label: string }) => [r.id, r.room_label])
    );
    const contact: ContactMsg[] = (cRes.data ?? []).map((m) => ({ kind: "contact", ...(m as Omit<ContactMsg, "kind">) }));
    const feedback: FeedbackMsg[] = (fRes.data ?? []).map((f: {
      id: string; room_code_id: string | null; rating: number | null; comment: string | null;
      guest_contact: string | null; status: string; created_at: string;
    }) => ({
      kind: "feedback",
      id: f.id,
      room_code_id: f.room_code_id,
      room_label: f.room_code_id ? roomMap[f.room_code_id] ?? "—" : "—",
      rating: f.rating,
      comment: f.comment,
      guest_contact: f.guest_contact,
      status: f.status,
      created_at: f.created_at,
    }));
    const all = [...contact, ...feedback].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    setMsgs(all);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return msgs.filter((m) => {
      if (filter === "archived") return m.status === "archived";
      if (m.status === "archived") return false;
      if (filter === "contact") return m.kind === "contact";
      if (filter === "feedback") return m.kind === "feedback";
      if (filter === "new") return m.status === "new";
      return true;
    });
  }, [msgs, filter]);

  const counts = useMemo(() => {
    const nonArchived = msgs.filter((m) => m.status !== "archived");
    return {
      all: nonArchived.length,
      contact: nonArchived.filter((m) => m.kind === "contact").length,
      feedback: nonArchived.filter((m) => m.kind === "feedback").length,
      new: nonArchived.filter((m) => m.status === "new").length,
      archived: msgs.filter((m) => m.status === "archived").length,
    };
  }, [msgs]);

  const table = (m: InboxMsg) => (m.kind === "contact" ? "contact_messages" : "private_feedback");

  const open = async (m: InboxMsg) => {
    setActive(m);
    setReply(m.kind === "contact" ? m.reply_text ?? "" : "");
    if (m.status === "new") {
      await supabase.from(table(m)).update({ status: "read" }).eq("id", m.id);
      load();
      refreshMessages();
    }
  };

  const send = async () => {
    if (!active || active.kind !== "contact") return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-contact-reply", {
      body: { message_id: active.id, reply },
    });
    setSending(false);
    if (error) {
      toast({ title: t("admin.messagesPage.replyFailed"), description: error.message, variant: "destructive" });
      return;
    }
    if (data?.warning) {
      toast({ title: t("admin.messagesPage.savedNoEmail"), description: data.warning });
    } else {
      toast({ title: t("admin.messagesPage.replySent"), description: t("admin.messagesPage.deliveredTo", { email: active.email }) });
    }
    setActive(null);
    setReply("");
    load();
    refreshMessages();
  };

  const archive = async (m: InboxMsg) => {
    await supabase.from(table(m)).update({ status: "archived" }).eq("id", m.id);
    load();
    refreshMessages();
  };

  const remove = async (m: InboxMsg) => {
    await supabase.from(table(m)).delete().eq("id", m.id);
    setActive(null);
    load();
    refreshMessages();
  };

  const statusLabel = (s: string) => t(`admin.messagesPage.status${s.charAt(0).toUpperCase()}${s.slice(1)}`, { defaultValue: s });

  const tabs: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: t("admin.messagesPage.tabAll"), count: counts.all },
    { key: "new", label: t("admin.messagesPage.tabNew"), count: counts.new },
    { key: "contact", label: t("admin.messagesPage.tabContact"), count: counts.contact },
    { key: "feedback", label: t("admin.messagesPage.tabFeedback"), count: counts.feedback },
    { key: "archived", label: t("admin.messagesPage.tabArchived"), count: counts.archived },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header>
          <p className="eyebrow">{t("admin.messagesPage.eyebrow")}</p>
          <h1 className="font-serif text-4xl mt-1">{t("admin.messagesPage.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("admin.messagesPage.unifiedSubtitle")}</p>
        </header>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                filter === tab.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/40"
              )}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              <Inbox className="h-8 w-8 mx-auto mb-3 opacity-60" />
              {t("admin.messagesPage.noMessages")}
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
            <div className="space-y-2">
              {filtered.map((m) => {
                const isFeedback = m.kind === "feedback";
                const attention = isFeedback && m.rating != null && m.rating <= 3;
                return (
                  <button
                    key={`${m.kind}-${m.id}`}
                    onClick={() => open(m)}
                    className={cn(
                      "w-full text-left p-4 rounded-md border transition-colors",
                      active?.id === m.id && active?.kind === m.kind
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {isFeedback ? (
                            <><MessageSquare className="h-3 w-3 mr-1" />{t("admin.messagesPage.sourceFeedback")}</>
                          ) : (
                            <><Mail className="h-3 w-3 mr-1" />{t("admin.messagesPage.sourceContact")}</>
                          )}
                        </Badge>
                        {attention && (
                          <Badge className="bg-destructive/15 text-destructive text-[10px]">
                            <AlertTriangle className="h-3 w-3 mr-1" />{t("admin.messagesPage.needsAttention")}
                          </Badge>
                        )}
                      </div>
                      <Badge className={statusColor[m.status] ?? ""}>{statusLabel(m.status)}</Badge>
                    </div>
                    {m.kind === "contact" ? (
                      <>
                        <p className="font-medium truncate mt-2">{m.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                        <p className="text-sm mt-1 truncate">{m.subject || t("admin.messagesPage.noSubject")}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium truncate mt-2">
                          {t("admin.qrPage.room")} {m.room_label}
                        </p>
                        {m.rating != null && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" /> {m.rating}/5
                          </p>
                        )}
                        <p className="text-sm mt-1 truncate">{m.comment || t("admin.messagesPage.noComment")}</p>
                      </>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</p>
                  </button>
                );
              })}
            </div>

            <Card>
              <CardContent className="p-6">
                {!active ? (
                  <p className="text-muted-foreground">{t("admin.messagesPage.selectMessage")}</p>
                ) : active.kind === "contact" ? (
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline"><Mail className="h-3 w-3 mr-1" />{t("admin.messagesPage.sourceContact")}</Badge>
                      <p className="font-serif text-2xl mt-2">{active.subject || t("admin.messagesPage.noSubject")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("admin.messagesPage.from")} {active.name} · {active.email} ·{" "}
                        {new Date(active.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/40 p-4 whitespace-pre-wrap text-sm">
                      {active.message}
                    </div>
                    <div className="space-y-2">
                      <p className="eyebrow">{t("admin.messagesPage.yourReply")}</p>
                      <Textarea
                        rows={6}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder={t("admin.messagesPage.replyPlaceholder")}
                      />
                    </div>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Button variant="ghost" onClick={() => remove(active)}>
                        <Trash2 className="h-4 w-4" /> {t("common.delete")}
                      </Button>
                      <Button variant="outline" onClick={() => archive(active)}>
                        {t("admin.messagesPage.archive")}
                      </Button>
                      <Button onClick={send} disabled={sending || reply.trim().length < 1}>
                        <Mail className="h-4 w-4" /> {sending ? t("admin.messagesPage.sending") : t("admin.messagesPage.sendReply")}
                      </Button>
                    </div>
                    {active.replied_at && (
                      <p className="text-xs text-muted-foreground">
                        {t("admin.messagesPage.lastReplied")} {new Date(active.replied_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline"><MessageSquare className="h-3 w-3 mr-1" />{t("admin.messagesPage.sourceFeedback")}</Badge>
                      <p className="font-serif text-2xl mt-2">
                        {t("admin.qrPage.room")} {active.room_label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(active.created_at).toLocaleString()}
                        {active.guest_contact ? ` · ${active.guest_contact}` : ""}
                      </p>
                    </div>
                    {active.rating != null && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={cn("h-5 w-5", n <= (active.rating ?? 0) ? "fill-accent text-accent" : "text-muted-foreground")}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">{active.rating}/5</span>
                        {active.rating <= 3 && (
                          <Badge className="ml-2 bg-destructive/15 text-destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />{t("admin.messagesPage.needsAttention")}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="rounded-md border border-border bg-secondary/40 p-4 whitespace-pre-wrap text-sm">
                      {active.comment || t("admin.messagesPage.noComment")}
                    </div>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Button variant="ghost" onClick={() => remove(active)}>
                        <Trash2 className="h-4 w-4" /> {t("common.delete")}
                      </Button>
                      <Button variant="outline" onClick={() => archive(active)}>
                        {t("admin.messagesPage.archive")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
