import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { PageHeader } from "@/components/site";
import { Button } from "@/components/ui/button";
import { FilePreviewModal } from "@/components/site/FilePreviewModal";
import { PaginationBar } from "@/components/site";
import { SubmissionCard, SubmissionGradeDialog } from "@/components/pages/submissions";
import { SUBMISSION_STATUSES, instructorSubmissionStatusLabels, type APIInstructorSubmission, type SubmissionStatus } from "@/data/submissions";
import type { InstructorPaginationMeta } from "@/data/pagination";
import { useInstructorSubmissionsList } from "@/stores/useSubmissionsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/submissions")({
  head: () => ({
    meta: [
      { title: `Travaux rendus | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Consultez, notez et validez les travaux déposés par les apprenants de vos formations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const [status, setStatus] = useState<SubmissionStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { items, meta, isLoading, isError, refetch } = useInstructorSubmissionsList({
    status: status === "all" ? undefined : status,
    page,
  });
  const pagination = meta as InstructorPaginationMeta | null;

  const [toGrade, setToGrade] = useState<APIInstructorSubmission | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  // Si la dernière page se vide (ex. après une notation avec filtre actif), on recule d'une page
  useEffect(() => {
    if (pagination && pagination.lastPage >= 1 && page > pagination.lastPage) setPage(pagination.lastPage);
  }, [pagination, page]);

  const filters: (SubmissionStatus | "all")[] = ["all", ...SUBMISSION_STATUSES];

  const changeStatus = (next: SubmissionStatus | "all") => {
    setStatus(next);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suivi"
        title="Travaux rendus"
        description="Consultez les travaux déposés par vos apprenants, puis notez-les ou validez-les."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button key={f} size="sm" variant={status === f ? "accent" : "outline"} onClick={() => changeStatus(f)}>
            {f === "all" ? "Tous" : instructorSubmissionStatusLabels[f]}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger les travaux rendus.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Aucun travail"
          description={
            status === "all"
              ? "Aucun travail n'a encore été déposé dans vos formations."
              : "Aucun travail ne correspond à ce statut."
          }
        />
      ) : (
        <div className="space-y-4">
          {items.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              onGrade={setToGrade}
              onPreview={(url, title) => setPreview({ url, title })}
            />
          ))}
          {pagination ? (
            <PaginationBar
              page={pagination.currentPage}
              lastPage={pagination.lastPage}
              total={pagination.total}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      )}

      <SubmissionGradeDialog submission={toGrade} onClose={() => setToGrade(null)} />

      <FilePreviewModal url={preview?.url ?? null} title={preview?.title ?? ""} onClose={() => setPreview(null)} />
    </div>
  );
}