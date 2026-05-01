import AdminLayout from "@/components/admin/AdminLayout";
import { Inbox } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const AdminRequests = () => {
  usePageMeta("Guest requests — Admin", "Review and manage guest requests.");
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <header>
          <p className="eyebrow">Requests</p>
          <h1 className="font-serif text-4xl mt-1">Guest requests</h1>
          <p className="text-muted-foreground mt-2">
            All requests sent from in-room QR codes will appear here.
          </p>
        </header>
        <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
          <Inbox className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
          <p className="font-serif text-xl mt-4">Guest requests will appear here.</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Once guests start using QR GuestHub, you'll see and manage every request,
            its status, and the estimated value here.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRequests;
