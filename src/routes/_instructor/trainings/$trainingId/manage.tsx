import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/shared";
import { ManageHeader, ManageSkeleton, ModuleCard } from "@/components/pages/trainings/detail/manage";
import { useModulesList } from "@/stores/useModulesStore";
import { useLessonsByModules } from "@/stores/useLessonsStore";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/manage")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Contenu de la formation | ${SITE.name}` },
      { name: "description", content: "Organisez les modules, les leçons, les quiz et les exercices de votre formation." },
      { property: "og:title", content: `${SITE.tool} - Contenu de la formation | ${SITE.name}` },
      { property: "og:description", content: "Préparez les ressources pédagogiques de votre formation." },
    ],
  }),
  component: ContentPage,
});

function ContentPage() {
  const { trainingId } = Route.useParams();

  const { overview, isLoading: isOverviewLoading } = useInstructorTrainingOverview(trainingId);
  useDynamicPageMetadata(
    overview ? `${SITE.tool} - Contenu : ${overview.data.title} | ${SITE.name}` : undefined,
    overview ? `Organisez les modules, les leçons, les quiz et les exercices de la formation ${overview.data.title}.` : undefined,
  );
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
