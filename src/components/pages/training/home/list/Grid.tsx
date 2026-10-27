import type { APIInstructorTrainingAssignment } from "@/data/trainings";
import { TrainingCard } from "./Card";

export function TrainingsGrid({ trainings }: { trainings: APIInstructorTrainingAssignment[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {trainings.map((t) => (
        <TrainingCard key={t.assignmentId} training={t} />
      ))}
    </div>
  );
}