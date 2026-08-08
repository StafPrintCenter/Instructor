import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, CalendarDays, ClipboardCheck, Gauge, Users, AlertTriangle, MapPin, Video, ArrowRight, } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { StatCard } from "@/components/instructor/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { activityQuery, overdueQuery, queueQuery, sessionsQuery, statsQuery, studentsQuery, trainingsQuery, } from "@/lib/queries";
import { useInstructorAuth } from "@/hooks/useInstructorAuth";
import { daysSince, formatDate, formatDateTime, relativeTime } from "@/lib/api";

export const Route = createFileRoute("/_instructor/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord formateur — STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Indicateurs pédagogiques : formations assignées, apprenants actifs, corrections en attente et sessions à venir.",
      },
      { property: "og:title", content: "Tableau de bord formateur — STAF PRINT CENTER" },
      {
        property: "og:description",
        content: "Pilotez votre activité pédagogique en un coup d'oeil.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useInstructorAuth();
  const instructorId = user?.id ?? "";

  const { data: stats } = useSuspenseQuery(statsQuery(instructorId));
  const { data: activity } = useSuspenseQuery(activityQuery(instructorId));
  const { data: overdue } = useSuspenseQuery(overdueQuery(instructorId));
  const { data: trainings } = useSuspenseQuery(trainingsQuery(instructorId));
  const { data: sessions } = useSuspenseQuery(sessionsQuery(instructorId));
  const { data: students } = useSuspenseQuery(studentsQuery(instructorId));
  const { data: queue } = useSuspenseQuery(queueQuery(instructorId));
  const [showAllTrainings, setShowAllTrainings] = useState(false);

  const trainingCards = useMemo(
    () =>
      trainings.map((t) => {
        const rows = students.filter((s) => s.training_id === t.id);
        const progress = rows.length
          ? Math.round(rows.reduce((sum, r) => sum + r.progress, 0) / rows.length)
          : 0;
        return { training: t, learners: rows.length, progress };
      }),
    [trainings, students]
  );

  const visibleTrainings = showAllTrainings ? trainingCards : trainingCards.slice(0, 3);

  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => +new Date(s.starts_at) >= Date.now())
        .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at))
        .slice(0, 5),
    [sessions]
  );

  const progressData = trainingCards.map((c) => ({
    name: c.training.cohort,
    progression: c.progress,
    apprenants: c.learners,
  }));

  const statusData = useMemo(() => {
    const counts = { pending: 0, graded: 0, returned: 0 };
    for (const s of queue) counts[s.status] += 1;
    return [
      { name: "À corriger", value: counts.pending, color: "var(--chart-1)" },
      { name: "Corrigés", value: counts.graded, color: "var(--chart-3)" },
      { name: "Renvoyés", value: counts.returned, color: "var(--chart-4)" },
    ].filter((d) => d.value > 0);
  }, [queue]);

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Formations assignées"
          value={stats.assigned_trainings}
          icon={<BookOpen className="size-5" />}
          hint="Assignées par l'administration"
        />
        <StatCard
          label="Apprenants actifs"
          value={stats.active_students}
          icon={<Users className="size-5" />}
          tone="accent"
        />
        <StatCard
          label="Soumissions à corriger"
          value={stats.pending_submissions}
          icon={<ClipboardCheck className="size-5" />}
          tone="warning"
          hint={`${stats.overdue_gradings} en retard`}
        />
        <StatCard
          label="Taux de complétion moyen"
          value={`${stats.average_completion}%`}
          icon={<Gauge className="size-5" />}
          tone="success"
        />
        <StatCard
          label="Prochaines sessions"
          value={stats.upcoming_sessions}
          icon={<CalendarDays className="size-5" />}
        />
        <Card className="border-border/70">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Complétion globale
            </p>
            <Progress value={stats.average_completion} />
            <p className="text-xs text-muted-foreground">
              Recalculée depuis les interactions réelles des apprenants.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Mes formations assignées</h2>
            <p className="text-sm text-muted-foreground">
              {trainingCards.length} formation(s) sous votre responsabilité.
            </p>
          </div>
          {trainingCards.length > 3 ? (
            <Button variant="ghost" size="sm" onClick={() => setShowAllTrainings((v) => !v)}>
              {showAllTrainings ? "Voir moins" : `Voir plus (${trainingCards.length - 3})`}
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/trainings">
                Toutes les formations <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>

        {trainingCards.length === 0 ? (
          <EmptyState icon={<BookOpen className="size-6" />} title="Aucune formation assignée" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleTrainings.map(({ training, learners, progress }) => (
              <Card
                key={training.id}
                className="flex flex-col border-border/70 transition-shadow hover:shadow-(--shadow-lift)"
              >
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {training.category}
                      </p>
                      <h3 className="font-display text-lg leading-snug">{training.title}</h3>
                    </div>
                    <Badge variant="secondary">{training.level}</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{training.summary}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5" /> {learners} apprenant(s)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {training.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" /> {formatDate(training.starts_at)}
                    </span>
                  </div>
                  <div className="mt-auto space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="h-2" />
                      <span className="w-10 text-right text-xs tabular-nums">{progress}%</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="soft" className="flex-1">
                        <Link to="/trainings/$trainingId" params={{ trainingId: training.id }}>
                          Détails
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="accent" className="flex-1">
                        <Link to="/formations/$trainingId/contenu" params={{ trainingId: training.id }}>
                          Contenu
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="font-display text-xl">Progression moyenne par cohorte</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.65rem",
                    fontSize: "0.8rem",
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="progression" radius={[6, 6, 0, 0]} fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="font-display text-xl">Répartition des travaux</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun travail rendu pour le moment.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="var(--card)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.65rem",
                      fontSize: "0.8rem",
                      color: "var(--card-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="-mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {statusData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: d.color }} /> {d.name} (
                  {d.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-xl">Prochaines sessions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/sessions">Voir le planning</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune session planifiée.</p>
          ) : (
            upcoming.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.training_title} · {formatDateTime(s.starts_at)} · {s.duration_minutes} min
                  </p>
                </div>
                <Badge variant={s.mode === "live" ? "secondary" : "outline"} className="gap-1.5">
                  {s.mode === "live" ? <Video className="size-3.5" /> : <MapPin className="size-3.5" />}
                  {s.mode === "live" ? "En ligne" : "Présentiel"}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="font-display text-xl">Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.length === 0 ? (
              <EmptyState title="Aucune activité" />
            ) : (
              activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {relativeTime(item.created_at)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <AlertTriangle className="size-4 text-warning" /> Corrections en retard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdue.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun retard, tout est à jour.</p>
            ) : (
              overdue.map((s) => (
                <div key={s.id} className="rounded-lg border border-warning/40 bg-warning/10 p-3">
                  <p className="text-sm font-medium">{s.lesson_title}</p>
                  <p className="text-xs text-muted-foreground">
                    Rendu il y a {daysSince(s.submitted_at)} jours
                  </p>
                </div>
              ))
            )}
            <Button asChild variant="soft" className="w-full">
              <Link to="/corrections">Ouvrir la file</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}