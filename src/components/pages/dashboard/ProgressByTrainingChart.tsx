import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStudents, useDashboardTrainings } from "@/hooks/useDashboardData";
import { truncate } from "@/lib/dashboard";
import { DashboardListError } from "./CardState";
import { CHART_TOOLTIP_STYLE } from "./chartStyles";

export function ProgressByTrainingChart() {
  const { trainings, isLoading, isError, refetch } = useDashboardTrainings();
  const { summary, isLoading: studentsLoading } = useDashboardStudents();

  const data = useMemo(
    () =>
      trainings.map((t) => ({
        name: truncate(t.trainingTitle, 14),
        fullName: t.trainingTitle,
        progression: summary.byTraining[t.trainingId]?.progress ?? 0,
      })),
    [trainings, summary]
  );

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-xl">Progression moyenne par formation</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading || studentsLoading ? (
          <div className="h-full animate-pulse rounded-lg bg-muted" />
        ) : isError ? (
          <DashboardListError message="Impossible de charger les progressions." onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune formation à afficher.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--muted-foreground)"
              />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip
                cursor={{ fill: "var(--secondary)" }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                formatter={(value) => [`${value}%`, "Progression moyenne"]}
              />
              <Bar dataKey="progression" radius={[6, 6, 0, 0]} fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}