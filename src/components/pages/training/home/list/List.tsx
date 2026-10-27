import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/instructor/page-header";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { TrainingsGrid } from "./Grid";
import { TrainingsListError, TrainingsListSkeleton } from "./ListStates";

export function TrainingsList() {
  const { items: trainings, isLoading, isError, refetch } = useInstructorTrainingsList();

  if (isLoading) return <TrainingsListSkeleton />;
  if (isError) return <TrainingsListError onRetry={() => refetch()} />;

  if (trainings.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="size-6" />}
        title="Aucune formation assignée"
        description="Contactez l'administration pour être assigné·e à une cohorte."
      />
    );
  }

  return <TrainingsGrid trainings={trainings} />;
}