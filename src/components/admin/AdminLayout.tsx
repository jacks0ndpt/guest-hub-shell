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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useProperty } from "@/hooks/useProperty";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const { property } = useProperty();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard, end: true },
    { to: "/admin/requests", label: t("admin.requests"), icon: Inbox },
    { to: "/admin/messages", label: t("admin.messages"), icon: Mail },
    { to: "/admin/services", label: t("admin.services"), icon: ConciergeBell },
    { to: "/admin/rooms", label: t("admin.rooms"), icon: BedDouble },
    { to: "/admin/offers", label: t("admin.offers"), icon: Tag },
    { to: "/admin/qr-codes", label: t("admin.qrCodes"), icon: QrCode },
    { to: "/admin/content", label: t("admin.content"), icon: FileText },
    { to: "/admin/reports", label: t("admin.reports"), icon: BarChart3 },
    { to: "/admin/mvp-checklist", label: t("admin.mvpChecklist"), icon: ListChecks },
    { to: "/admin/users", label: t("admin.users"), icon: UsersIcon },
    { to: "/admin/settings", label: t("admin.settings"), icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-border">
        <Link to="/admin" className="block">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
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
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border space-y-2">
        <p className="px-3 text-xs text-muted-foreground truncate">
          {user?.email ?? "Demo session"}
        </p>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-secondary/30 flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
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
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            View site →
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
