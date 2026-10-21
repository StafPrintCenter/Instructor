import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Briefcase, Eye, GraduationCap, Mail, Phone, RefreshCw } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getEnrollmentStatusBadgeClass, getEnrollmentStatusLabel } from "@/data/training-students";
import type { APIInstructorStudentTrainingFollowUp } from "@/data/students";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
  getTrainingStatusBadgeClass,
  getTrainingStatusLabel,
} from "@/data/trainings";
import { useInstructorStudentGlobal } from "@/stores/useStudentsStore";
import { resolveStorageUrl } from "@/lib/file-url";
import { formatDate } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/students/$studentId")({
  head: () => ({
    meta: [
      { title: `Profil apprenant | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Vue globale d'un apprenant : formations, progression, soumissions, quiz et assiduité." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentGlobalPage,
});

function StudentGlobalPage() {
  const { studentId } = Route.useParams();
  const { overview, isLoading, isError, error, refetch } = useInstructorStudentGlobal(studentId);

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link to="/students">
        <ArrowLeft className="size-4" /> Retour aux apprenants
      </Link>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
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

  if (isError) {
    return (
      <div className="space-y-6">
        {backButton}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">{error?.message || "Impossible de charger cet apprenant."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="space-y-6">
        {backButton}
        <p className="text-muted-foreground">Apprenant introuvable.</p>
      </div>
    );
  }

  const { data: student, trainings } = overview;
  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();
  const photo = resolveStorageUrl(student.photo);

  // Agrégats calculés à partir des formations
  const toReview = trainings.reduce((sum, t) => sum + t.submissions.filter((s) => s.status === "submitted").length, 0);
  const ratios = trainings.map((t) => t.attendance.ratio).filter((r): r is number => r !== null);
  const averageAttendance = ratios.length > 0 ? Math.round(ratios.reduce((a, b) => a + b, 0) / ratios.length) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profil apprenant"
        title={student.name}
        description="Vue d'ensemble de l'apprenant sur toutes vos formations."
        actions={backButton}
      />

      {/* Fiche profil */}
      <Card className="border-border/70">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
          <Avatar className="size-16 border border-border">
            {photo ? <AvatarImage src={photo} alt={student.name} /> : null}
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials || "AP"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" /> {student.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5 text-primary" /> {student.phone || "Téléphone non renseigné"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-primary" /> {student.occupation || "Profession non renseignée"}
              </span>
            </div>
            {student.bio ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{student.bio}</p>
            ) : (
              <p className="text-sm italic text-muted-foreground">Aucune biographie renseignée.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Formations</p>
            <p className="mt-1 font-display text-2xl font-semibold">{student.trainingsCount}</p>
            <p className="text-xs text-muted-foreground">suivies avec vous</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Progression moyenne</p>
            <p className="font-display text-2xl font-semibold">{student.averageProgress}%</p>
            <Progress value={student.averageProgress} />
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Assiduité moyenne</p>
            {averageAttendance !== null ? (
              <>
                <p className="font-display text-2xl font-semibold">{averageAttendance}%</p>
                <Progress value={averageAttendance} />
              </>
            ) : (
              <p className="pt-1 text-sm text-muted-foreground">Aucune séance renseignée</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Travaux à traiter</p>
            <p className="mt-1 font-display text-2xl font-semibold">{toReview}</p>
            <p className="text-xs text-muted-foreground">en attente de notation</p>
          </CardContent>
        </Card>
      </div>

      {/* Formations */}
      <section className="space-y-3">
        <h2 className="font-display text-xl">Formations ({trainings.length})</h2>
        {trainings.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="size-6" />}
            title="Aucune formation"
            description="Cet apprenant n'est inscrit à aucune de vos formations."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {trainings.map((t) => (
              <TrainingFollowUpCard key={t.trainingId} training={t} studentId={student.studentId} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function TrainingFollowUpCard({
  training: t,
  studentId,
}: {
  training: APIInstructorStudentTrainingFollowUp;
  studentId: string;
}) {
  const e = t.enrollment;
  const completedLessons = t.lessonProgress.filter((l) => l.status === "completed").length;
  const inProgressLessons = t.lessonProgress.filter((l) => l.status === "in_progress").length;
  const toReview = t.submissions.filter((s) => s.status === "submitted").length;
  const hasActivity = t.lessonProgress.length > 0 || t.quizAttempts.length > 0 || t.submissions.length > 0;

  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="font-display text-lg leading-snug">{t.trainingTitle}</CardTitle>
          <Button asChild size="sm" variant="soft">
            <Link to="/trainings/$trainingId/students/$studentId" params={{ trainingId: t.trainingId, studentId }}>
              <Eye className="size-4" /> Suivi détaillé
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className={cn("border font-medium", getTrainingStatusBadgeClass(t.trainingStatus))}>
            {getTrainingStatusLabel(t.trainingStatus)}
          </Badge>
          <Badge variant="outline" className={cn("border font-medium", getEnrollmentStatusBadgeClass(e.status))}>
            {getEnrollmentStatusLabel(e.status)}
          </Badge>
          <Badge variant="outline" className={cn("border font-medium", getPaymentStatusBadgeClass(e.paymentStatus))}>
            {getPaymentStatusLabel(e.paymentStatus)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{e.progress}%</span>
          </div>
          <Progress value={e.progress} className="h-1.5" />
        </div>

        {hasActivity ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat
              label="Leçons"
              value={`${completedLessons} terminée${completedLessons > 1 ? "s" : ""}${inProgressLessons > 0 ? ` · ${inProgressLessons} en cours` : ""}`}
            />
            <Stat
              label="Soumissions"
              value={`${t.submissions.length}${toReview > 0 ? ` (${toReview} à traiter)` : ""}`}
            />
            <Stat label="Tentatives de quiz" value={t.quizAttempts.length} />
            <Stat label="Assiduité" value={t.attendance.ratio !== null ? `${t.attendance.ratio}%` : "-"} />
            <Stat label="Montant versé" value={`${e.amountPaid.toLocaleString("fr-FR")} FCFA`} />
            <Stat label="Inscrit le" value={formatDate(e.enrolledAt)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Montant versé" value={`${e.amountPaid.toLocaleString("fr-FR")} FCFA`} />
            <Stat label="Inscrit le" value={formatDate(e.enrolledAt)} />
          </div>
        )}

        {!hasActivity ? (
          <p className="text-xs italic text-muted-foreground">Aucune activité enregistrée pour l'instant.</p>
        ) : null}

        {e.completedAt ? (
          <p className="text-xs text-muted-foreground">Formation terminée le {formatDate(e.completedAt)}.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}