import AdminLayout from "@/components/admin/AdminLayout";
import { useRoomCodes } from "@/hooks/useGuestHub";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Copy, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import QRCodeImage from "@/components/admin/QRCodeImage";
import QRCode from "qrcode";

const AdminQRCodes = () => {
  const { t } = useTranslation();
  usePageMeta(`${t("admin.qrPage.title")} — ${t("admin.admin")}`, "");
  const { codes, loading } = useRoomCodes();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: t("common.copied"), description: url });
    } catch {
      toast({ title: t("common.copyFailed"), variant: "destructive" });
    }
  };

  const download = async (url: string, label: string) => {
    const data = await QRCode.toDataURL(url, { width: 600, margin: 2 });
    const a = document.createElement("a");
    a.href = data;
    a.download = `room-${label}-qr.png`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <header>
          <p className="eyebrow">{t("admin.qrPage.eyebrow")}</p>
          <h1 className="font-serif text-4xl mt-1">{t("admin.qrPage.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("admin.qrPage.subtitle")}</p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {codes.map((c) => {
              const url = `${origin}/r/${c.qr_code_slug}`;
              return (
                <div key={c.id} className="rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center gap-3">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-medium">{t("admin.qrPage.room")} {c.room_label}</p>
                    <Badge variant={c.is_active ? "secondary" : "outline"}>
                      {c.is_active ? t("common.active") : t("common.inactive")}
                    </Badge>
                  </div>
                  <div className="rounded-md bg-background p-2">
                    <QRCodeImage value={url} size={160} />
                  </div>
                  <p className="text-xs text-muted-foreground break-all">{url}</p>
                  <div className="flex gap-1.5 w-full">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => copy(url)}>
                      <Copy className="h-3.5 w-3.5" /> {t("common.copy")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link to={`/r/${c.qr_code_slug}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" /> {t("common.open")}
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => download(url, c.room_label)}>
                      <Download className="h-3.5 w-3.5" /> PNG
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQRCodes;
