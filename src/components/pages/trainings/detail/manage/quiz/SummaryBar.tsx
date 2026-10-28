import { ContentStatusBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { quizModeLabels, type APIQuiz } from "@/data/content";

export function QuizSummaryBar({ quiz }: { quiz: APIQuiz }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ContentStatusBadge status={quiz.status} />
      <Badge variant="secondary">{quizModeLabels[quiz.mode]}</Badge>
      <span className="text-xs text-muted-foreground">
        {quiz.totalPoints} points au total · {quiz.questionsCount} question{quiz.questionsCount > 1 ? "s" : ""}
      </span>
    </div>
  );
}