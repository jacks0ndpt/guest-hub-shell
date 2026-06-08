import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  usePageMeta(`${t("admin.dashboardPage.title")} — ${t("admin.admin")}`, "");
  const { merged } = useProperty();
  const m = useTodayMetrics();
  const symbol = merged.currency === "EUR" ? "€" : merged.currency === "USD" ? "$" : "";

  const cards = [
    { label: t("admin.dashboardPage.openRequestsToday"), value: m.openToday, icon: Clock },
    { label: t("admin.dashboardPage.requestsThisMonth"), value: m.monthRequests, icon: Inbox },
    { label: t("admin.dashboardPage.estimatedUpsell"), value: `${symbol}${m.monthUpsell.toFixed(0)}`, icon: TrendingUp },
    { label: t("admin.dashboardPage.privateFeedback"), value: m.feedbackCount, icon: MessageSquare },
  ];

  const quickActions = [
    { to: "/admin/requests", label: t("admin.dashboardPage.viewRequests"), icon: Inbox },
    { to: "/admin/services", label: t("admin.dashboardPage.manageServices"), icon: ConciergeBell },
    { to: "/admin/reports", label: t("admin.dashboardPage.viewReports"), icon: BarChart3 },
    { to: "/admin/qr-codes", label: t("admin.dashboardPage.qrCodes"), icon: QrCode },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <header>
          <p className="eyebrow">{t("admin.dashboardPage.eyebrow")}</p>
          <h1 className="font-serif text-4xl mt-1">{t("admin.dashboardPage.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("admin.dashboardPage.subtitle", { name: merged.property_name })}
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
          <h2 className="font-serif text-2xl mb-4">{t("admin.dashboardPage.quickActions")}</h2>
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
          <h3 className="font-serif text-xl">{t("admin.dashboardPage.readyToValidate")}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t("admin.dashboardPage.runChecklist")}
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/admin/mvp-checklist">{t("admin.dashboardPage.openChecklist")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
