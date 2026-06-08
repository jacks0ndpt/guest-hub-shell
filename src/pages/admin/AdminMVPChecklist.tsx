import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/admin/AdminLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const ITEM_KEYS = [
  "publicSite",
  "roomsVisible",
  "qrRoute",
  "guestSubmission",
  "adminBoard",
  "serviceCatalog",
  "propertySettings",
  "valueDashboard",
  "qrPrint",
  "readyTest",
];

const SECURITY_KEYS = [
  "backendConnected",
  "verifyAuth",
  "rlsReviewed",
  "noSecretsExposed",
  "endToEndTested",
  "adminProtected",
  "reviewedBeforePublish",
];

const ITEM_EN: Record<string, string> = {
  publicSite: "Public website complete",
  roomsVisible: "Rooms visible on public site",
  qrRoute: "GuestHub QR route working",
  guestSubmission: "Guest request submission working",
  adminBoard: "Admin request board working",
  serviceCatalog: "Service catalog editable",
  propertySettings: "Property settings editable",
  valueDashboard: "Monthly value dashboard working",
  qrPrint: "QR links ready to print",
  readyTest: "Ready to test with first hotel",
  backendConnected: "Backend (Lovable Cloud) connected before real client use",
  verifyAuth: "Verify admin authentication works",
  rlsReviewed: "Row-level security policies reviewed",
  noSecretsExposed: "No secrets exposed in client code",
  endToEndTested: "Tested guest request submission end-to-end",
  adminProtected: "Tested admin-only routes are protected",
  reviewedBeforePublish: "Reviewed before publishing",
};
const ITEM_RO: Record<string, string> = {
  publicSite: "Site public complet",
  roomsVisible: "Camerele sunt vizibile pe site",
  qrRoute: "Ruta QR GuestHub funcționează",
  guestSubmission: "Trimiterea cererilor de oaspeți funcționează",
  adminBoard: "Panoul de cereri admin funcționează",
  serviceCatalog: "Catalogul de servicii editabil",
  propertySettings: "Setările proprietății editabile",
  valueDashboard: "Tabloul valoric lunar funcționează",
  qrPrint: "Link-urile QR gata de printat",
  readyTest: "Gata de testare cu primul hotel",
  backendConnected: "Backend (Lovable Cloud) conectat înainte de utilizare reală",
  verifyAuth: "Verificat autentificarea admin",
  rlsReviewed: "Politici RLS revizuite",
  noSecretsExposed: "Niciun secret expus în codul client",
  endToEndTested: "Testat trimiterea cererilor cap la cap",
  adminProtected: "Testat că rutele admin sunt protejate",
  reviewedBeforePublish: "Revizuit înainte de publicare",
};

const KEY = "guesthub.mvp.checklist";

const AdminMVPChecklist = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(`${t("admin.mvpPage.title")} — ${t("admin.admin")}`, "");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, []);

  const labels = (i18n.resolvedLanguage || "en").startsWith("ro") ? ITEM_RO : ITEM_EN;

  const toggle = (key: string) => {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const renderList = (keys: string[]) =>
    keys.map((key) => (
      <li key={key} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
        <Checkbox
          id={key}
          checked={!!checked[key]}
          onCheckedChange={() => toggle(key)}
          className="mt-0.5"
        />
        <label htmlFor={key} className="text-sm cursor-pointer flex-1">
          {labels[key]}
        </label>
      </li>
    ));

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">
        <header>
          <p className="eyebrow">{t("admin.mvpPage.eyebrow")}</p>
          <h1 className="font-serif text-4xl mt-1">{t("admin.mvpPage.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("admin.mvpPage.subtitle")}</p>
        </header>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl mb-3">{t("admin.mvpPage.demoReadiness")}</h2>
          <ul>{renderList(ITEM_KEYS)}</ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> {t("admin.mvpPage.security")}
          </h2>
          <ul>{renderList(SECURITY_KEYS)}</ul>
        </section>

        <p className="text-xs text-muted-foreground">{t("admin.mvpPage.savedLocally")}</p>
      </div>
    </AdminLayout>
  );
};

export default AdminMVPChecklist;
