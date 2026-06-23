import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  ConciergeBell,
  BedDouble,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  QrCode,
  ListChecks,
  Mail,
  Tag,
  Users as UsersIcon,
  Bell,
  Quote,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/hooks/useProperty";
import { useRealtimeRequests } from "@/context/RealtimeRequestsContext";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Badge = ({ count }: { count: number }) => {
  if (!count) return null;
  return (
    <span className="ml-auto inline-flex min-w-[1.25rem] h-5 px-1.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
      {count > 99 ? "99+" : count}
    </span>
  );
};

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const { property } = useProperty();
  const { newCount, recent } = useRealtimeRequests();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const nav = [
    { to: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard, end: true },
    { to: "/admin/requests", label: t("admin.requests"), icon: Inbox, badge: newCount },
    { to: "/admin/messages", label: t("admin.messages"), icon: Mail },
    { to: "/admin/services", label: t("admin.services"), icon: ConciergeBell },
    { to: "/admin/rooms", label: t("admin.rooms"), icon: BedDouble },
    { to: "/admin/offers", label: t("admin.offers"), icon: Tag },
    { to: "/admin/qr-codes", label: t("admin.qrCodes"), icon: QrCode },
    { to: "/admin/content", label: t("admin.content"), icon: FileText },
    { to: "/admin/testimonials", label: t("admin.testimonials"), icon: Quote },
    { to: "/admin/reports", label: t("admin.reports"), icon: BarChart3 },
    { to: "/admin/mvp-checklist", label: t("admin.mvpChecklist"), icon: ListChecks },
    { to: "/admin/users", label: t("admin.users"), icon: UsersIcon },
    { to: "/admin/settings", label: t("admin.settings"), icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(i18n.resolvedLanguage?.startsWith("ro") ? "ro-RO" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-border">
        <Link to="/admin" className="block">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("admin.admin")}</p>
          <p className="font-serif text-xl mt-1 truncate">
            {property?.property_name ?? "Hotel GuestHub"}
          </p>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              )
            }
          >
            <item.icon className="h-4 w-4" strokeWidth={1.75} />
            <span>{item.label}</span>
            {"badge" in item && <Badge count={item.badge ?? 0} />}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border space-y-2">
        <p className="px-3 text-xs text-muted-foreground truncate">
          {user?.email ?? "Demo session"}
        </p>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> {t("admin.signOut")}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-secondary/30 flex w-full">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-background">
        <SidebarContent />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="relative w-72 max-w-[80%] flex flex-col bg-background border-r border-border">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <p className="font-serif text-lg truncate">
              {property?.property_name ?? "Hotel GuestHub"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={bellOpen} onOpenChange={setBellOpen}>
              <PopoverTrigger asChild>
                <button
                  className="relative p-2 rounded-md hover:bg-secondary"
                  aria-label={t("admin.realtime.notifications")}
                >
                  <Bell className="h-5 w-5" strokeWidth={1.75} />
                  {newCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[1.1rem] h-[1.1rem] px-1 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
                      {newCount > 9 ? "9+" : newCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-medium text-sm">{t("admin.realtime.notifications")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {newCount > 0
                      ? t("admin.realtime.newCount", { count: newCount })
                      : t("admin.realtime.empty")}
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recent.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                      {t("admin.realtime.empty")}
                    </p>
                  ) : (
                    recent.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setBellOpen(false);
                          navigate("/admin/requests");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-secondary border-b border-border last:border-0"
                      >
                        <p className="text-sm font-medium truncate">
                          {t("admin.qrPage.room")} {r.room_label} — {r.service_title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{fmtTime(r.created_at)}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setBellOpen(false);
                      navigate("/admin/requests");
                    }}
                  >
                    {t("admin.realtime.viewAll")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <LanguageSwitcher />
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              {t("admin.viewSite")} →
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
