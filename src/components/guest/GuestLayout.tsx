import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useProperty } from "@/hooks/useProperty";

type Props = {
  children: ReactNode;
  roomLabel?: string | null;
};

const GuestLayout = ({ children, roomLabel }: Props) => {
  const { merged } = useProperty();
  return (
    <div className="min-h-screen bg-background">
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
              Room {roomLabel}
            </span>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-6 pb-24">{children}</main>
    </div>
  );
};

export default GuestLayout;
