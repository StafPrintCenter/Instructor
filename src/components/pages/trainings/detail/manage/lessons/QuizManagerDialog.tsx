import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuizManager } from "@/components/pages/trainings/detail/manage/eval/quiz/Manager";
import type { APIInstructorLesson } from "@/data/content";

interface QuizManagerDialogProps {
  moduleId: string;
  lesson: APIInstructorLesson | null;
  onClose: () => void;
}

/** Gestion de l'évaluation (quiz / exercice) - création ET édition passent par ce même dialog */
export function QuizManagerDialog({ moduleId, lesson, onClose }: QuizManagerDialogProps) {
  return (
    <Dialog open={!!lesson} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {lesson?.quizId ? "Gérer l'évaluation" : "Créer une évaluation"} - {lesson?.title}
          </DialogTitle>
        </DialogHeader>
        {lesson ? <QuizManager lessonId={lesson.id} moduleId={moduleId} quizId={lesson.quizId} /> : null}
      </DialogContent>
    </Dialog>
  );
}