import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { RoomCode } from "@/hooks/useGuestHub";
import { toast } from "@/hooks/use-toast";
import { Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  room: RoomCode | null;
};

const FeedbackDialog = ({ open, onOpenChange, room }: Props) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setRating(0);
    setComment("");
    setContact("");
    setDone(false);
    setSubmitting(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    setSubmitting(true);

    const isFallback = room.id.startsWith("fb-");
    const payload = {
      room_code_id: room.id,
      rating: rating > 0 ? rating : null,
      comment: comment.trim() || null,
      guest_contact: contact.trim() || null,
      status: "new",
    };

    if (!isFallback) {
      const { error } = await supabase.from("private_feedback").insert(payload);
      if (error) {
        toast({ title: "Could not send feedback", description: error.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
    }

    setSubmitting(false);
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-12 w-12 mx-auto text-primary" strokeWidth={1.5} />
            <DialogTitle className="font-serif text-2xl mt-4">Thank you</DialogTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              Your feedback was sent privately to the hotel team.
            </p>
            <Button onClick={() => handleClose(false)} className="mt-6 w-full">
              Back to GuestHub
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Private feedback</DialogTitle>
              <DialogDescription>
                Only the hotel team will see this. Room {room?.room_label ?? "—"}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          n <= rating ? "fill-accent text-accent" : "text-muted-foreground"
                        )}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Tell us how your stay is going…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fcontact">Contact (optional)</Label>
                <Input
                  id="fcontact"
                  placeholder="If you want a reply"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  maxLength={120}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting || !room}>
                {submitting ? "Sending…" : "Send feedback"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
