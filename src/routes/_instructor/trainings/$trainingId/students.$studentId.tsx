import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, CalendarCheck, ClipboardList, Inbox, MessageSquare, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceMarkDialog } from "@/components/pages/trainings/shared";
import { PageHeader, FilePreviewModal } from "@/components/site";
import { QuizAttemptFeedbackDialog } from "@/components/pages/trainings/detail/student";
import { SubmissionCard, SubmissionGradeDialog } from "@/components/pages/submissions";
import { lessonKindLabels } from "@/data/content";
import { getAttendanceStatusBadgeClass, getAttendanceStatusLabel } from "@/data/attendance";
import type { APIInstructorSubmission } from "@/data/submissions";
import {
  getEnrollmentStatusLabel,
  getLessonProgressBadgeClass,
  getLessonProgressLabel,
  getQuizAttemptBadgeClass,
  getQuizAttemptStatusLabel,
  toInstructorSubmission,
} from "@/data/training-students";
import { getPaymentStatusBadgeClass, getPaymentStatusLabel } from "@/data/trainings";
import { useInstructorTrainingStudent } from "@/stores/useTrainingStudentsStore";
import { formatDate } from "@/lib/api";
import { formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";
import { useDynamicPageMetadata } from "@/hooks/useDynamicPageMetadata";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/students/$studentId")({
  head: () => ({
    meta: [
      { title: `${SITE.tool} - Suivi d'un apprenant | ${SITE.name}` },
      { name: "description", content: "Consultez la progression, les travaux remis, les quiz et l'assiduité d'un apprenant." },
    ],
  }),
  component: StudentDetailPage,
});

