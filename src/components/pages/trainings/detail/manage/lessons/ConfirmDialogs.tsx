import { toast } from "sonner";
import { ConfirmAction, ConfirmDelete } from "@/components/site/InstructorBits";
import type { APIInstructorLesson } from "@/data/content";
import { useDeleteLesson, useSubmitLessonForReview } from "@/stores/useLessonsStore";

interface LessonConfirmProps {
  moduleId: string;
  lesson: APIInstructorLesson | null;
  onClose: () => void;
}

export function DeleteLessonConfirm({ moduleId, lesson, onClose }: LessonConfirmProps) {
  const deleteLesson = useDeleteLesson();

  return (
    <ConfirmDelete
      open={!!lesson}
      onOpenChange={(open) => !open && onClose()}
      title={`Supprimer "${lesson?.title}" ?`}
      onConfirm={async () => {
        if (!lesson) return;
        onClose();
        try {
          await deleteLesson.mutateAsync({ id: lesson.id, moduleId });
          toast.success("Leçon supprimée.");
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
    />
  );
}

export function SubmitLessonConfirm({ moduleId, lesson, onClose }: LessonConfirmProps) {
  const submitLesson = useSubmitLessonForReview();

  return (
    <ConfirmAction
      open={!!lesson}
      onOpenChange={(open) => !open && onClose()}
      title={`Soumettre "${lesson?.title}" à validation ?`}
      description="La leçon passera en attente de validation par l'administrateur."
      confirmLabel="Soumettre"
      onConfirm={async () => {
        if (!lesson) return;
        onClose();
        try {
          await submitLesson.mutateAsync({ id: lesson.id, moduleId });
          toast.success("Leçon soumise à validation.");
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
    />
  );
}