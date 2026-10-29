import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APIInstructorStudentOverview } from "@/data/training-students";
import { AttendanceEntryItem } from "./AttendanceEntryItem";
import { FollowUpCard } from "./FollowUpCard";

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
            <AttendanceEntryItem key={`${entry.date}-${entry.markedAt}`} entry={entry} />
          ))}
        </ul>
      )}
    </FollowUpCard>
  );
}