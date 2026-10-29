import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import { lessonKindLabels } from "@/data/content";
import {
  getLessonProgressBadgeClass,
  getLessonProgressLabel,
  type APIInstructorStudentLessonProgress,
} from "@/data/training-students";
import { formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";

export function LessonProgressRow({ lesson: l }: { lesson: APIInstructorStudentLessonProgress }) {
  const showRatio = l.status === "in_progress" && l.completionRatio > 0;

  return (
    <TableRow>
      <TableCell className="text-sm font-medium">{l.lessonTitle}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{lessonKindLabels[l.kind] ?? l.kind}</TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("border font-medium", getLessonProgressBadgeClass(l.status))}>
          {getLessonProgressLabel(l.status)}
        </Badge>
      </TableCell>
      <TableCell className="min-w-28">
        {showRatio ? (
          <div className="space-y-1">
            <span className="text-xs font-medium">{Math.round(l.completionRatio)}%</span>
            <Progress value={l.completionRatio} className="h-1.5" />
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-sm">{l.bestScore !== null ? `${l.bestScore}%` : "-"}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDateTime(l.lastActivityAt)}</TableCell>
    </TableRow>
  );
}