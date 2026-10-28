import { useEffect, useState } from "react";
import { useInvalidateLessons } from "@/stores/useLessonsStore";
import { QuizCreateForm } from "../eval/quiz/CreateForm";
import { QuizEditor } from "../eval/quiz/Editor";

interface QuizManagerProps {
  lessonId: string;
  moduleId: string;
  quizId: string | null;
}

/**
 * Point d'entrée : gère la bascule création ↔ édition en interne, sans jamais
 * dépendre d'une fermeture/réouverture du dialog parent. Une fois un quiz créé
 * dans cette session (ou déjà existant via la prop quizId), on reste sur
 * QuizEditor pour permettre d'ajouter des questions immédiatement.
 */
export function QuizManager({ lessonId, moduleId, quizId }: QuizManagerProps) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(quizId);
  const invalidateLessons = useInvalidateLessons();

  // Resynchronise si le dialog est réutilisé pour une autre leçon.
  useEffect(() => {
    setActiveQuizId(quizId);
  }, [quizId]);

  if (!activeQuizId) {
    return (
      <QuizCreateForm
        lessonId={lessonId}
        onCreated={(id) => {
          invalidateLessons(moduleId);
          setActiveQuizId(id);
        }}
      />
    );
  }

  // Après suppression de l'évaluation, on revient au formulaire de création
  return <QuizEditor quizId={activeQuizId} moduleId={moduleId} onDeleted={() => setActiveQuizId(null)} />;
}