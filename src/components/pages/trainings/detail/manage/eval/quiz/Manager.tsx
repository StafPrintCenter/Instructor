import { useEffect, useState } from "react";
import type { QuizMode } from "@/data/content";
import { useInvalidateLessons } from "@/stores/useLessonsStore";
import { QuizCreateForm } from "./CreateForm";
import { QuizEditor } from "./Editor";

interface QuizManagerProps {
  lessonId: string;
  moduleId: string;
  quizId: string | null;
  mode: QuizMode;
}

/**
 * Point d'entrée : gère la bascule création ↔ édition en interne, sans jamais
 * dépendre d'une fermeture/réouverture du dialog parent. Une fois un quiz créé
 * dans cette session (ou déjà existant via la prop quizId), on reste sur
 * QuizEditor pour permettre d'ajouter des questions immédiatement.
 */
export function QuizManager({ lessonId, moduleId, quizId, mode }: QuizManagerProps) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(quizId);
  const invalidateLessons = useInvalidateLessons();

  // Resynchronise si le dialog est réutilisé pour une autre leçon.
  useEffect(() => {
    setActiveQuizId(quizId);
  }, [lessonId, quizId]);

  if (!activeQuizId) {
    return (
      <QuizCreateForm
        key={`${lessonId}-${mode}`}
        lessonId={lessonId}
        mode={mode}
        onCreated={(id) => {
          invalidateLessons(moduleId);
          setActiveQuizId(id);
        }}
      />
    );
  }

  // Après suppression de l'évaluation, on revient au formulaire de création
  return <QuizEditor quizId={activeQuizId} moduleId={moduleId} mode={mode} onDeleted={() => setActiveQuizId(null)} />;
}