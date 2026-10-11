// src/components/site/QuizAttemptFeedbackDialog.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSendInstructorQuizAttemptFeedback } from "@/stores/useQuizAttemptsStore";

interface QuizAttemptFeedbackDialogProps {
  /** null = dialog fermé */
  attemptId: string | null;
  studentName?: string;
  onClose: () => void;
}

export function QuizAttemptFeedbackDialog({ attemptId, studentName, onClose }: QuizAttemptFeedbackDialogProps) {
  const send = useSendInstructorQuizAttemptFeedback();
  const [comment, setComment] = useState("");
  const [validated, setValidated] = useState(true);

  useEffect(() => {
    if (attemptId) {
      setComment("");
      setValidated(true);
    }
  }, [attemptId]);

  const handleSubmit = () => {
    if (!attemptId) return;
    send.mutate(
      { attemptId, payload: { comment: comment.trim(), validated } },
      {
        onSuccess: () => {
          toast.success("Feedback envoyé.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open={!!attemptId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            Feedback sur la tentative{studentName ? ` — ${studentName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qf">Commentaire</Label>
            <Textarea id="qf" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="cursor-pointer">Valider cette tentative</Label>
            <Switch checked={validated} onCheckedChange={setValidated} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="accent" disabled={!comment.trim() || send.isPending} onClick={handleSubmit}>
            {send.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}