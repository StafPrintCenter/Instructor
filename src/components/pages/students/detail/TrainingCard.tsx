import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { APIInstructorStudentTrainingFollowUp } from "@/data/students";
import { getEnrollmentStatusBadgeClass, getEnrollmentStatusLabel } from "@/data/training-students";
import { getPaymentStatusBadgeClass, getPaymentStatusLabel, getTrainingStatusBadgeClass, getTrainingStatusLabel } from "@/data/trainings";
import { formatDate } from "@/lib/api";
import { cn } from "@/lib/utils";

function StudentStatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

interface StudentTrainingCardProps {
  training: APIInstructorStudentTrainingFollowUp;
  studentId: string;
}

export function StudentTrainingCard({ training: t, studentId }: StudentTrainingCardProps) {
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
            <StudentStatTile
              label="Leçons"
              value={`${completedLessons} terminée${completedLessons > 1 ? "s" : ""}${inProgressLessons > 0 ? ` · ${inProgressLessons} en cours` : ""}`}
            />
            <StudentStatTile
              label="Soumissions"
              value={`${t.submissions.length}${toReview > 0 ? ` (${toReview} à traiter)` : ""}`}
            />
            <StudentStatTile label="Tentatives de quiz" value={t.quizAttempts.length} />
            <StudentStatTile label="Assiduité" value={t.attendance.ratio !== null ? `${t.attendance.ratio}%` : "-"} />
            <StudentStatTile label="Montant versé" value={`${e.amountPaid.toLocaleString("fr-FR")} FCFA`} />
            <StudentStatTile label="Inscrit le" value={formatDate(e.enrolledAt)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <StudentStatTile label="Montant versé" value={`${e.amountPaid.toLocaleString("fr-FR")} FCFA`} />
            <StudentStatTile label="Inscrit le" value={formatDate(e.enrolledAt)} />
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