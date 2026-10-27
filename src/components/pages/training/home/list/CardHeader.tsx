import { Badge } from "@/components/ui/badge";
import { getTrainingLevelBadgeClass, type APIInstructorTrainingAssignment } from "@/data/trainings";
import { cn } from "@/lib/utils";
import { TrainingCardBadges } from "./CardBadges";

export function TrainingCardHeader({ training: t }: { training: APIInstructorTrainingAssignment }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <TrainingCardBadges training={t} />
        <h2 className="font-display text-xl leading-snug">{t.trainingTitle}</h2>
      </div>
      <Badge variant="outline" className={cn("border font-medium shrink-0", getTrainingLevelBadgeClass(t.trainingLevel))}>
        {t.trainingLevel}
      </Badge>
    </div>
  );
}