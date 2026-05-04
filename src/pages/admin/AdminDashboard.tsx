import { Link } from "react-router-dom";
import {
  Inbox,
  Clock,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ConciergeBell,
  BarChart3,
  QrCode,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTodayMetrics } from "@/hooks/useReports";

const AdminDashboard = () => {
  usePageMeta("Dashboard — Admin", "Overview of guest requests, services and feedback.");
  const { merged } = useProperty();
  const m = useTodayMetrics();
  const symbol = merged.currency === "EUR" ? "€" : merged.currency === "USD" ? "$" : "";

  const cards = [
    { label: "Open requests today", value: m.openToday, icon: Clock },
    { label: "Requests this month", value: m.monthRequests, icon: Inbox },
    { label: "Estimated upsell (mo)", value: `${symbol}${m.monthUpsell.toFixed(0)}`, icon: TrendingUp },
    { label: "Private feedback (mo)", value: m.feedbackCount, icon: MessageSquare },
  ];

  const quickActions = [
    { to: "/admin/requests", label: "View Requests", icon: Inbox },
    { to: "/admin/services", label: "Manage Services", icon: ConciergeBell },
    { to: "/admin/reports", label: "View Reports", icon: BarChart3 },
    { to: "/admin/qr-codes", label: "QR Codes", icon: QrCode },
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

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <c.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                </div>
                <p className="font-serif text-3xl mt-3">{m.loading ? "—" : c.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Quick actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((q) => (
              <Button key={q.to} asChild variant="outline" className="h-auto py-4 justify-start">
                <Link to={q.to}>
                  <q.icon className="h-4 w-4" strokeWidth={1.75} />
                  <span className="ml-2">{q.label}</span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-secondary/30 p-6">
          <h3 className="font-serif text-xl">Ready to validate with hotel owners?</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Run through the MVP checklist before your first demo.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/admin/mvp-checklist">Open MVP checklist <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
