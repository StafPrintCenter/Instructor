// src/routes/_instructor/corrections/$id.tsx
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ClipboardCheck, Eye, Paperclip, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/instructor/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InstructorSubmissionBadge } from "@/components/instructor/status-badges";
import { FilePreviewModal } from "@/components/site/FilePreviewModal";
import { SubmissionGradeDialog } from "@/components/site/SubmissionGradeDialog";
import { lessonKindLabels } from "@/data/content";
import {
  getLatestFeedback,
  sortFeedbacksDesc,
  type APIInstructorSubmission,
  type APIInstructorSubmissionFeedbackEntry,
} from "@/data/submissions";
import { useInstructorSubmissionDetail } from "@/stores/useSubmissionsStore";
import { resolveStorageUrl } from "@/lib/file-url";
import { formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/corrections/$id")({
  head: () => ({
    meta: [
      { title: `Correction | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Détail d'un travail déposé : livrable, consignes, historique des corrections." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CorrectionDetailPage,
});

function FeedbackItem({ feedback: f, isLatest }: { feedback: APIInstructorSubmissionFeedbackEntry; isLatest?: boolean }) {
  return (
    <li className="space-y-1.5 rounded-lg border border-border/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {formatDateTime(f.gradedAt)} · {f.instructorName}
          {isLatest ? <span className="ml-2 font-medium text-foreground">Dernière correction</span> : null}
        </span>
        <div className="flex items-center gap-1.5">
          {f.note !== null ? <Badge variant="secondary">{f.note}/100</Badge> : null}
          <Badge
            variant="outline"
            className={cn(
              "border text-[10px] font-medium",
              f.validated
                ? "bg-success/15 text-success border-success/30"
                : "bg-muted text-muted-foreground border-transparent"
            )}
          >
            {f.validated ? "Validé" : "Non validé"}
          </Badge>
        </div>
      </div>
      {f.comment ? <p className="whitespace-pre-wrap text-sm text-muted-foreground">{f.comment}</p> : null}
    </li>
  );
}

function CorrectionDetailPage() {
  const { id } = Route.useParams();
  const { submission: d, isLoading, isError, refetch } = useInstructorSubmissionDetail(id);

  const [gradeOpen, setGradeOpen] = useState(false);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link to="/corrections">
        <ArrowLeft className="size-4" /> Retour aux corrections
      </Link>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-lg bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {backButton}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger cette soumission.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="space-y-6">
        {backButton}
        <p className="text-muted-foreground">Soumission introuvable.</p>
      </div>
    );
  }

  const fileUrl = resolveStorageUrl(d.fileUrl);
  const feedbacks = sortFeedbacksDesc(d.feedbacks);
  const latest = getLatestFeedback(d.feedbacks);

  // Même forme que celle de la liste des soumissions, pour réutiliser le dialog de notation (pré-rempli avec la dernière correction)
  const gradeTarget: APIInstructorSubmission = {
    id: d.submissionId,
    lessonId: d.lesson.id,
    lessonTitle: d.lesson.title,
    studentId: d.student.id,
    studentName: d.student.name,
    body: d.body,
    fileUrl: d.fileUrl,
    status: d.status,
    submittedAt: d.submittedAt,
    feedback: latest
      ? { id: latest.id, note: latest.note, comment: latest.comment, validated: latest.validated }
      : null,
  };

  const isPending = d.status === "submitted" || d.status === "under_review";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={d.training.title}
        title={d.lesson.title}
        description={`Travail de ${d.student.name}`}
        actions={
          <>
            {backButton}
            <Button variant={isPending ? "accent" : "soft"} size="sm" onClick={() => setGradeOpen(true)}>
              <ClipboardCheck className="size-4" /> {isPending ? "Corriger" : "Modifier la décision"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-lg">Livrable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {d.body ? (
                <p className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">{d.body}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">Aucun texte joint.</p>
              )}

              {fileUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreview({ url: fileUrl, title: `${d.student.name} — ${d.lesson.title}` })}
                >
                  <Paperclip className="size-4" /> Voir le fichier
                </Button>
              ) : (
                <p className="text-sm italic text-muted-foreground">Aucun fichier joint.</p>
              )}
            </CardContent>
          </Card>

          {d.lesson.brief || d.lesson.instructions ? (
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle className="font-display text-lg">Énoncé de la leçon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {d.lesson.brief ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Résumé</p>
                    <p className="whitespace-pre-wrap text-sm">{d.lesson.brief}</p>
                  </div>
                ) : null}
                {d.lesson.instructions ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consignes</p>
                    <p className="whitespace-pre-wrap text-sm">{d.lesson.instructions}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-lg">Historique des corrections ({feedbacks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Ce travail n'a pas encore été corrigé.</p>
              ) : (
                <ul className="space-y-2">
                  {feedbacks.map((f, i) => (
                    <FeedbackItem key={f.id} feedback={f} isLatest={i === 0} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <Card className="border-border/70">
            <CardContent className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Statut</p>
              <InstructorSubmissionBadge status={d.status} />
              <p className="text-xs text-muted-foreground">Déposé le {formatDateTime(d.submittedAt)}</p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {lessonKindLabels[d.lesson.kind] ?? d.lesson.kind}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {d.lesson.isMandatory ? "Obligatoire" : "Facultatif"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Apprenant</p>
              <div>
                <p className="text-sm font-medium">{d.student.name}</p>
                <p className="text-xs text-muted-foreground">{d.student.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/students/$studentId" params={{ studentId: d.student.id }}>Profil</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    to="/trainings/$trainingId/students/$studentId"
                    params={{ trainingId: d.training.id, studentId: d.student.id }}
                  >
                    Suivi dans la formation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Formation</p>
              <Link
                to="/trainings/$trainingId"
                params={{ trainingId: d.training.id }}
                className="block text-sm font-medium hover:underline"
              >
                {d.training.title}
              </Link>
              {d.enrollment ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progression de l'apprenant</span>
                    <span className="font-medium">{d.enrollment.progress}%</span>
                  </div>
                  <Progress value={d.enrollment.progress} className="h-1.5" />
                </div>
              ) : (
                <p className="text-xs italic text-muted-foreground">Soumission non rattachée à une inscription.</p>
              )}
            </CardContent>
          </Card>

          {d.otherSubmissions.length > 0 ? (
            <Card className="border-border/70">
              <CardContent className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Autres soumissions de cet apprenant ({d.otherSubmissions.length})
                </p>
                <ul className="space-y-2">
                  {d.otherSubmissions.map((o) => {
                    const last = getLatestFeedback(o.feedbacks);
                    return (
                      <li key={o.submissionId} className="space-y-1.5 rounded-lg border border-border/60 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <InstructorSubmissionBadge status={o.status} />
                          <Button asChild size="sm" variant="ghost" className="h-7 px-2">
                            <Link to="/corrections/$id" params={{ id: o.submissionId }}>
                              <Eye className="size-3.5" /> Ouvrir
                            </Link>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Déposée le {formatDateTime(o.submittedAt)}
                          {last?.note !== null && last?.note !== undefined ? ` · Note : ${last.note}/100` : ""}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <SubmissionGradeDialog submission={gradeOpen ? gradeTarget : null} onClose={() => setGradeOpen(false)} />

      <FilePreviewModal url={preview?.url ?? null} title={preview?.title ?? ""} onClose={() => setPreview(null)} />
    </div>
  );
}