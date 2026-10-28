import { useQuiz } from "@/stores/useQuizzesStore";
import { QuizActionsBar } from "./ActionsBar";
import { QuizEditorError, QuizEditorSkeleton } from "./EditorStates";
import { QuizQuestionsSection } from "../../quiz/QuizQuestionsSection";
import { QuizSettingsCard } from "./SettingsCard";
import { QuizSummaryBar } from "./SummaryBar";

interface QuizEditorProps {
  quizId: string;
  moduleId: string;
  onDeleted: () => void;
}

export function QuizEditor({ quizId, moduleId, onDeleted }: QuizEditorProps) {
  const { quiz, isLoading, isError, refetch } = useQuiz(quizId);

  if (isLoading) return <QuizEditorSkeleton />;
  if (isError || !quiz) return <QuizEditorError onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <QuizSummaryBar quiz={quiz} />
      <QuizSettingsCard quiz={quiz} />
      <QuizQuestionsSection quiz={quiz} />
      <QuizActionsBar quizId={quiz.id} moduleId={moduleId} onDeleted={onDeleted} />
    </div>
  );
}