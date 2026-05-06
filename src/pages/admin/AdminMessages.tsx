import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail, Trash2, Inbox } from "lucide-react";

type Msg = {
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

const statusColor: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  read: "bg-muted text-foreground",
  replied: "bg-emerald-500/15 text-emerald-700",
  archived: "bg-muted text-muted-foreground",
};

const AdminMessages = () => {
  usePageMeta("Messages — Admin", "Inbox of guest messages from the contact page.");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Msg | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMsgs((data as Msg[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const open = async (m: Msg) => {
    setActive(m);
    setReply(m.reply_text ?? "");
    if (m.status === "new") {
      await supabase.from("contact_messages").update({ status: "read" }).eq("id", m.id);
      load();
    }
  };

  const send = async () => {
    if (!active) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-contact-reply", {
      body: { message_id: active.id, reply },
    });
    setSending(false);
    if (error) {
      toast({ title: "Reply failed", description: error.message, variant: "destructive" });
      return;
    }
    if (data?.warning) {
      toast({ title: "Saved (no email sent)", description: data.warning });
    } else {
      toast({ title: "Reply sent", description: `Email delivered to ${active.email}.` });
    }
    setActive(null);
    setReply("");
    load();
  };

  const archive = async (id: string) => {
    await supabase.from("contact_messages").update({ status: "archived" }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setActive(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <header>
          <p className="eyebrow">Messages</p>
          <h1 className="font-serif text-4xl mt-1">Guest inbox</h1>
          <p className="text-muted-foreground mt-2">
            Messages submitted from the public contact page. Reply by email directly from here.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : msgs.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              <Inbox className="h-8 w-8 mx-auto mb-3 opacity-60" />
              No messages yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
            <div className="space-y-2">
              {msgs.map((m) => (
                <button
                  key={m.id}
                  onClick={() => open(m)}
                  className={`w-full text-left p-4 rounded-md border transition-colors ${
                    active?.id === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium truncate">{m.name}</p>
                    <Badge className={statusColor[m.status] ?? ""}>{m.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                  <p className="text-sm mt-2 truncate">{m.subject || "(no subject)"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                {!active ? (
                  <p className="text-muted-foreground">Select a message to read and reply.</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="font-serif text-2xl">{active.subject || "(no subject)"}</p>
                      <p className="text-sm text-muted-foreground">
                        From {active.name} · {active.email} ·{" "}
                        {new Date(active.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/40 p-4 whitespace-pre-wrap text-sm">
                      {active.message}
                    </div>
                    <div className="space-y-2">
                      <p className="eyebrow">Your reply</p>
                      <Textarea
                        rows={6}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply…"
                      />
                    </div>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Button variant="ghost" onClick={() => remove(active.id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                      <Button variant="outline" onClick={() => archive(active.id)}>
                        Archive
                      </Button>
                      <Button onClick={send} disabled={sending || reply.trim().length < 1}>
                        <Mail className="h-4 w-4" /> {sending ? "Sending…" : "Send reply"}
                      </Button>
                    </div>
                    {active.replied_at && (
                      <p className="text-xs text-muted-foreground">
                        Last replied {new Date(active.replied_at).toLocaleString()}
                      </p>
                    )}
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
