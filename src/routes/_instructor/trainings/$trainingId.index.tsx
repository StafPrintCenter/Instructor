import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/instructor/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentBadge } from "@/components/instructor/status-badges";
import { trainingOverviewQuery } from "@/lib/queries";
import { getSessionInstructorId, useInstructorAuth } from "@/lib/instructor-auth";
import { formatDate, relativeTime } from "@/lib/api";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/")({
  head: () => ({
    meta: [
      { title: "Détail de la formation — Espace Formateur STAF PRINT CENTER" },
      { name: "description", content: "Cohorte, dates, apprenants inscrits et avancement global de la formation." },
      { property: "og:title", content: "Détail de la formation — Espace Formateur" },
      { property: "og:description", content: "Suivi complet d'une formation assignée." },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(trainingOverviewQuery(getSessionInstructorId(), params.trainingId)),
  component: TrainingDetail,
});

function TrainingDetail() {
  const { trainingId } = Route.useParams();
  const { instructorId } = useInstructorAuth();
  const { data } = useSuspenseQuery(trainingOverviewQuery(instructorId, trainingId));
  const { training, enrollments, averageProgress } = data;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={training.cohort}
        title={training.title}
        description={training.summary}
        actions={
          <>
            <Button asChild variant="accent"><Link to="/formations/$trainingId/contenu" params={{ trainingId }}>Gérer le contenu</Link></Button>
            <Button asChild variant="soft"><Link to="/sessions">Sessions</Link></Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70"><CardContent className="p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">Période</p><p className="mt-1 text-sm font-medium">{formatDate(training.starts_at)} → {formatDate(training.ends_at)}</p></CardContent></Card>
        <Card className="border-border/70"><CardContent className="p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">Lieu</p><p className="mt-1 text-sm font-medium">{training.location}</p></CardContent></Card>
        <Card className="border-border/70"><CardContent className="space-y-2 p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">Avancement global</p><p className="font-display text-2xl">{averageProgress}%</p><Progress value={averageProgress} /></CardContent></Card>
      </div>

      <Card className="border-border/70">
        <CardHeader><CardTitle className="font-display text-xl">Apprenants inscrits</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprenant</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Assiduité</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Link to="/apprenants/$studentId" params={{ studentId: e.student_id }} className="font-medium hover:underline">
                      {e.student.full_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{e.student.city}</p>
                  </TableCell>
                  <TableCell className="w-40"><Progress value={e.progress} /><span className="text-xs text-muted-foreground">{e.progress}%</span></TableCell>
                  <TableCell>{e.attendance_rate}%</TableCell>
                  <TableCell><PaymentBadge status={e.payment_status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{relativeTime(e.last_activity_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
