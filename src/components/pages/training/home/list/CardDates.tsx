import { Calendar, CalendarPlus } from "lucide-react";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";
import { formatDate } from "@/lib/api";

export function TrainingCardDates({ training: t }: { training: APIInstructorTrainingAssignment }) {
  const hasPeriod = !!t.trainingStartDate && !!t.trainingEndDate;

  // Rien à afficher : on évite une ligne vide avec sa bordure
  if (!t.assignedAt && !hasPeriod) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-border/40 pt-2">
      {t.assignedAt ? (
        <span className="flex items-center gap-1.5 text-muted-foreground/80">
          <CalendarPlus className="size-3.5 shrink-0" /> Assigné le {formatDate(t.assignedAt)}
        </span>
      ) : null}
      {hasPeriod ? (
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" /> Du {formatDate(t.trainingStartDate!)} au {formatDate(t.trainingEndDate!)}
        </span>
      ) : null}
    </div>
  );
}