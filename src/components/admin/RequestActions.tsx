import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Check, Play, X, ThumbsUp, ThumbsDown, StickyNote, RotateCcw } from "lucide-react";

type Props = {
  id: string;
  status: string;
  isPaid: boolean;
  staffNote: string | null;
  onChanged: () => void;
};

const update = async (id: string, patch: { status?: string; completed_at?: string | null; staff_note?: string | null }, failTitle: string) => {
  const { error } = await supabase.from("guest_requests").update(patch).eq("id", id);
  if (error) {
    toast({ title: failTitle, description: error.message, variant: "destructive" });
    return false;
  }
  return true;
};

const RequestActions = ({ id, status, isPaid, staffNote, onChanged }: Props) => {
  const { t } = useTranslation();
  const [note, setNote] = useState(staffNote ?? "");
  const [savingNote, setSavingNote] = useState(false);

  const setStatus = async (s: string, completed = false) => {
    const ok = await update(id, {
      status: s,
      ...(completed ? { completed_at: new Date().toISOString() } : {}),
    }, t("admin.requestActions.updateFailed"));
    if (ok) {
      const labelMap: Record<string, string> = {
        accepted: t("admin.requestsPage.statusAccepted"),
        rejected: t("admin.requestsPage.statusRejected"),
        in_progress: t("admin.requestsPage.statusInProgress"),
        done: t("admin.requestsPage.statusDone"),
        cancelled: t("admin.requestsPage.statusCancelled"),
      };
      toast({ title: `${t("admin.requestActions.markedPrefix")} ${labelMap[s] ?? s}` });
      onChanged();
    }
  };

  const saveNote = async () => {
    setSavingNote(true);
    const ok = await update(id, { staff_note: note.trim() || null }, t("admin.requestActions.updateFailed"));
    setSavingNote(false);
    if (ok) {
      toast({ title: t("admin.requestActions.noteSaved") });
      onChanged();
    }
  };

  const isFinal = status === "done" || status === "cancelled" || status === "rejected";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {!isFinal && isPaid && status === "new" && (
        <>
          <Button size="sm" variant="outline" onClick={() => setStatus("accepted")}>
            <ThumbsUp className="h-3.5 w-3.5" /> {t("admin.requestActions.accept")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setStatus("rejected")}>
            <ThumbsDown className="h-3.5 w-3.5" /> {t("admin.requestActions.reject")}
          </Button>
        </>
      )}
      {!isFinal && !isPaid && status === "new" && (
        <Button size="sm" variant="outline" onClick={() => setStatus("in_progress")}>
          <Play className="h-3.5 w-3.5" /> {t("admin.requestActions.inProgress")}
        </Button>
      )}
      {!isFinal && (status === "in_progress" || status === "accepted") && (
        <Button size="sm" variant="outline" onClick={() => setStatus("done", true)}>
          <Check className="h-3.5 w-3.5" /> {t("admin.requestActions.done")}
        </Button>
      )}
      {!isFinal && (
        <Button size="sm" variant="ghost" onClick={() => setStatus("cancelled")}>
          <X className="h-3.5 w-3.5" /> {t("admin.requestActions.cancel")}
        </Button>
      )}
      {isFinal && (
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            const ok = await update(id, { status: "in_progress", completed_at: null }, t("admin.requestActions.updateFailed"));
            if (ok) {
              toast({ title: t("admin.requestActions.requestReopened") });
              onChanged();
            }
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> {t("admin.requestActions.reopen")}
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost">
            <StickyNote className="h-3.5 w-3.5" /> {t("admin.requestActions.note")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <p className="text-sm font-medium mb-2">{t("admin.requestActions.staffNote")}</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={t("admin.requestActions.staffNotePlaceholder")}
          />
          <Button size="sm" className="mt-2 w-full" onClick={saveNote} disabled={savingNote}>
            {savingNote ? t("common.saving") : t("admin.requestActions.saveNote")}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RequestActions;
