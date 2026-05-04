import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, Clock, CheckCircle2, TrendingUp, ShoppingBag, MessageSquare, AlertTriangle, Timer, Coins, Sparkles, Copy } from "lucide-react";
import { useProperty } from "@/hooks/useProperty";
import { usePageMeta } from "@/hooks/usePageMeta";
import { DEFAULT_ASSUMPTIONS, loadAssumptions, monthRange, saveAssumptions, useReportMetrics, type ReportAssumptions } from "@/hooks/useReports";
import { toast } from "@/hooks/use-toast";

const AdminReports = () => {
  usePageMeta("Reports — Admin", "Monthly value and ROI dashboard for Hotel GuestHub.");
  const { merged } = useProperty();
  const currencySymbol = merged.currency === "EUR" ? "€" : merged.currency === "USD" ? "$" : "";

  const [offset, setOffset] = useState(0);
  const range = useMemo(() => monthRange(offset), [offset]);
  const [assumptions, setAssumptions] = useState<ReportAssumptions>(loadAssumptions());

  const m = useReportMetrics(range, assumptions);
  const fmt = (v: number) => `${currencySymbol}${v.toFixed(0)}`;

  const updateAssumption = (key: keyof ReportAssumptions, value: number) => {
    const next = { ...assumptions, [key]: value };
    setAssumptions(next);
    saveAssumptions(next);
  };

  const cards = [
    { label: "Total guest requests", value: m.total_guest_requests, icon: Inbox },
    { label: "Open requests", value: m.open_requests, icon: Clock },
    { label: "Completed", value: m.completed_requests, icon: CheckCircle2 },
    { label: "Paid extra requests", value: m.paid_extra_requests, icon: ShoppingBag },
    { label: "Accepted paid extras", value: m.accepted_paid_extras, icon: TrendingUp },
    { label: "Estimated upsell value", value: fmt(m.estimated_upsell_value), icon: Coins },
    { label: "Private feedback", value: m.private_feedback_count, icon: MessageSquare },
    { label: "Negative feedback intercepted", value: m.negative_feedback_intercepted, icon: AlertTriangle },
    { label: "Staff minutes saved", value: m.estimated_staff_minutes_saved, icon: Timer },
    { label: "Staff time value", value: fmt(m.estimated_staff_time_saved_value), icon: Coins },
    { label: "Estimated total value", value: fmt(m.estimated_total_value), icon: Sparkles },
    { label: "Subscription cost", value: fmt(assumptions.monthly_subscription_price), icon: Coins },
  ];

  const roi = assumptions.monthly_subscription_price > 0
    ? m.estimated_total_value / assumptions.monthly_subscription_price
    : 0;
  const paysForItself = m.estimated_total_value >= assumptions.monthly_subscription_price;

  const summary = `This month (${range.label}), GuestHub handled ${m.total_guest_requests} guest interactions, helped process ${m.accepted_paid_extras} paid-service requests, captured ${m.private_feedback_count} private feedback items${m.negative_feedback_intercepted ? ` (intercepting ${m.negative_feedback_intercepted} negative ones before public review)` : ""}, and produced an estimated ${fmt(m.estimated_total_value)} in operational and upsell value.`;

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({ title: "Copied", description: "Monthly summary copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Reports</p>
            <h1 className="font-serif text-4xl mt-1">Monthly value</h1>
            <p className="text-muted-foreground mt-2">
              {range.label} · {merged.property_name}
              {m.isDemo && (
                <Badge variant="secondary" className="ml-2">Demo data</Badge>
              )}
            </p>
          </div>
          <Select value={String(offset)} onValueChange={(v) => setOffset(Number(v))}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Current month</SelectItem>
              <SelectItem value="-1">Previous month</SelectItem>
              <SelectItem value="-2">Two months ago</SelectItem>
              <SelectItem value="-3">Three months ago</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <p className="text-xs text-muted-foreground">
          Financial figures are estimates for management insight, not accounting data.
        </p>

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

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl">Why this pays for itself</h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Subscription</p>
              <p className="font-serif text-2xl mt-1">{fmt(assumptions.monthly_subscription_price)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Estimated value</p>
              <p className="font-serif text-2xl mt-1">{fmt(m.estimated_total_value)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Estimated ROI</p>
              <p className="font-serif text-2xl mt-1">{roi.toFixed(1)}×</p>
            </div>
          </div>
          <p className={`mt-4 text-sm ${paysForItself ? "text-primary" : "text-muted-foreground"}`}>
            {paysForItself
              ? "GuestHub has likely covered its monthly cost this month."
              : "More guest activity will make this report more meaningful over time."}
          </p>
        </section>

        <section className="rounded-lg border border-border bg-secondary/30 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl">Monthly summary</h2>
              <p className="text-sm text-muted-foreground mt-1">Owner-friendly recap, ready to share.</p>
            </div>
            <Button variant="outline" size="sm" onClick={copySummary}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
          <p className="mt-4 text-base leading-relaxed">{summary}</p>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl">Assumptions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust these to match your hotel. Saved locally in your browser.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Minutes saved per request</Label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={assumptions.minutes_saved_per_request}
                onChange={(e) => updateAssumption("minutes_saved_per_request", Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Staff hourly cost ({currencySymbol})</Label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={assumptions.staff_hourly_cost}
                onChange={(e) => updateAssumption("staff_hourly_cost", Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly subscription ({currencySymbol})</Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={assumptions.monthly_subscription_price}
                onChange={(e) => updateAssumption("monthly_subscription_price", Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => {
              setAssumptions(DEFAULT_ASSUMPTIONS);
              saveAssumptions(DEFAULT_ASSUMPTIONS);
            }}
          >
            Reset to defaults
          </Button>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
