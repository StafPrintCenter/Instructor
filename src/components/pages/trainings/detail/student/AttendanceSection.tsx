import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAttendanceStatusBadgeClass, getAttendanceStatusLabel } from "@/data/attendance";
import type { APIInstructorStudentOverview, APIInstructorStudentAttendanceEntry } from "@/data/training-students";
import { formatDate, formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { FollowUpCard } from "./FollowUpCard";

function AttendanceEntry({ entry }: { entry: APIInstructorStudentAttendanceEntry }) {
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

interface AttendanceSectionProps {
  attendance: APIInstructorStudentOverview["attendance"];
  onMark: () => void;
}

export function AttendanceSection({ attendance, onMark }: AttendanceSectionProps) {
  return (
    <FollowUpCard
      title={`Assiduité (${attendance.data.length})`}
      action={
        <Button size="sm" variant="outline" onClick={onMark}>
          <CalendarCheck className="size-4" /> Marquer
        </Button>
      }
    >
      {attendance.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune séance renseignée pour cet apprenant.</p>
      ) : (
        <ul className="space-y-2">
          {attendance.data.map((entry) => (
            <AttendanceEntry key={`${entry.date}-${entry.markedAt}`} entry={entry} />
          ))}
        </ul>
      )}
    </FollowUpCard>
  );
}