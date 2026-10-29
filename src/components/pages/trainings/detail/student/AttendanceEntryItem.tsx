import { Badge } from "@/components/ui/badge";
import { getAttendanceStatusBadgeClass, getAttendanceStatusLabel } from "@/data/attendance";
import type { APIInstructorStudentAttendanceEntry } from "@/data/training-students";
import { formatDate, formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";

export function AttendanceEntryItem({ entry }: { entry: APIInstructorStudentAttendanceEntry }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2">
      <span className="text-sm font-medium">{formatDate(entry.date)}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Renseignée le {formatDateTime(entry.markedAt)}</span>
        <Badge variant="outline" className={cn("border font-medium", getAttendanceStatusBadgeClass(entry.status))}>
          {getAttendanceStatusLabel(entry.status)}
        </Badge>
      </div>
    </li>
  );
}