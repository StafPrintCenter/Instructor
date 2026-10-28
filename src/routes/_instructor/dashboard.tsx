import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { DashboardActivity, DashboardOverdue, DashboardStats, DashboardTrainingList, DashboardUpcomingSessions, ProgressByTrainingChart, SubmissionsBreakdownChart } from "@/components/pages/dashboard";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/dashboard")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Tableau de bord | ${SITE.name}` },
      { name: "description", content: "Consultez vos formations, les progrès des apprenants, les travaux à corriger et vos prochaines sessions." },
      { property: "og:title", content: `${SITE.tool} - Tableau de bord | ${SITE.name}` },
      { property: "og:description", content: "Retrouvez vos priorités pédagogiques et l'activité de vos formations." },
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
      <DashboardTrainingList />

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