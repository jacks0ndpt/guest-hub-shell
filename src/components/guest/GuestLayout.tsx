import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProperty } from "@/hooks/useProperty";

type Props = {
  children: ReactNode;
  roomLabel?: string | null;
};

const GuestLayout = ({ children, roomLabel }: Props) => {
  const { merged } = useProperty();
  const { t } = useTranslation();
  const waNumber = merged.whatsapp?.replace(/\D/g, "") ?? "";
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-medium shrink-0">
              {merged.logo_placeholder}
            </div>
            <p className="font-serif text-lg truncate">{merged.property_name}</p>
          </Link>
          {roomLabel && (
            <span className="text-xs uppercase tracking-widest bg-secondary text-secondary-foreground rounded-full px-3 py-1 shrink-0">
              {t("guest.roomLabel", { label: roomLabel })}
            </span>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl px-4 py-6 pb-32 flex-1">{children}</main>
      <footer className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="mx-auto max-w-xl px-4 py-3">
          <p className="text-[11px] text-center text-muted-foreground mb-2">
            {t("guest.urgent")}
          </p>
          <div className="flex gap-2">
            {merged.phone && (
              <a
                href={`tel:${merged.phone}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm py-2.5 font-medium"
              >
                <Phone className="h-4 w-4" /> {t("guest.call")}
              </a>
            )}
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border text-sm py-2.5 font-medium"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
