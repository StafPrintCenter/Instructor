import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import { TrainingsListItem } from "@/components/pages/trainings/home";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Mes formations | ${SITE.name}` },
      { name: "description", content: "Consultez vos formations assignées, leurs dates, leurs cohortes et l'avancement des apprenants." },
    ],
  }),
  component: TrainingsPage,
});

function TrainingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pédagogie"
        title="Mes formations assignées"
        description="Seul l'administrateur crée les formations ; vous en remplissez le contenu pédagogique."
      />

      <TrainingsListItem />
    </div>
  );
}
