import { TrainingInstructorsSummary } from "@/components/pages/training/home";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";
import { TrainingCardDates } from "./CardDates";
import { TrainingCardStats } from "./CardStats";

export function TrainingCardMeta({ training: t }: { training: APIInstructorTrainingAssignment }) {
  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      {/* Ligne 1 : Apprenants & Localisation */}
      <TrainingCardStats training={t} />

      {/* Ligne 2 : Assignation & Période */}
      <TrainingCardDates training={t} />

      {/* Ligne 3 : Formateurs */}
      <TrainingInstructorsSummary trainingId={t.trainingId} trainingTitle={t.trainingTitle} instructors={t.instructors} />
    </div>
  );
}