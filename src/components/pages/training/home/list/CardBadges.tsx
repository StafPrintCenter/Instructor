import { Badge } from "@/components/ui/badge";
import {
  getInstructorRoleConfig,
  getTrainingStatusBadgeClass,
  getTrainingStatusLabel,
  type APIInstructorTrainingAssignment,
} from "@/data/trainings";
import { cn } from "@/lib/utils";

export function TrainingCardBadges({ training: t }: { training: APIInstructorTrainingAssignment }) {
  const roleConfig = getInstructorRoleConfig(t.role);

  return (
    <div className="mb-2 flex flex-wrap items-center gap-1.5">
      <Badge variant="outline">{t.trainingTheme}</Badge>
      <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
      <Badge variant="outline" className={cn("border font-medium", getTrainingStatusBadgeClass(t.trainingStatus))}>
        {getTrainingStatusLabel(t.trainingStatus)}
      </Badge>
    </div>
  );
}