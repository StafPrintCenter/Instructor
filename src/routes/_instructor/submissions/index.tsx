// src/routes/_instructor/submissions/index.tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ClipboardCheck, Inbox, Paperclip, RefreshCw } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstructorSubmissionBadge } from "@/components/instructor/status-badges";
import { FilePreviewModal } from "@/components/site/FilePreviewModal";
import { SubmissionGradeDialog } from "@/components/site/SubmissionGradeDialog";
import { resolveStorageUrl } from "@/lib/file-url";
import {
  SUBMISSION_STATUSES,
  instructorSubmissionStatusLabels,
  type APIInstructorSubmission,
  type SubmissionStatus,
} from "@/data/submissions";
import { useInstructorSubmissionsList } from "@/stores/useSubmissionsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/submissions/")({
  head: () => ({
    meta: [
      { title: `Travaux rendus | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Consultez, notez et validez les travaux déposés par les apprenants de vos formations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmissionsPage,
});

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

function SubmissionsPage() {
  const [status, setStatus] = useState<SubmissionStatus | "all">("all");
  const { items, isLoading, isError, refetch } = useInstructorSubmissionsList({
    status: status === "all" ? undefined : status,
  });

  const [toGrade, setToGrade] = useState<APIInstructorSubmission | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const filters: (SubmissionStatus | "all")[] = ["all", ...SUBMISSION_STATUSES];

  return (
    <div className= "space-y-8" >
    <PageHeader
        eyebrow="Suivi"
  title = "Travaux rendus"
  description = "Consultez les travaux déposés par vos apprenants, puis notez-les ou validez-les."
    />

    <div className="flex flex-wrap gap-2" >
    {
      filters.map((f) => (
        <Button
            key= { f }
            size = "sm"
            variant = { status === f ? "accent" : "outline"}
  onClick = {() => setStatus(f)
}
          >
  { f === "all" ? "Tous" : instructorSubmissionStatusLabels[f]}
</Button>
        ))}
</div>

{
  isLoading ? (
    <div className= "space-y-4" >
    <div className="h-28 animate-pulse rounded-lg bg-muted" />
      <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
          </div>
      ) : isError ? (
    <div className= "flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center" >
    <AlertTriangle className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground" > Impossible de charger les travaux rendus.</p>
        < Button variant = "outline" size = "sm" onClick = {() => refetch()
}>
  <RefreshCw className="size-4" /> Réessayer
    </Button>
    </div>
      ) : items.length === 0 ? (
  <EmptyState
          icon= {< Inbox className = "size-6" />}
title = "Aucun travail"
description = {
  status === "all"
  ? "Aucun travail n'a encore été déposé dans vos formations."
  : "Aucun travail ne correspond à ce statut."
          }
        />
      ) : (
  <div className= "space-y-4" >
  {
    items.map((s) => {
      const fileUrl = resolveStorageUrl(s.fileUrl);
      return (
        <Card key= { s.id } className = "border-border/70" >
          <CardContent className="space-y-3 p-5" >
            <div className="flex flex-wrap items-start justify-between gap-3" >
              <div className="min-w-0" >
                <h2 className="font-display text-lg leading-snug" > { s.lessonTitle } </h2>
                  < p className = "text-sm text-muted-foreground" >
                    { s.studentName } · { formatDateTime(s.submittedAt) }
      </p>
        </div>
        < InstructorSubmissionBadge status = { s.status } />
          </div>

      {
        s.body ? (
          <p className= "whitespace-pre-wrap rounded-lg border bg-muted/20 p-3 text-sm" > { s.body } </p>
                  ) : (
            <p className="text-xs italic text-muted-foreground" > Aucun texte joint.</p>
          )}

<div className="flex flex-wrap items-center gap-2" >
  {
    fileUrl?(
                      <Button
                        variant = "outline"
                        size = "sm"
                        onClick = {() => setPreview({ url: fileUrl, title: `${s.studentName} — ${s.lessonTitle}` })}
                      >
  <Paperclip className="size-4" /> Voir le fichier
    </Button>
                    ) : null}
<Button
                      variant={ s.status === "submitted" ? "accent" : "soft" }
size = "sm"
onClick = {() => setToGrade(s)}
                    >
  <ClipboardCheck className="size-4" />
    { s.status === "submitted" ? "Noter" : "Modifier la décision" }
    </Button>
    </div>
    </CardContent>
    </Card>
            );
          })}
</div>
      )}

<SubmissionGradeDialog submission={ toGrade } onClose = {() => setToGrade(null)} />

  < FilePreviewModal
url = { preview?.url ?? null}
title = { preview?.title ?? ""}
onClose = {() => setPreview(null)}
      />
  </div>
  );
}