function StudentDetailPage() {
  const { trainingId, studentId } = Route.useParams();
  const { detail, isLoading, isError, error, refetch } = useInstructorTrainingStudent(trainingId, studentId);
  const studentName = detail
    ? `${detail.data.firstName} ${detail.data.lastName}`.trim() || detail.data.email
    : undefined;
  useDynamicPageMetadata(
    studentName ? `${SITE.tool} - ${studentName} | ${SITE.name}` : undefined,
    studentName ? `Suivi de ${studentName} dans la formation : progression, travaux, quiz et assiduité.` : undefined,
  );

  const [toGrade, setToGrade] = useState<APIInstructorSubmission | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [feedbackAttemptId, setFeedbackAttemptId] = useState<string | null>(null);

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link to="/trainings/$trainingId" params={{ trainingId }}>
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
    </Button>
  );

  if (isLoading) {
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

  if (isError) {
    return (
      <div className="space-y-6">
        {backButton}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">
            {error?.message || "Impossible de charger le suivi de cet apprenant."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-6">
        {backButton}
        <p className="text-muted-foreground">Apprenant introuvable.</p>
      </div>
    );
  }

  const { data: student, lessonProgress, quizAttempts, submissions, attendance } = detail;
  const fullName = `${student.firstName} ${student.lastName}`.trim();
  const toValidate = submissions.filter((s) => s.status === "submitted").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suivi apprenant"
        title={fullName}
        description={student.email}
        actions={
          <>
            {backButton}
            <Button asChild variant="soft" size="sm">
              <Link to="/trainings/$trainingId/submissions" params={{ trainingId }}>
                <ClipboardList className="size-4" /> Toutes les soumissions
              </Link>
            </Button>
            <Button variant="accent" size="sm" onClick={() => setAttendanceOpen(true)}>
              <CalendarCheck className="size-4" /> Marquer l'assiduité
            </Button>
          </>
        }
      />

      {/* Indicateurs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Progression</p>
            <p className="font-display text-2xl font-semibold">{student.progress}%</p>
            <Progress value={student.progress} />
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Assiduité</p>
            {attendance.ratio !== null ? (
              <>
                <p className="font-display text-2xl font-semibold">{attendance.ratio}%</p>
                <Progress value={attendance.ratio} />
              </>
            ) : (
              <p className="pt-1 text-sm text-muted-foreground">Aucune séance renseignée</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-2 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Paiement</p>
            <Badge variant="outline" className={cn("border font-medium", getPaymentStatusBadgeClass(student.paymentStatus))}>
              {getPaymentStatusLabel(student.paymentStatus)}
            </Badge>
            <p className="text-sm font-medium">{student.amountPaid.toLocaleString("fr-FR")} FCFA versés</p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="space-y-1 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Inscription</p>
            <p className="text-sm font-medium">{getEnrollmentStatusLabel(student.status)}</p>
            <p className="text-xs text-muted-foreground">Inscrit le {formatDate(student.enrolledAt)}</p>
            {student.completedAt ? (
              <p className="text-xs text-muted-foreground">Terminée le {formatDate(student.completedAt)}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Soumissions */}
      <section className="space-y-3">
        <h2 className="font-display text-xl">
          Soumissions ({submissions.length})
          {toValidate > 0 ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">· {toValidate} à traiter</span>
          ) : null}
        </h2>
        {submissions.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-6" />}
            title="Aucune soumission"
            description="Cet apprenant n'a encore rendu aucun travail."
          />
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <SubmissionCard
                key={s.submissionId}
                submission={toInstructorSubmission(student, s)}
                hideStudent
                onGrade={setToGrade}
                onPreview={(url, title) => setPreview({ url, title })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Tentatives de quiz */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="font-display text-xl">Tentatives de quiz ({quizAttempts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {quizAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune tentative enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leçon</TableHead>
                    <TableHead>Tentative</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Soumise le</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizAttempts.map((a) => (
                    <TableRow key={a.attemptId}>
                      <TableCell className="text-sm font-medium">{a.lessonTitle}</TableCell>
                      <TableCell className="text-sm">#{a.attemptNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className={cn("border font-medium", getQuizAttemptBadgeClass(a.status))}>
                            {getQuizAttemptStatusLabel(a.status)}
                          </Badge>
                          {a.isAutoSubmitted ? <Badge variant="secondary" className="text-[10px]">Auto</Badge> : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{a.score !== null ? `${a.score}%` : "-"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(a.submittedAt)}</TableCell>
                      <TableCell className="max-w-xs">
                        {a.feedback ? (
                          <div className="space-y-1">
                            <p className="whitespace-pre-wrap text-xs text-muted-foreground">{a.feedback.comment}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "border text-[10px] font-medium",
                                a.feedback.validated
                                  ? "bg-success/15 text-success border-success/30"
                                  : "bg-muted text-muted-foreground border-transparent"
                              )}
                            >
                              {a.feedback.validated ? "Validée" : "Non validée"}
                            </Badge>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setFeedbackAttemptId(a.attemptId)}>
                            <MessageSquare className="size-4" /> Feedback
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progression par leçon */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="font-display text-xl">Progression par leçon ({lessonProgress.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {lessonProgress.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune activité enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leçon</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Avancement</TableHead>
                    <TableHead>Meilleur score</TableHead>
                    <TableHead>Dernière activité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessonProgress.map((l) => (
                    <TableRow key={l.lessonId}>
                      <TableCell className="text-sm font-medium">{l.lessonTitle}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lessonKindLabels[l.kind] ?? l.kind}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("border font-medium", getLessonProgressBadgeClass(l.status))}>
                          {getLessonProgressLabel(l.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-28">
                        {l.status === "in_progress" && l.completionRatio > 0 ? (
                          <div className="space-y-1">
                            <span className="text-xs font-medium">{Math.round(l.completionRatio)}%</span>
                            <Progress value={l.completionRatio} className="h-1.5" />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{l.bestScore !== null ? `${l.bestScore}%` : "-"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDateTime(l.lastActivityAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assiduité */}
      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="font-display text-xl">Assiduité ({attendance.data.length})</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setAttendanceOpen(true)}>
            <CalendarCheck className="size-4" /> Marquer
          </Button>
        </CardHeader>
        <CardContent>
          {attendance.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune séance renseignée pour cet apprenant.</p>
          ) : (
            <ul className="space-y-2">
              {attendance.data.map((entry) => (
                <li
                  key={`${entry.date}-${entry.markedAt}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
                >
                  <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Renseignée le {formatDateTime(entry.markedAt)}</span>
                    <Badge variant="outline" className={cn("border font-medium", getAttendanceStatusBadgeClass(entry.status))}>
                      {getAttendanceStatusLabel(entry.status)}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <SubmissionGradeDialog submission={toGrade} onClose={() => setToGrade(null)} />

      <FilePreviewModal url={preview?.url ?? null} title={preview?.title ?? ""} onClose={() => setPreview(null)} />

      <AttendanceMarkDialog
        enrollmentId={attendanceOpen ? student.enrollmentId : null}
        studentName={fullName}
        onClose={() => setAttendanceOpen(false)}
      />

      <QuizAttemptFeedbackDialog
        attemptId={feedbackAttemptId}
        studentName={fullName}
        onClose={() => setFeedbackAttemptId(null)}
      />
    </div>
  );
}