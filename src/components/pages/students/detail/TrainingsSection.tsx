import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/shared";
import type { APIInstructorStudentTrainingFollowUp } from "@/data/students";
import { StudentTrainingCard } from "./TrainingCard";

interface StudentTrainingsSectionProps {
  trainings: APIInstructorStudentTrainingFollowUp[];
  studentId: string;
}

export function StudentTrainingsSection({ trainings, studentId }: StudentTrainingsSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl">Formations ({trainings.length})</h2>
      {trainings.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="size-6" />}
          title="Aucune formation"
          description="Cet apprenant n'est inscrit à aucune de vos formations."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {trainings.map((t) => (
            <StudentTrainingCard
              key={t.trainingId}
              training={t}
              studentId={studentId}
            />
          ))}
        </div>
      )}
    </section>
  );
}