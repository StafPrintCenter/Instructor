import { useState } from "react";
import type { APIInstructorLesson } from "@/data/content";
import {
  CreateLessonDialog,
  DeleteLessonConfirm,
  EditLessonDialog,
  LessonRow,
  QUIZ_ALLOWED_KINDS,
  QuizManagerDialog,
  SubmitLessonConfirm,
} from "../lessons";

interface ModuleLessonsProps {
  moduleId: string;
  lessons: APIInstructorLesson[];
  isLoading: boolean;
}

export function ModuleLessons({ moduleId, lessons, isLoading }: ModuleLessonsProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<APIInstructorLesson | null>(null);
  const [toDelete, setToDelete] = useState<APIInstructorLesson | null>(null);
  const [toSubmit, setToSubmit] = useState<APIInstructorLesson | null>(null);
  const [quizTarget, setQuizTarget] = useState<APIInstructorLesson | null>(null);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
          <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
        </div>
      ) : lessons.length > 0 ? (
        <div className="space-y-2">
          {lessons.map((l) => (
            <LessonRow
              key={l.id}
              lesson={l}
              isOpen={expanded.has(l.id)}
              onToggle={() => toggle(l.id)}
              onEdit={() => setEditing(l)}
              onSubmit={() => setToSubmit(l)}
              onDelete={() => setToDelete(l)}
              onManageQuiz={QUIZ_ALLOWED_KINDS.includes(l.kind) ? () => setQuizTarget(l) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
          Aucune leçon dans ce module. Cliquez ci-dessous pour en ajouter une.
        </div>
      )}

      <CreateLessonDialog moduleId={moduleId} nextSortOrder={lessons.length} />

      <EditLessonDialog moduleId={moduleId} lesson={editing} onClose={() => setEditing(null)} />
      <QuizManagerDialog moduleId={moduleId} lesson={quizTarget} onClose={() => setQuizTarget(null)} />
      <DeleteLessonConfirm moduleId={moduleId} lesson={toDelete} onClose={() => setToDelete(null)} />
      <SubmitLessonConfirm moduleId={moduleId} lesson={toSubmit} onClose={() => setToSubmit(null)} />
    </>
  );
}