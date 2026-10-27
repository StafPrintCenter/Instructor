import { Link } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { InstructorSubmissionBadge } from "@/components/shared/StatusBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardCorrections } from "@/hooks/useDashboardData";
import { relativeTime } from "@/lib/api";
import { DashboardListError, DashboardListSkeleton } from "./CardState";

export function DashboardActivity() {
  const { latest, isLoading, isError, refetch } = useDashboardCorrections();

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-xl">Activité récente</CardTitle>
        <p className="text-xs text-muted-foreground">Derniers travaux déposés par vos apprenants.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <DashboardListSkeleton />
        ) : isError ? (
          <DashboardListError message="Impossible de charger l'activité." onRetry={() => refetch()} />
        ) : latest.length === 0 ? (
          <EmptyState icon={<Inbox className="size-6" />} title="Aucune activité" />
        ) : (
          latest.map((s) => (
            <Link
              key={s.submissionId}
              to="/corrections/$id"
              params={{ id: s.submissionId }}
              className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card p-3 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium">
                  {s.studentName} a rendu « {s.lessonTitle} »
                </p>
                <p className="truncate text-xs text-muted-foreground">{s.trainingTitle}</p>
                <InstructorSubmissionBadge status={s.status} />
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(s.submittedAt)}</span>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}