import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const ITEMS = [
  "Public website complete",
  "Rooms visible on public site",
  "GuestHub QR route working",
  "Guest request submission working",
  "Admin request board working",
  "Service catalog editable",
  "Property settings editable",
  "Monthly value dashboard working",
  "QR links ready to print",
  "Ready to test with first hotel",
];

const SECURITY = [
  "Backend (Lovable Cloud) connected before real client use",
  "Verify admin authentication works",
  "Row-level security policies reviewed",
  "No secrets exposed in client code",
  "Tested guest request submission end-to-end",
  "Tested admin-only routes are protected",
  "Reviewed before publishing",
];

const KEY = "guesthub.mvp.checklist";

const AdminMVPChecklist = () => {
  usePageMeta("MVP checklist — Admin", "Validation checklist for Hotel GuestHub demos.");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = (label: string) => {
    const next = { ...checked, [label]: !checked[label] };
    setChecked(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const renderList = (items: string[]) =>
    items.map((label) => (
      <li key={label} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
        <Checkbox
          id={label}
          checked={!!checked[label]}
          onCheckedChange={() => toggle(label)}
          className="mt-0.5"
        />
        <label htmlFor={label} className="text-sm cursor-pointer flex-1">
          {label}
        </label>
      </li>
    ));

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">
        <header>
          <p className="eyebrow">MVP</p>
          <h1 className="font-serif text-4xl mt-1">Validation checklist</h1>
          <p className="text-muted-foreground mt-2">
            Walk through these items before showing the product to a hotel owner.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl mb-3">Demo readiness</h2>
          <ul>{renderList(ITEMS)}</ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Security &amp; production
          </h2>
          <ul>{renderList(SECURITY)}</ul>
        </section>

        <p className="text-xs text-muted-foreground">
          Progress is saved locally in your browser. Reset by clearing site data.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminMVPChecklist;
