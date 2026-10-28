import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared";
import { ManageHeader, ManageSkeleton } from "@/components/pages/trainings/detail/manage/layout";
import { ModuleCard } from "@/components/pages/trainings/detail/manage/modules";
import { useModulesList } from "@/stores/useModulesStore";
import { useLessonsByModules } from "@/stores/useLessonsStore";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/manage")({
  head: () => ({
    meta: [
      { title: `Contenu de la formation - Espace Formateur ${SITE.name}` },
      { name: "description", content: "Créez et organisez modules, leçons, quiz et exercices, puis soumettez-les à validation administrateur." },
      { property: "og:title", content: `Contenu de la formation - Espace Formateur ${SITE.name}` },
      { property: "og:description", content: "Créez et organisez modules, leçons, quiz et exercices, puis soumettez-les à validation administrateur." },
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
