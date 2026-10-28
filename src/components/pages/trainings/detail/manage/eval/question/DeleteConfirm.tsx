import { toast } from "sonner";
import { ConfirmDelete } from "@/components/site/InstructorBits";
import type { APIQuizQuestion } from "@/data/content";
import { useDeleteQuestion } from "@/stores/useQuizzesStore";

interface DeleteQuestionConfirmProps {
  quizId: string;
  question: APIQuizQuestion | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteQuestionConfirm({ quizId, question, onClose, onDeleted }: DeleteQuestionConfirmProps) {
  const deleteQuestion = useDeleteQuestion();

  return (
    <ConfirmDelete
      open={!!question}
      onOpenChange={(open) => !open && onClose()}
      title={`Supprimer la question "${question?.prompt}" ?`}
      onConfirm={async () => {
        if (!question) return;
        onClose();
        try {
          await deleteQuestion.mutateAsync({ id: question.id, quizId });
          toast.success("Question supprimée.");
          onDeleted?.();
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
    />
  );
}