import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { APIInstructorStudentQuizAttempt } from "@/data/training-students";
import { cn } from "@/lib/utils";

interface QuizAttemptFeedbackCellProps {
  feedback: APIInstructorStudentQuizAttempt["feedback"];
  onGiveFeedback: () => void;
}

export function QuizAttemptFeedbackCell({ feedback, onGiveFeedback }: QuizAttemptFeedbackCellProps) {
  if (!feedback) {
    return (
      <Button size="sm" variant="outline" onClick={onGiveFeedback}>
        <MessageSquare className="size-4" /> Feedback
      </Button>
    );
  }

  return (
    <div className="space-y-1">
      <p className="whitespace-pre-wrap text-xs text-muted-foreground">{feedback.comment}</p>
      <Badge
        variant="outline"
        className={cn(
          "border text-[10px] font-medium",
          feedback.validated
            ? "bg-success/15 text-success border-success/30"
            : "bg-muted text-muted-foreground border-transparent"
        )}
      >
        {feedback.validated ? "Validée" : "Non validée"}
      </Badge>
    </div>
  );
}