import { createFileRoute } from "@tanstack/react-router";
import { TrainingDetailSkeleton, TrainingDetailHero, TrainingDetailMetrics, TrainingDetailObjectives, TrainingSessionsSection, TrainingStudentsTable, TrainingInstructorsCard } from "@/components/pages/trainings/detail/home";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Détail d'une formation | ${SITE.name}` },
      { name: "description", content: "Consultez les sessions, les apprenants inscrits et l'avancement de la formation." },
    ],
  }),
  component: TrainingDetail,
});

function TrainingDetail() {
  const { trainingId } = Route.useParams();
  const { overview, isLoading } = useInstructorTrainingOverview(trainingId);
  useDynamicPageMetadata(
    overview ? `${SITE.tool} - ${overview.data.title} | ${SITE.name}` : undefined,
    overview ? `Suivez les sessions, les apprenants et l'avancement de la formation ${overview.data.title}.` : undefined,
  );

  if (isLoading || !overview) return <TrainingDetailSkeleton />;

  const { data: training, students, averageProgress, progressTrackingAvailable } = overview;
  const mainColor = training.coverColor || "var(--primary)";

  return (
    <div className="space-y-8">
      <TrainingDetailHero
        training={training}
        trainingId={trainingId}
        mainColor={mainColor}
      />

      <TrainingDetailMetrics
        training={training}
        averageProgress={averageProgress}
        progressTrackingAvailable={progressTrackingAvailable}
      />

      <TrainingDetailObjectives
        training={training}
        mainColor={mainColor}
      />

      <TrainingInstructorsCard
        instructors={training.instructors}
        mainColor={mainColor}
      />

      <TrainingSessionsSection
        trainingId={trainingId}
        mainColor={mainColor}
      />

      <TrainingStudentsTable
        trainingId={trainingId}
        students={students}
        mainColor={mainColor}
      />
    </div>
  );
}