import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared";
import { ManageHeader, ManageSkeleton, ModuleCard } from "@/components/pages/trainings/detail/manage";
import { useModulesList } from "@/stores/useModulesStore";
import { useLessonsByModules } from "@/stores/useLessonsStore";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/manage")({
  head: ({ params }) => ({
    meta: [
      { title: `${SITE.tool} - Contenu de la formation ${params.trainingId} | ${SITE.name}` },
      { name: "description", content: `Organisez les modules, les leçons, les quiz et les exercices de la formation ${params.trainingId}, puis soumettez-les à validation.` },
      { property: "og:title", content: `${SITE.tool} - Contenu de la formation ${params.trainingId} | ${SITE.name}` },
      { property: "og:description", content: `Préparez les ressources pédagogiques de la formation ${params.trainingId}.` },
    ],
  }),
  component: ContentPage,
});

function ContentPage() {
  const { trainingId } = Route.useParams();

  const { overview, isLoading: isOverviewLoading } = useInstructorTrainingOverview(trainingId);
  const { modules, isLoading: isModulesLoading } = useModulesList(trainingId);
  const { lessonsByModule, isLoading: isLessonsLoading } = useLessonsByModules(modules.map((m) => m.id));

  if (isOverviewLoading || isModulesLoading || !overview) return <ManageSkeleton />;

  return (
    <div className="space-y-8">
      <ManageHeader
        training={overview.data}
        trainingId={trainingId}
        modulesCount={modules.length}
      />

      {modules.length === 0 ?
        <EmptyState
          title="Aucun module"
          description="Commencez par créer un module."
        />
        : null}

      <div className="space-y-4">
        {modules.map((m, index) => (
          <ModuleCard
            key={m.id}
            trainingId={trainingId}
            module={m}
            index={index}
            lessons={lessonsByModule[m.id] ?? []}
            isLessonsLoading={isLessonsLoading}
          />
        ))}
      </div>
    </div>
  );
}
