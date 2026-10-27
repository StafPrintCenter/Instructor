import { Badge } from "@/components/ui/badge";
import type { APIInstructorSubmissionFeedbackEntry } from "@/data/submissions";
import { formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";

interface FeedbackItemProps {
  feedback: APIInstructorSubmissionFeedbackEntry;
  isLatest?: boolean;
}

export function FeedbackItem({ feedback: f, isLatest }: FeedbackItemProps) {
  return (
    <li className="space-y-1.5 rounded-lg border border-border/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {formatDateTime(f.gradedAt)} · {f.instructorName}
          {isLatest ? <span className="ml-2 font-medium text-foreground">Dernière correction</span> : null}
        </span>
        <div className="flex items-center gap-1.5">
          {f.note !== null ? <Badge variant="secondary">{f.note}/100</Badge> : null}
          <Badge
            variant="outline"
            className={cn(
              "border text-[10px] font-medium",
              f.validated
                ? "bg-success/15 text-success border-success/30"
                : "bg-muted text-muted-foreground border-transparent"
            )}
          >
            {f.validated ? "Validé" : "Non validé"}
          </Badge>
        </div>
      </div>
      {f.comment ? <p className="whitespace-pre-wrap text-sm text-muted-foreground">{f.comment}</p> : null}
    </li>
  );
}