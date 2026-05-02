import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { RoomCode, ServiceItem, ServiceCategory } from "@/hooks/useGuestHub";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: ServiceItem | null;
  category?: ServiceCategory | null;
  room: RoomCode | null;
  onSubmitted?: () => void;
};

const RequestDialog = ({ open, onOpenChange, item, category, room, onSubmitted }: Props) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setName("");
    setContact("");
    setNote("");
    setDone(false);
    setSubmitting(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !room) return;
    setSubmitting(true);

    const isFallback = room.id.startsWith("fb-") || item.id.startsWith("fb-");
    const requestType = category?.name?.toLowerCase().includes("extra")
      ? "paid_extra"
      : category?.name?.toLowerCase() ?? "service";

    const payload = {
      room_code_id: room.id,
      service_item_id: item.id,
      request_type: requestType,
      guest_name: name.trim() || null,
      guest_contact: contact.trim() || null,
      guest_note: note.trim() || null,
      status: "open",
      estimated_value: item.is_paid_extra ? Number(item.price_estimate ?? 0) : 0,
    };

    if (!isFallback) {
      const { error } = await supabase.from("guest_requests").insert(payload);
      if (error) {
        toast({ title: "Could not send request", description: error.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
    } else {
      // Demo fallback (no DB room/item) — simulate.
      await new Promise((r) => setTimeout(r, 400));
    }

    setSubmitting(false);
    setDone(true);
    onSubmitted?.();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-12 w-12 mx-auto text-primary" strokeWidth={1.5} />
            <DialogTitle className="font-serif text-2xl mt-4">Request received</DialogTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              Our team will review it shortly.
            </p>
            <div className="mt-6 rounded-md bg-secondary/50 p-4 text-left text-sm space-y-1">
              <p><span className="text-muted-foreground">Room:</span> {room?.room_label}</p>
              <p><span className="text-muted-foreground">Service:</span> {item.title}</p>
              {item.is_paid_extra && (
                <p><span className="text-muted-foreground">Estimated:</span> €{Number(item.price_estimate ?? 0).toFixed(2)}</p>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => { reset(); }} variant="outline">Submit another request</Button>
              <Button onClick={() => handleClose(false)}>Back to GuestHub</Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{item.title}</DialogTitle>
              <DialogDescription>
                Room {room?.room_label ?? "—"}
                {item.is_paid_extra && (
                  <span className="block mt-2 text-foreground">
                    Estimated: <strong>€{Number(item.price_estimate ?? 0).toFixed(2)}</strong>
                    <span className="block text-xs text-muted-foreground mt-1">
                      Subject to availability. Reception will confirm.
                    </span>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your name (optional)</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact (optional)</Label>
                <Input
                  id="contact"
                  placeholder="Phone or email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Anything we should know?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting || !room}>
                {submitting ? "Sending…" : item.is_paid_extra ? "Request this service" : "Send request"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
