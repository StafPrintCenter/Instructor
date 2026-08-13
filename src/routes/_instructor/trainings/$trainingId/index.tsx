import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Calendar,
  Hourglass,
  UserCheck,
} from "lucide-react";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { formatDate } from "@/lib/api";
import { SITE } from "@/data/site";
import {
  getTrainingLevelBadgeClass,
  getTrainingStatusBadgeClass,
  getTrainingStatusLabel,
} from "@/data/trainings";
import { cn } from "@/lib/utils";

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const { data: training, students, averageProgress, progressTrackingAvailable } = overview;
  const mainColor = training.coverColor || "var(--primary)";

  return (
    <div className="space-y-8">
      {/* Hero Header immersif avec fond dégradé */}
      <div
        className="relative -mx-4 -mt-4 overflow-hidden rounded-2xl border border-border/60 p-6 transition-colors sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${mainColor}15 0%, ${mainColor}03 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {training.theme}
            </span>
            <div className="flex items-center gap-2">
              <Button asChild variant="accent">
                <Link to="/trainings/$trainingId/manage" params={{ trainingId }}>
                  Gérer le contenu
                </Link>
              </Button>
              <Button asChild variant="soft">
                <Link to="/sessions">Sessions</Link>
              </Button>
            </div>
          </div>

          {/* Titre avec le pilier vertical */}
          <div className="flex items-stretch gap-3.5">
            <div
              className="my-1 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: mainColor }}
            />
            <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
              {training.title}
            </h1>
          </div>

          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            {training.short}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs sm:text-sm">
            {/* Badge Niveau */}
            <Badge
              variant="outline"
              className={cn("border font-medium", getTrainingLevelBadgeClass(training.level))}
            >
              {training.level}
            </Badge>

            {/* Badge Statut */}
            <Badge
              variant="outline"
              className={cn("border font-medium", getTrainingStatusBadgeClass(training.status))}
            >
              {getTrainingStatusLabel(training.status)}
            </Badge>

            <span
              className="rounded-full px-3 py-1 font-display font-semibold text-white shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              {training.price.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Cartes des métriques et informations clés */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Période & Lieu */}
        <Card className="border-border/70">
          <CardContent className="space-y-1.5 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Période & Lieu</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
              {training.startDate ? formatDate(training.startDate) : "À définir"} →{" "}
              {training.endDate ? formatDate(training.endDate) : "À définir"}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" /> {training.location ?? "À définir"}
            </p>
          </CardContent>
        </Card>

        {/* Volume Horaire */}
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Volume Horaire</p>
            <p className="mt-1 font-display text-2xl font-semibold">
              {training.durationHours}h
            </p>
            <p className="text-xs text-muted-foreground">{training.duration}</p>
          </CardContent>
        </Card>

        {/* Places & Inscriptions */}
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Inscriptions</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-semibold">
                {training.currentStudents ?? 0}
              </span>
              <span className="text-sm text-muted-foreground">
                / {training.maxSeats ?? "∞"} places
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Apprenants enregistrés</p>
          </CardContent>
        </Card>

        {/* Avancement global */}
        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Avancement global</p>
            {progressTrackingAvailable && averageProgress !== null ? (
              <>
                <p className="font-display text-2xl font-semibold">{averageProgress}%</p>
                <Progress value={averageProgress} />
              </>
            ) : (
              <p className="pt-1 text-sm text-muted-foreground">Non disponible pour l'instant</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <BookOpen className="size-4" style={{ color: mainColor }} /> Objectifs pédagogiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {training.objectives.map((o) => (
                <li key={o} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" style={{ color: mainColor }} /> {o}
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
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: mainColor }} /> {p}
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
            <Users className="size-4" style={{ color: mainColor }} /> Apprenants inscrits ({students.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {students.total > 0
              ? `${students.total} apprenant${students.total > 1 ? "s" : ""} inscrit${students.total > 1 ? "s" : ""}.`
              : "Aucun apprenant inscrit pour le moment."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}