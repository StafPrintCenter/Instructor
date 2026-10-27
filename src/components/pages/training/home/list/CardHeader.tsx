import { Badge } from "@/components/ui/badge";
import {
  getTrainingLevelBadgeClass, getInstructorRoleConfig, getTrainingStatusBadgeClass, getTrainingStatusLabel,
  type APIInstructorTrainingAssignment,
} from "@/data/trainings";
import { cn } from "@/lib/utils";

export function TrainingCardHeader({ training: t }: { training: APIInstructorTrainingAssignment }) {
  const roleConfig = getInstructorRoleConfig(t.role);

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{t.trainingTheme}</Badge>
          <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
          <Badge variant="outline" className={cn("border font-medium", getTrainingStatusBadgeClass(t.trainingStatus))}>
            {getTrainingStatusLabel(t.trainingStatus)}
          </Badge>
        </div>

        <h2 className="font-display text-xl leading-snug">{t.trainingTitle}</h2>
      </div>
      <Badge variant="outline" className={cn("border font-medium shrink-0", getTrainingLevelBadgeClass(t.trainingLevel))}>
        {t.trainingLevel}
      </Badge>
    </div>
  );
}