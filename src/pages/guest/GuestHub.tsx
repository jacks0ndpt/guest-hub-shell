import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GuestLayout from "@/components/guest/GuestLayout";
import RequestDialog from "@/components/guest/RequestDialog";
import FeedbackDialog from "@/components/guest/FeedbackDialog";
import { useGuestHub, useRoomCodes, type RoomCode, type ServiceItem, type ServiceCategory } from "@/hooks/useGuestHub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ConciergeBell,
  Plus,
  MapPin,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Sparkles,
  ConciergeBell,
  Plus,
  MapPin,
  MessageCircle,
};

const iconForCategory = (cat: ServiceCategory) => {
  if (cat.icon && ICONS[cat.icon]) return ICONS[cat.icon];
  const n = cat.name.toLowerCase();
  if (n.includes("house")) return Sparkles;
  if (n.includes("recept")) return ConciergeBell;
  if (n.includes("extra") || n.includes("paid")) return Plus;
  if (n.includes("local")) return MapPin;
  if (n.includes("feed")) return MessageCircle;
  return ConciergeBell;
};

type Props = { initialRoom?: RoomCode | null };

const GuestHub = ({ initialRoom = null }: Props) => {
  usePageMeta("Guest services", "Request services and help during your stay.");
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, items } = useGuestHub();
  const { codes } = useRoomCodes();

  const [room, setRoom] = useState<RoomCode | null>(initialRoom);
  const [manualRoom, setManualRoom] = useState("");

  const [activeItem, setActiveItem] = useState<ServiceItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Prefill from ?room=101
  useEffect(() => {
    if (initialRoom || room) return;
    const q = searchParams.get("room");
    if (!q || codes.length === 0) return;
    const match = codes.find((c) => c.room_label === q);
    if (match) setRoom(match);
  }, [searchParams, codes, initialRoom, room]);

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const it of items) {
      if (!it.category_id) continue;
      const arr = map.get(it.category_id) ?? [];
      arr.push(it);
      map.set(it.category_id, arr);
    }
    return map;
  }, [items]);

  const handleSelectRoom = (label: string) => {
    const match = codes.find((c) => c.room_label === label.trim());
    if (match) {
      setRoom(match);
      setSearchParams({ room: match.room_label });
    }
  };

  const handleItemClick = (item: ServiceItem, category: ServiceCategory) => {
    if (!room) return;
    if (category.name.toLowerCase().includes("feedback") || item.title.toLowerCase().includes("feedback")) {
      setFeedbackOpen(true);
      return;
    }
    setActiveCategory(category);
    setActiveItem(item);
  };

  return (
    <GuestLayout roomLabel={room?.room_label}>
      <section className="text-center mb-8">
        <p className="eyebrow">GuestHub</p>
        <h1 className="font-serif text-4xl mt-2">How can we help with your stay?</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Tap a category, send a quick request — we'll take care of it.
        </p>
      </section>

      {!room && (
        <section className="rounded-lg border border-border bg-card p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-serif text-xl">Which room are you in?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tap your room or enter the number below.
          </p>
          {codes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {codes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setRoom(c)}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Room {c.room_label}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSelectRoom(manualRoom);
            }}
            className="mt-4 flex gap-2"
          >
            <Input
              inputMode="numeric"
              placeholder="e.g. 101"
              value={manualRoom}
              onChange={(e) => setManualRoom(e.target.value)}
              maxLength={10}
            />
            <Button type="submit" disabled={!manualRoom.trim()}>Continue</Button>
          </form>
        </section>
      )}

      <div className="space-y-6">
        {categories.map((cat) => {
          const Icon = iconForCategory(cat);
          const catItems = itemsByCategory.get(cat.id) ?? [];
          if (catItems.length === 0) return null;
          return (
            <section key={cat.id}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <h2 className="font-serif text-xl">{cat.name}</h2>
              </div>
              <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item, cat)}
                    disabled={!room}
                    className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {item.is_paid_extra && (
                        <span className="text-sm font-medium text-accent">
                          €{Number(item.price_estimate ?? 0).toFixed(0)}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {!room && (
        <p className="text-center text-xs text-muted-foreground mt-8">
          Select your room above to send a request.
        </p>
      )}

      <RequestDialog
        open={!!activeItem}
        onOpenChange={(v) => !v && setActiveItem(null)}
        item={activeItem}
        category={activeCategory}
        room={room}
      />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} room={room} />
    </GuestLayout>
  );
};

export default GuestHub;
