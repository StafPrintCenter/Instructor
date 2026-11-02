import { createFileRoute } from "@tanstack/react-router";
import { ReportDetailPage } from "@/components/pages/community/reports";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/community/reports/$id")({
  head: () => ({
    meta: [
      { title: `Signalement | Communauté | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Détail d'un contenu signalé et décision de modération." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportRoute,
});

function ReportRoute() {
  const { id } = Route.useParams();
  return <ReportDetailPage reportId={id} />;
}