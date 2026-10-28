import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmAction, ConfirmDelete } from "@/components/site/InstructorBits";
import { useInvalidateLessons } from "@/stores/useLessonsStore";
import { useDeleteQuiz, useSubmitQuizForReview } from "@/stores/useQuizzesStore";

interface QuizActionsBarProps {
  quizId: string;
  moduleId: string;
  /** Appelé après la suppression de l'évaluation */
  onDeleted: () => void;
}

/** Actions globales du quiz : supprimer (questions incluses) / soumettre à validation */
export function QuizActionsBar({ quizId, moduleId, onDeleted }: QuizActionsBarProps) {
  const deleteQuiz = useDeleteQuiz();
  const submitQuiz = useSubmitQuizForReview();
  const invalidateLessons = useInvalidateLessons();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between border-t pt-4">
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" /> Supprimer l'évaluation
        </Button>
        <Button variant="soft" onClick={() => setSubmitOpen(true)}>
          <Send className="size-4" /> Soumettre à validation
        </Button>
      </div>

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer cette évaluation (questions incluses) ?"
        onConfirm={async () => {
          setDeleteOpen(false);
          try {
            await deleteQuiz.mutateAsync(quizId);
            toast.success("Évaluation supprimée.");
            invalidateLessons(moduleId);
            onDeleted();
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />

      <ConfirmAction
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        title="Soumettre cette évaluation à validation ?"
        description="L'évaluation passera en attente de validation par l'administrateur."
        confirmLabel="Soumettre"
        onConfirm={async () => {
          setSubmitOpen(false);
          try {
            await submitQuiz.mutateAsync(quizId);
            toast.success("Évaluation soumise à validation.");
          } catch (e) {
            toast.error((e as Error).message);
          }
        }}
      />
    </>
  );
}