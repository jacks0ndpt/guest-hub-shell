import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, ShieldOff, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";

type RoleRow = { id: string; user_id: string; role: string; created_at: string };

const AdminUsers = () => {
  usePageMeta("Users — Hotel GuestHub", "Manage admin access for staff accounts.");
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToPromote, setEmailToPromote] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Could not load roles", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as RoleRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const adminCount = rows.filter((r) => r.role === "admin").length;

  const revoke = async (row: RoleRow) => {
    if (row.user_id === user?.id) {
      toast({ title: "You cannot revoke your own admin", variant: "destructive" });
      return;
    }
    if (adminCount <= 1) {
      toast({ title: "At least one admin must remain", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("user_roles").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Failed to revoke", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Admin access revoked" });
    load();
  };

  const grantByUserId = async (uid: string) => {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: uid, role: "admin" });
    if (error) {
      toast({ title: "Failed to grant", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Admin access granted" });
    setEmailToPromote("");
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl">{t("admin.users")}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage which staff accounts have admin access.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium">How to add an admin</p>
              <ol className="list-decimal pl-4 text-muted-foreground space-y-1">
                <li>Ask the new staff member to sign up at <code className="px-1 rounded bg-muted">/admin/login → Sign up</code>.</li>
                <li>Copy their <strong>user ID</strong> (visible to them after first login in their browser, or you can find it in the auth records).</li>
                <li>Paste it below and click <strong>Grant admin</strong>.</li>
              </ol>
              <p className="text-xs text-muted-foreground pt-1">
                Note: the very first account to sign up becomes admin automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={emailToPromote}
              onChange={(e) => setEmailToPromote(e.target.value)}
              placeholder="paste user UUID…"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button
              onClick={() => grantByUserId(emailToPromote.trim())}
              disabled={!emailToPromote.trim()}
            >
              Grant admin
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Granted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">{t("common.loading")}</TableCell></TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No roles yet.</TableCell></TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">
                    {r.user_id}
                    {r.user_id === user?.id && <Badge variant="outline" className="ml-2">you</Badge>}
                  </TableCell>
                  <TableCell><Badge>{r.role}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revoke(r)}
                      disabled={r.user_id === user?.id || adminCount <= 1}
                    >
                      <ShieldOff className="h-4 w-4" /> Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
