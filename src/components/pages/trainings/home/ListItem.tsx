import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { TrainingCardActions, TrainingCardHeader, TrainingCardMeta, TrainingsListError, TrainingsListSkeleton } from "./";

export function TrainingsListItem() {
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

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {trainings.map((t) => (
        <Card className="overflow-hidden border-border/70 transition-shadow hover:shadow-(--shadow-lift)">
          <div className="h-1.5 w-full"
            style={{ backgroundColor: t.trainingCoverColor || "var(--primary)" }}
          />

          <CardContent className="space-y-4 p-5">
            <TrainingCardHeader training={t} />
            <p className="text-sm text-muted-foreground">{t.trainingShort}</p>
            <TrainingCardMeta training={t} />
            <TrainingCardActions trainingId={t.trainingId} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}