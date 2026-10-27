import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionModalityBadge } from "@/components/shared";
import { useDashboardUpcomingSessions } from "@/hooks/useDashboardData";
import { formatSessionShortDateTime } from "@/lib/session-time";
import { DashboardListError, DashboardListSkeleton } from "./CardState";

export function DashboardUpcomingSessions() {
  const { sessions, isLoading, isError, refetch } = useDashboardUpcomingSessions();

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-xl">Prochaines sessions</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/sessions">Voir le planning</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <DashboardListSkeleton rows={2} />
        ) : isError ? (
          <DashboardListError message="Impossible de charger les sessions." onRetry={() => refetch()} />
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune session planifiée.</p>
        ) : (
          sessions.map((s) => (
            <Link
              key={s.id}
              to="/sessions/$id"
              params={{ id: s.id }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card p-3 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {s.trainingTitle} · {formatSessionShortDateTime(s.startsAt)} · {Number(s.durationMinutes)} min
                </p>
              </div>
              <SessionModalityBadge modality={s.modality} />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}