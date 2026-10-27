import { BookOpen, CalendarDays, ClipboardCheck, Gauge, Users } from "lucide-react";
import { StatCard } from "@/components/site";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DASHBOARD_STUDENTS_PAGE_SIZE, OVERDUE_AFTER_DAYS } from "@/lib/dashboard";
import {
  useDashboardCorrections,
  useDashboardOverdue,
  useDashboardStudents,
  useDashboardTrainings,
  useDashboardUpcomingSessions,
} from "@/hooks/useDashboardData";

const PLACEHOLDER = "...";

export function DashboardStats() {
  const { trainings, isLoading: trainingsLoading } = useDashboardTrainings();
  const { total: studentsTotal, summary, isTruncated, isLoading: studentsLoading } = useDashboardStudents();
  const { stats, isLoading: correctionsLoading } = useDashboardCorrections();
  const { overdueCount } = useDashboardOverdue();
  const { total: upcomingTotal, isLoading: sessionsLoading } = useDashboardUpcomingSessions();

  const average = summary.averageProgress;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Formations assignées"
        value={trainingsLoading ? PLACEHOLDER : trainings.length}
        icon={<BookOpen className="size-5" />}
        hint="Assignées par l'administration"
      />
      <StatCard
        label="Apprenants"
        value={studentsLoading ? PLACEHOLDER : studentsTotal}
        icon={<Users className="size-5" />}
        tone="accent"
        hint="Inscrits à vos formations"
      />
      <StatCard
        label="Travaux à corriger"
        value={correctionsLoading ? PLACEHOLDER : (stats?.pending ?? 0)}
        icon={<ClipboardCheck className="size-5" />}
        tone="warning"
        hint={`${overdueCount} en retard (plus de ${OVERDUE_AFTER_DAYS} jours)`}
      />
      <StatCard
        label="Progression moyenne"
        value={studentsLoading || average === null ? PLACEHOLDER : `${average}%`}
        icon={<Gauge className="size-5" />}
        tone="success"
        hint={isTruncated ? `Sur les ${DASHBOARD_STUDENTS_PAGE_SIZE} premiers apprenants` : undefined}
      />
      <StatCard
        label="Prochaines sessions"
        value={sessionsLoading ? PLACEHOLDER : upcomingTotal}
        icon={<CalendarDays className="size-5" />}
      />
      <Card className="border-border/70">
        <CardContent className="space-y-3 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Complétion globale</p>
          <Progress value={average ?? 0} />
          <p className="text-xs text-muted-foreground">
            Moyenne des progressions de vos apprenants inscrits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}