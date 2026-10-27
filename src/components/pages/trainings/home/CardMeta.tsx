import { MapPin, Users, Calendar, CalendarPlus } from "lucide-react";
import { TrainingInstructorsSummary } from "@/components/pages/training/home";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";
import { formatDate } from "@/lib/api";

export function TrainingCardMeta({ training: t }: { training: APIInstructorTrainingAssignment }) {
  const hasPeriod = !!t.trainingStartDate && !!t.trainingEndDate;

  // Rien à afficher : on évite une ligne vide avec sa bordure
  if (!t.assignedAt && !hasPeriod) return null;

  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      {/*Apprenants & Localisation */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5 shrink-0" />
          {t.trainingCurrentStudents ?? 0} apprenants
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {t.trainingLocation ?? "À définir"}
        </span>
      </div>

      {/* Assignation & Période */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-border/40 pt-2">
        {t.assignedAt ? (
          <span className="flex items-center gap-1.5 text-muted-foreground/80">
            <CalendarPlus className="size-3.5 shrink-0" />
            Assigné le {formatDate(t.assignedAt)}
          </span>
        ) : null}
        {hasPeriod ? (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            du {formatDate(t.trainingStartDate!)}
            au {formatDate(t.trainingEndDate!)}
          </span>
        ) : null}
      </div>

      {/* Formateurs */}
      <TrainingInstructorsSummary
        trainingId={t.trainingId}
        trainingTitle={t.trainingTitle}
        instructors={t.instructors}
      />
    </div>
  );
}