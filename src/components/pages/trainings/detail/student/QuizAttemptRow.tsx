import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  getQuizAttemptBadgeClass,
  getQuizAttemptStatusLabel,
  type APIInstructorStudentQuizAttempt,
} from "@/data/training-students";
import { formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { QuizAttemptFeedbackCell } from "./QuizAttemptFeedbackCell";

interface QuizAttemptRowProps {
  attempt: APIInstructorStudentQuizAttempt;
  onGiveFeedback: () => void;
}

export function QuizAttemptRow({ attempt: a, onGiveFeedback }: QuizAttemptRowProps) {
  return (
    <TableRow>
      <TableCell className="text-sm font-medium">{a.lessonTitle}</TableCell>
      <TableCell className="text-sm">#{a.attemptNumber}</TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={cn("border font-medium", getQuizAttemptBadgeClass(a.status))}>
            {getQuizAttemptStatusLabel(a.status)}
          </Badge>
          {a.isAutoSubmitted ? <Badge variant="secondary" className="text-[10px]">Auto</Badge> : null}
        </div>
      </TableCell>
      <TableCell className="text-sm">{a.score !== null ? `${a.score}%` : "-"}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDateTime(a.submittedAt)}</TableCell>
      <TableCell className="max-w-xs">
        <QuizAttemptFeedbackCell feedback={a.feedback} onGiveFeedback={onGiveFeedback} />
      </TableCell>
    </TableRow>
  );
}