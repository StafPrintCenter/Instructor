import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import {
  DashboardActivity,
  DashboardOverdue,
  DashboardStats,
  DashboardTrainings,
  DashboardUpcomingSessions,
  ProgressByTrainingChart,
  SubmissionsBreakdownChart,
} from "@/components/pages/dashboard";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/dashboard")({
  head: () => ({
    meta: [
      { title: `Tableau de bord formateur | ${SITE.name}` },
      {
        name: "description",
        content: "Indicateurs pédagogiques : formations assignées, apprenants, corrections en attente et sessions à venir.",
      },
      { property: "og:title", content: `Tableau de bord formateur | ${SITE.name}` },
      { property: "og:description", content: "Pilotez votre activité pédagogique en un coup d'oeil." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useInstructorAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Espace formateur"
        title={`Bonjour ${user?.firstName ?? ""}`}
        description="Vue d'ensemble de vos formations assignées et de vos priorités du jour."
        actions={
          <Button asChild variant="accent">
            <Link to="/corrections">Corriger maintenant</Link>
          </Button>
        }
      />

      <DashboardStats />
      <DashboardTrainings />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ProgressByTrainingChart />
        <SubmissionsBreakdownChart />
      </div>

      <DashboardUpcomingSessions />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <DashboardActivity />
        <DashboardOverdue />
      </div>
    </div>
  );
}