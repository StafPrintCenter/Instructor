import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { APIInstructorLesson } from "@/data/content";
import { LessonEditor } from "./LessonEditor";

interface EditLessonDialogProps {
  moduleId: string;
  /** null = dialog fermé */
  lesson: APIInstructorLesson | null;
  onClose: () => void;
}

export function EditLessonDialog({ moduleId, lesson, onClose }: EditLessonDialogProps) {
  return (
    <Dialog open={!!lesson} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">{lesson?.title}</DialogTitle>
        </DialogHeader>
        {lesson ? <LessonEditor key={lesson.id} moduleId={moduleId} lesson={lesson} onSaved={onClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}