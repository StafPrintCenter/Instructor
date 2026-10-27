import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useDashboardStudents, useDashboardTrainings } from "@/hooks/useDashboardData";
import { DashboardListError } from "./CardState";
import { DashboardTrainingCard } from "./TrainingCard";

const COLLAPSED_COUNT = 3;

export function DashboardTrainings() {
  const { trainings, isLoading, isError, refetch } = useDashboardTrainings();
  const { summary, isLoading: studentsLoading } = useDashboardStudents();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? trainings : trainings.slice(0, COLLAPSED_COUNT);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Mes formations assignées</h2>
          <p className="text-sm text-muted-foreground">
            {trainings.length} formation(s) sous votre responsabilité.
          </p>
        </div>
        {trainings.length > COLLAPSED_COUNT ? (
          <Button variant="ghost" size="sm" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Voir moins" : `Voir plus (${trainings.length - COLLAPSED_COUNT})`}
          </Button>
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link to="/trainings">
              Toutes les formations <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-56 animate-pulse rounded-lg bg-muted" />
          <div className="h-56 animate-pulse rounded-lg bg-muted" />
          <div className="h-56 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : isError ? (
        <DashboardListError message="Impossible de charger vos formations." onRetry={() => refetch()} />
      ) : trainings.length === 0 ? (
        <EmptyState icon={<BookOpen className="size-6" />} title="Aucune formation assignée" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((t) => {
            const stats = summary.byTraining[t.trainingId];
            return (
              <DashboardTrainingCard
                key={t.assignmentId}
                training={t}
                learners={stats?.learners ?? t.trainingCurrentStudents ?? 0}
                progress={studentsLoading ? null : (stats?.progress ?? 0)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}