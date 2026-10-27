import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardCorrections } from "@/hooks/useDashboardData";
import { instructorSubmissionStatusLabels, type SubmissionStatus } from "@/data/submissions";
import { DashboardListError } from "./CardState";
import { CHART_TOOLTIP_STYLE } from "./CharftStyles";

const SLICES: { key: SubmissionStatus; color: string }[] = [
  { key: "submitted", color: "var(--chart-1)" },
  { key: "under_review", color: "var(--chart-2)" },
  { key: "validated", color: "var(--chart-3)" },
  { key: "rejected", color: "var(--chart-4)" },
];

export function SubmissionsBreakdownChart() {
  const { stats, isLoading, isError, refetch } = useDashboardCorrections();

  const data = useMemo(
    () =>
      SLICES.map((s) => ({
        name: instructorSubmissionStatusLabels[s.key],
        value: stats?.byStatus[s.key] ?? 0,
        color: s.color,
      })).filter((d) => d.value > 0),
    [stats]
  );

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-xl">Répartition des travaux</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading ? (
          <div className="h-full animate-pulse rounded-lg bg-muted" />
        ) : isError ? (
          <DashboardListError message="Impossible de charger la répartition." onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun travail rendu pour le moment.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="var(--card)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {data.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: d.color }} /> {d.name} ({d.value})
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}