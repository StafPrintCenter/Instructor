import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import { TrainingsListItem } from "@/components/pages/trainings/home";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/")({
  head: () => ({
    meta: [
      { title: `Mes formations assignées | ${SITE.name}` },
      { name: "description", content: "Consultez les formations où vous êtes assigné·e comme formateur et suivez leur avancement." },
      { property: "og:title", content: `Mes formations assignées | ${SITE.name}` },
      { property: "og:description", content: "Cohortes, dates, apprenants inscrits et avancement global." },
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
