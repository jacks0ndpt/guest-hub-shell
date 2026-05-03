import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  CheckCircle2,
  Clock,
  TrendingUp,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";

type Stats = {
  monthRequests: number;
  open: number;
  completed: number;
  estValue: number;
  feedbackCount: number;
};

const AdminDashboard = () => {
  usePageMeta("Dashboard — Admin", "Overview of guest requests, services and feedback.");
  const { merged } = useProperty();
  const [stats, setStats] = useState<Stats>({
    monthRequests: 0,
    open: 0,
    completed: 0,
    estValue: 0,
    feedbackCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [{ data: monthData }, { count: openCount }, { count: doneCount }, { count: feedbackCount }] =
        await Promise.all([
          supabase
            .from("guest_requests")
            .select("estimated_value, status")
            .gte("created_at", startOfMonth.toISOString()),
          supabase.from("guest_requests").select("*", { count: "exact", head: true }).in("status", ["new", "in_progress", "accepted"]),
          supabase
            .from("guest_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "done"),
          supabase.from("private_feedback").select("*", { count: "exact", head: true }),
        ]);

      const monthRequests = monthData?.length ?? 0;
      const estValue = (monthData ?? []).reduce(
        (sum, r) => sum + (Number(r.estimated_value) || 0),
        0
      );

      setStats({
        monthRequests,
        open: openCount ?? 0,
        completed: doneCount ?? 0,
        estValue,
        feedbackCount: feedbackCount ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Requests this month", value: stats.monthRequests, icon: Inbox },
    { label: "Open requests", value: stats.open, icon: Clock },
    { label: "Completed", value: stats.completed, icon: CheckCircle2 },
    {
      label: "Estimated upsell",
      value: `${merged.currency === "EUR" ? "€" : ""}${stats.estValue.toFixed(0)}`,
      icon: TrendingUp,
    },
    { label: "Private feedback", value: stats.feedbackCount, icon: MessageSquare },
  ];

  const quickLinks = [
    { to: "/admin/requests", label: "Requests" },
    { to: "/admin/services", label: "Services" },
    { to: "/admin/rooms", label: "Rooms" },
    { to: "/admin/reports", label: "Reports" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <header>
          <p className="eyebrow">Overview</p>
          <h1 className="font-serif text-4xl mt-1">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Snapshot of activity at {merged.property_name}.
          </p>
        </header>

        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <c.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                </div>
                <p className="font-serif text-3xl mt-3">
                  {loading ? "—" : c.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Quick links</h2>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((q) => (
              <Button key={q.to} asChild variant="outline">
                <Link to={q.to}>
                  {q.label} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
