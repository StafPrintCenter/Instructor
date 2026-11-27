import type { QuizMode } from "@/data/content";
import { useQuiz } from "@/stores/useQuizzesStore";
import { QuizActionsBar } from "./ActionsBar";
import { QuizEditorError, QuizEditorSkeleton } from "./EditorStates";
import { QuizQuestionsSection } from "../question/QuizSection";
import { QuizSettingsCard } from "./SettingsCard";
import { QuizSummaryBar } from "./SummaryBar";

interface QuizEditorProps {
  quizId: string;
  moduleId: string;
  mode: QuizMode;
  onDeleted: () => void;
}

export function QuizEditor({ quizId, moduleId, mode, onDeleted }: QuizEditorProps) {
  const { quiz, isLoading, isError, refetch } = useQuiz(quizId);

  if (isLoading) return <QuizEditorSkeleton />;
  if (isError || !quiz) return <QuizEditorError onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <QuizSummaryBar quiz={quiz} />
      <QuizSettingsCard quiz={quiz} mode={mode} />
      <QuizQuestionsSection quiz={quiz} />
      <QuizActionsBar quizId={quiz.id} moduleId={moduleId} onDeleted={onDeleted} />
    </div>
  );
}