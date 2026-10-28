import { createFileRoute } from "@tanstack/react-router";
import { TrainingDetailSkeleton, TrainingDetailHero, TrainingDetailMetrics, TrainingDetailObjectives, TrainingSessionsSection, TrainingStudentsTable, TrainingInstructorsCard } from "@/components/pages/trainings/detail/home";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/")({
  head: ({ params }) => ({
    meta: [
      { title: `${SITE.tool} - Formation ${params.trainingId} | ${SITE.name}` },
      { name: "description", content: `Consultez les sessions, les apprenants inscrits et l'avancement de la formation ${params.trainingId}.` },
      { property: "og:title", content: `${SITE.tool} - Formation ${params.trainingId} | ${SITE.name}` },
      { property: "og:description", content: `Suivez les sessions et la progression des apprenants de la formation ${params.trainingId}.` },
    ],
  }),
  component: TrainingDetail,
});

function TrainingDetail() {
  const { trainingId } = Route.useParams();
  const { overview, isLoading } = useInstructorTrainingOverview(trainingId);

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