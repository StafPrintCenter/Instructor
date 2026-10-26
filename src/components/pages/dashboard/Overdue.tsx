import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardOverdue } from "@/hooks/useDashboardData";
import { daysSince } from "@/lib/api";
import { DashboardListError, DashboardListSkeleton } from "./CardState";

export function DashboardOverdue() {
  const { overdue, overdueCount, isLoading, isError, refetch } = useDashboardOverdue();
  const hiddenCount = overdueCount - overdue.length;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <AlertTriangle className="size-4 text-warning" /> Corrections en retard
          {overdueCount > 0 ? <span className="text-sm font-normal text-muted-foreground">({overdueCount})</span> : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <DashboardListSkeleton rows={2} />
        ) : isError ? (
          <DashboardListError message="Impossible de charger les retards." onRetry={() => refetch()} />
        ) : overdue.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun retard, tout est à jour.</p>
        ) : (
          <>
            {overdue.map((s) => {
              const days = daysSince(s.submittedAt);
              return (
                <Link
                  key={s.submissionId}
                  to="/corrections/$id"
                  params={{ id: s.submissionId }}
                  className="block rounded-lg border border-warning/40 bg-warning/10 p-3 transition-opacity hover:opacity-80"
                >
                  <p className="text-sm font-medium">{s.lessonTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.studentName} · rendu il y a {days} jour{days > 1 ? "s" : ""}
                  </p>
                </Link>
              );
            })}
            {hiddenCount > 0 ? (
              <p className="text-xs text-muted-foreground">+ {hiddenCount} autre{hiddenCount > 1 ? "s" : ""} en retard</p>
            ) : null}
          </>
        )}
        <Button asChild variant="soft" className="w-full">
          <Link to="/corrections">Ouvrir la file</Link>
        </Button>
      </CardContent>
    </Card>
  );
}