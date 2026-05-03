import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Check, Play, X, ThumbsUp, ThumbsDown, StickyNote } from "lucide-react";

type Props = {
  id: string;
  status: string;
  isPaid: boolean;
  staffNote: string | null;
  onChanged: () => void;
};

const update = async (id: string, patch: Record<string, unknown>) => {
  const { error } = await supabase.from("guest_requests").update(patch).eq("id", id);
  if (error) {
    toast({ title: "Update failed", description: error.message, variant: "destructive" });
    return false;
  }
  return true;
};

const RequestActions = ({ id, status, isPaid, staffNote, onChanged }: Props) => {
  const [note, setNote] = useState(staffNote ?? "");
  const [savingNote, setSavingNote] = useState(false);

  const setStatus = async (s: string, completed = false) => {
    const ok = await update(id, {
      status: s,
      ...(completed ? { completed_at: new Date().toISOString() } : {}),
    });
    if (ok) {
      toast({ title: `Marked ${s.replace("_", " ")}` });
      onChanged();
    }
  };

  const saveNote = async () => {
    setSavingNote(true);
    const ok = await update(id, { staff_note: note.trim() || null });
    setSavingNote(false);
    if (ok) {
      toast({ title: "Note saved" });
      onChanged();
    }
  };

  const isFinal = status === "done" || status === "cancelled" || status === "rejected";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {!isFinal && isPaid && status === "new" && (
        <>
          <Button size="sm" variant="outline" onClick={() => setStatus("accepted")}>
            <ThumbsUp className="h-3.5 w-3.5" /> Accept
          </Button>
          <Button size="sm" variant="outline" onClick={() => setStatus("rejected")}>
            <ThumbsDown className="h-3.5 w-3.5" /> Reject
          </Button>
        </>
      )}
      {!isFinal && !isPaid && status === "new" && (
        <Button size="sm" variant="outline" onClick={() => setStatus("in_progress")}>
          <Play className="h-3.5 w-3.5" /> In progress
        </Button>
      )}
      {!isFinal && (status === "in_progress" || status === "accepted") && (
        <Button size="sm" variant="outline" onClick={() => setStatus("done", true)}>
          <Check className="h-3.5 w-3.5" /> Done
        </Button>
      )}
      {!isFinal && (
        <Button size="sm" variant="ghost" onClick={() => setStatus("cancelled")}>
          <X className="h-3.5 w-3.5" /> Cancel
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost">
            <StickyNote className="h-3.5 w-3.5" /> Note
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <p className="text-sm font-medium mb-2">Staff note</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Internal note for the team"
          />
          <Button size="sm" className="mt-2 w-full" onClick={saveNote} disabled={savingNote}>
            {savingNote ? "Saving…" : "Save note"}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RequestActions;
