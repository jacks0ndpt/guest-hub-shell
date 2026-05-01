import AdminLayout from "@/components/admin/AdminLayout";
import { BarChart3 } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const AdminReports = () => {
  usePageMeta("Reports — Admin", "Monthly value and activity dashboard.");
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header>
          <p className="eyebrow">Reports</p>
          <h1 className="font-serif text-4xl mt-1">Monthly reports</h1>
          <p className="text-muted-foreground mt-2">
            Track requests handled, upsell value, and guest feedback over time.
          </p>
        </header>
        <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
          <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
          <p className="font-serif text-xl mt-4">Reporting dashboard coming soon.</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            We'll show monthly value, popular requests, response time and feedback trends.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
