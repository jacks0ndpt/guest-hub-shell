import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        toast({ title: t("guest.feedback.couldNotSend"), description: error.message, variant: "destructive" });
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
            <DialogTitle className="font-serif text-2xl mt-4">{t("guest.feedback.thankYou")}</DialogTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              {t("guest.feedback.thankYouBody")}
            </p>
            <Button onClick={() => handleClose(false)} className="mt-6 w-full">
              {t("guest.feedback.back")}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{t("guest.feedback.title")}</DialogTitle>
              <DialogDescription>
                {t("guest.feedback.desc", { label: room?.room_label ?? "—" })}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("guest.feedback.rating")}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      aria-label={t("guest.feedback.starsLabel", { n })}
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
                <Label htmlFor="comment">{t("guest.feedback.comment")}</Label>
                <Textarea
                  id="comment"
                  placeholder={t("guest.feedback.commentPlaceholder")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fcontact">{t("guest.feedback.contact")}</Label>
                <Input
                  id="fcontact"
                  placeholder={t("guest.feedback.contactPlaceholder")}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  maxLength={120}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting || !room}>
                {submitting ? t("guest.feedback.sending") : t("guest.feedback.send")}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
