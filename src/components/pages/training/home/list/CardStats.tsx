import { MapPin, Users } from "lucide-react";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";

export function TrainingCardStats({ training: t }: { training: APIInstructorTrainingAssignment }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
      <span className="flex items-center gap-1.5">
        <Users className="size-3.5 shrink-0" /> {t.trainingCurrentStudents ?? 0} apprenants
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="size-3.5 shrink-0" /> {t.trainingLocation ?? "À définir"}
      </span>
    </div>
  );
}