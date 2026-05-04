import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ReportAssumptions = {
  minutes_saved_per_request: number;
  staff_hourly_cost: number;
  monthly_subscription_price: number;
};

export const DEFAULT_ASSUMPTIONS: ReportAssumptions = {
  minutes_saved_per_request: 3,
  staff_hourly_cost: 8,
  monthly_subscription_price: 30,
};

const STORAGE_KEY = "guesthub.report.assumptions";

export const loadAssumptions = (): ReportAssumptions => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_ASSUMPTIONS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_ASSUMPTIONS;
};

export const saveAssumptions = (a: ReportAssumptions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {}
};

export type MonthRange = { start: Date; end: Date; label: string };

export const monthRange = (offset = 0): MonthRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  const label = start.toLocaleString(undefined, { month: "long", year: "numeric" });
  return { start, end, label };
};

export type ReportMetrics = {
  total_guest_requests: number;
  open_requests: number;
  completed_requests: number;
  paid_extra_requests: number;
  accepted_paid_extras: number;
  estimated_upsell_value: number;
  private_feedback_count: number;
  negative_feedback_intercepted: number;
  estimated_staff_minutes_saved: number;
  estimated_staff_time_saved_value: number;
  estimated_total_value: number;
  loading: boolean;
  isDemo: boolean;
};

const DEMO: Omit<ReportMetrics, "loading" | "isDemo"> = {
  total_guest_requests: 84,
  open_requests: 6,
  completed_requests: 67,
  paid_extra_requests: 14,
  accepted_paid_extras: 11,
  estimated_upsell_value: 230,
  private_feedback_count: 9,
  negative_feedback_intercepted: 2,
  estimated_staff_minutes_saved: 252,
  estimated_staff_time_saved_value: 33.6,
  estimated_total_value: 263.6,
};

export const useReportMetrics = (range: MonthRange, assumptions: ReportAssumptions) => {
  const [data, setData] = useState<ReportMetrics>({
    ...DEMO,
    loading: true,
    isDemo: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const startISO = range.start.toISOString();
      const endISO = range.end.toISOString();
      const [reqRes, fbRes] = await Promise.all([
        supabase
          .from("guest_requests")
          .select("status,estimated_value,created_at")
          .gte("created_at", startISO)
          .lt("created_at", endISO),
        supabase
          .from("private_feedback")
          .select("rating,created_at")
          .gte("created_at", startISO)
          .lt("created_at", endISO),
      ]);
      if (cancelled) return;

      const reqs = reqRes.data ?? [];
      const fbs = fbRes.data ?? [];

      if (reqs.length === 0 && fbs.length === 0) {
        // Demo state — show realistic numbers
        const minutes = DEMO.total_guest_requests * assumptions.minutes_saved_per_request;
        const timeVal = (minutes / 60) * assumptions.staff_hourly_cost;
        setData({
          ...DEMO,
          estimated_staff_minutes_saved: minutes,
          estimated_staff_time_saved_value: Number(timeVal.toFixed(2)),
          estimated_total_value: Number((DEMO.estimated_upsell_value + timeVal).toFixed(2)),
          loading: false,
          isDemo: true,
        });
        return;
      }

      const total = reqs.length;
      const open = reqs.filter((r) => ["new", "in_progress", "open"].includes(r.status)).length;
      const completed = reqs.filter((r) => ["done", "completed"].includes(r.status)).length;
      const paidExtras = reqs.filter((r) => Number(r.estimated_value) > 0);
      const accepted = paidExtras.filter((r) => ["accepted", "done", "completed"].includes(r.status));
      const upsell = accepted.reduce((s, r) => s + Number(r.estimated_value || 0), 0);
      const minutes = total * assumptions.minutes_saved_per_request;
      const timeVal = (minutes / 60) * assumptions.staff_hourly_cost;
      const negative = fbs.filter((f) => f.rating !== null && Number(f.rating) <= 3).length;

      setData({
        total_guest_requests: total,
        open_requests: open,
        completed_requests: completed,
        paid_extra_requests: paidExtras.length,
        accepted_paid_extras: accepted.length,
        estimated_upsell_value: Number(upsell.toFixed(2)),
        private_feedback_count: fbs.length,
        negative_feedback_intercepted: negative,
        estimated_staff_minutes_saved: minutes,
        estimated_staff_time_saved_value: Number(timeVal.toFixed(2)),
        estimated_total_value: Number((upsell + timeVal).toFixed(2)),
        loading: false,
        isDemo: false,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [range.start.getTime(), range.end.getTime(), assumptions.minutes_saved_per_request, assumptions.staff_hourly_cost]);

  return data;
};

export const useTodayMetrics = () => {
  const [data, setData] = useState({ openToday: 0, monthRequests: 0, monthUpsell: 0, feedbackCount: 0, loading: true });
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [todayOpen, monthReqs, fb] = await Promise.all([
        supabase
          .from("guest_requests")
          .select("*", { count: "exact", head: true })
          .in("status", ["new", "in_progress", "open", "accepted"])
          .gte("created_at", startOfDay.toISOString()),
        supabase
          .from("guest_requests")
          .select("status,estimated_value")
          .gte("created_at", startOfMonth.toISOString()),
        supabase
          .from("private_feedback")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth.toISOString()),
      ]);
      if (cancelled) return;
      const month = monthReqs.data ?? [];
      const upsell = month
        .filter((r) => Number(r.estimated_value) > 0 && ["accepted", "done", "completed"].includes(r.status))
        .reduce((s, r) => s + Number(r.estimated_value || 0), 0);
      setData({
        openToday: todayOpen.count ?? 0,
        monthRequests: month.length,
        monthUpsell: Number(upsell.toFixed(2)),
        feedbackCount: fb.count ?? 0,
        loading: false,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return data;
};
