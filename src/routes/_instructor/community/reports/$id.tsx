import { createFileRoute } from "@tanstack/react-router";
import { ReportDetailPage } from "@/components/pages/community/reports";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/reports/$id")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Signalement de la Communauté | ${SITE.name}` },
      { name: "description", content: "Détail d'un contenu signalé et décision de modération." },
    ],
  }),
  component: ReportRoute,
});

function ReportRoute() {
  const { id } = Route.useParams();
  return <ReportDetailPage reportId={id} />;
}