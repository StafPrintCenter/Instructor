import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { APIInstructorLesson } from "@/data/content";
import { useUpdateLesson } from "@/stores/useLessonsStore";
import { LessonFields } from "./Fields";
import { toLessonPayload, type LessonFormValues } from "./Config";

interface LessonEditorProps {
  moduleId: string;
  lesson: APIInstructorLesson;
  onSaved: () => void;
}

export function LessonEditor({ moduleId, lesson, onSaved }: LessonEditorProps) {
  const updateLesson = useUpdateLesson();
  const [draft, setDraft] = useState<LessonFormValues>({
    title: lesson.title,
    duration_minutes: Number(lesson.durationMinutes ?? 0),
    kind: lesson.kind,
    video_url: lesson.videoUrl ?? "",
    content: lesson.content ?? "",
    brief: lesson.brief ?? "",
    is_mandatory: lesson.isMandatory,
    chapters: lesson.chapters ?? [],
  });

  const save = () =>
    updateLesson.mutate(
      { id: lesson.id, moduleId, payload: toLessonPayload(draft) },
      {
        onSuccess: () => {
          toast.success("Leçon enregistrée en brouillon.");
          onSaved();
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <div className="space-y-5">
      <LessonFields mode="edit" idPrefix="le" values={draft} onChange={setDraft} />

      <div className="flex justify-end gap-2">
        <Button variant="accent" onClick={save} disabled={updateLesson.isPending}>
          {updateLesson.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}