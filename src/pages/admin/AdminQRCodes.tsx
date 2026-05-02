import AdminLayout from "@/components/admin/AdminLayout";
import { useRoomCodes } from "@/hooks/useGuestHub";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const AdminQRCodes = () => {
  usePageMeta("QR codes — Admin", "Demo QR URLs for each room.");
  const { codes, loading } = useRoomCodes();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Copied", description: url });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <header>
          <p className="eyebrow">QR GuestHub</p>
          <h1 className="font-serif text-4xl mt-1">Room QR URLs</h1>
          <p className="text-muted-foreground mt-2">
            Each room has its own URL. Print as a QR code and place it in the room.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {codes.map((c) => {
              const url = `${origin}/r/${c.qr_code_slug}`;
              return (
                <div key={c.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-medium">Room {c.room_label}</p>
                    <p className="text-xs text-muted-foreground truncate">{url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copy(url)}>
                      <Copy className="h-4 w-4" /> Copy
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/r/${c.qr_code_slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" /> Open
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-md bg-secondary/50 p-4 text-sm text-muted-foreground">
          Tip: generate QR images for each URL with any QR generator and print them
          on table cards for the rooms.
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminQRCodes;
