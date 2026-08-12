// src/routes/_instructor/trainings/$trainingId/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/instructor/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, MapPin, Users, BookOpen } from "lucide-react";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { formatDate } from "@/lib/api";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/")({
  head: () => ({
    meta: [
      { title: `Détail de la formation - Espace Formateur ${SITE.name}` },
      { name: "description", content: "Cohorte, dates, apprenants inscrits et avancement global de la formation." },
      { property: "og:title", content: "Détail de la formation - Espace Formateur" },
      { property: "og:description", content: "Suivi complet d'une formation assignée." },
    ],
  }),
  component: TrainingDetail,
});

function TrainingDetail() {
  const { trainingId } = Route.useParams();
  const { overview, isLoading } = useInstructorTrainingOverview(trainingId);

  if (isLoading || !overview) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const { data: training, students, averageProgress, progressTrackingAvailable } = overview;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={training.theme}
        title={training.title}
        description={training.short}
        actions={
          <>
            <Button asChild variant="accent">
              <Link to="/trainings/$trainingId/contenu" params={{ trainingId }}>
                Gérer le contenu
              </Link>
            </Button>
            <Button asChild variant="soft">
              <Link to="/sessions">Sessions</Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{training.level}</Badge>
        <Badge variant="outline">{training.status}</Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {training.duration}
        </span>
        <span className="font-display text-sm font-semibold text-primary">
          {training.price.toLocaleString("fr-FR")} FCFA
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Période</p>
            <p className="mt-1 text-sm font-medium">
              {training.startDate ? formatDate(training.startDate) : "À définir"} →{" "}
              {training.endDate ? formatDate(training.endDate) : "À définir"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Lieu</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="size-3.5" /> {training.location ?? "À définir"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Avancement global</p>
            {progressTrackingAvailable && averageProgress !== null ? (
              <>
                <p className="font-display text-2xl">{averageProgress}%</p>
                <Progress value={averageProgress} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Non disponible pour l'instant</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <BookOpen className="size-4" /> Objectifs pédagogiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {training.objectives.map((o) => (
                <li key={o} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {o}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {training.prerequisites.length > 0 && (
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-lg">Prérequis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {training.prerequisites.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" /> {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Users className="size-4" /> Apprenants inscrits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {students.total > 0
              ? `${students.total} apprenant${students.total > 1 ? "s" : ""} inscrit${students.total > 1 ? "s" : ""}.`
              : "Aucun apprenant inscrit pour le moment."}
          </p>
          {/* Tableau détaillé (progression, assiduité, paiement) à ajouter dès qu'un exemple
              de réponse avec des apprenants réels sera fourni — la forme exacte de chaque
              élément de `students.data` n'est pas encore connue. */}
        </CardContent>
      </Card>
    </div>
  );
}
