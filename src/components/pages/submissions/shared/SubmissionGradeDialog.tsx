import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InstructorSubmissionBadge } from "@/components/shared/StatusBadges";
import {
  SUBMISSION_DECISIONS,
  submissionDecisionLabels,
  type APIInstructorSubmission,
  type SubmissionDecision,
} from "@/data/submissions";
import { useGradeInstructorSubmission } from "@/stores/useSubmissionsStore";

interface SubmissionGradeDialogProps {
  submission: APIInstructorSubmission | null;
  onClose: () => void;
}

export function SubmissionGradeDialog({ submission, onClose }: SubmissionGradeDialogProps) {
  const grade = useGradeInstructorSubmission();
  const [decision, setDecision] = useState<SubmissionDecision>("under_review");
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");

  // Pré-remplissage avec la décision et le retour déjà enregistrés
  useEffect(() => {
    if (submission) {
      setDecision(submission.status === "submitted" ? "under_review" : (submission.status as SubmissionDecision));
      setNote(submission.feedback?.note != null ? String(submission.feedback.note) : "");
      setComment(submission.feedback?.comment ?? "");
    }
  }, [submission?.id]);

  const noteValue = note.trim() === "" ? undefined : Number(note);
  const isNoteInvalid = noteValue !== undefined && (!Number.isInteger(noteValue) || noteValue < 0 || noteValue > 100);

  const handleSubmit = () => {
    if (!submission || isNoteInvalid) return;
    grade.mutate(
      {
        id: submission.id,
        payload: { decision, note: noteValue, comment: comment.trim() || undefined },
      },
      {
        onSuccess: () => {
          toast.success("Travail noté.");
          onClose();
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open={!!submission} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        {submission ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Noter le travail</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{submission.lessonTitle}</span>
                  <InstructorSubmissionBadge status={submission.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Rendu par {submission.studentName}</p>
                {submission.body ? (
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{submission.body}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Décision</Label>
                <Select value={decision} onValueChange={(v) => setDecision(v as SubmissionDecision)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUBMISSION_DECISIONS.map((d) => (
                      <SelectItem key={d} value={d}>{submissionDecisionLabels[d]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gn">Note sur 100 (optionnel)</Label>
                <Input
                  id="gn"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {isNoteInvalid ? (
                  <p className="text-xs text-destructive">La note doit être un entier entre 0 et 100.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gc">Commentaire (optionnel)</Label>
                <Textarea
                  id="gc"
                  rows={4}
                  maxLength={3000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <p className="text-right text-[10px] text-muted-foreground">{comment.length} / 3000</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button variant="accent" disabled={isNoteInvalid || grade.isPending} onClick={handleSubmit}>
                {grade.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Enregistrer
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}