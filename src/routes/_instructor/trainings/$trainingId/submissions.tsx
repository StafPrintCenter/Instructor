import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Inbox, RefreshCw } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePreviewModal } from "@/components/site/FilePreviewModal";
import { PaginationBar } from "@/components/site";
import { SubmissionCard, SubmissionGradeDialog } from "@/components/pages/submissions/shared";
import {
  SUBMISSION_STATUSES,
  instructorSubmissionStatusLabels,
  type APIInstructorSubmission,
  type SubmissionStatus,
} from "@/data/submissions";
import { toInstructorSubmission } from "@/data/training-students";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import { useInstructorTrainingStudents } from "@/stores/useTrainingStudentsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/submissions")({
  head: () => ({
    meta: [
      { title: `Soumissions de la formation - Espace Formateur ${SITE.name}` },
      { name: "description", content: "Travaux rendus par l'ensemble des apprenants de la formation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrainingSubmissionsPage,
});

const PAGE_SIZE = 12;

function TrainingSubmissionsPage() {
  const { trainingId } = Route.useParams();
  const { overview, isLoading: isOverviewLoading } = useInstructorTrainingOverview(trainingId);

  const students = overview?.students.data ?? [];
  const { overviews, isLoading: isDetailsLoading, isError, refetch } = useInstructorTrainingStudents(
    trainingId,
    students.map((s) => s.studentId)
  );

  const [status, setStatus] = useState<SubmissionStatus | "all">("all");
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [toGrade, setToGrade] = useState<APIInstructorSubmission | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link to="/trainings/$trainingId" params={{ trainingId }}>
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
    </Button>
  );

  if (isOverviewLoading || !overview) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const training = overview.data;

  // Fusion des soumissions de tous les apprenants, plus récentes en premier
  const allRows: APIInstructorSubmission[] = overviews
    .flatMap((o) => (o ? o.submissions.map((s) => toInstructorSubmission(o.data, s)) : []))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const studentRows = studentFilter === "all" ? allRows : allRows.filter((r) => r.studentId === studentFilter);
  const filtered = status === "all" ? studentRows : studentRows.filter((r) => r.status === status);

  const countByStatus = (s: SubmissionStatus) => studentRows.filter((r) => r.status === s).length;

  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, lastPage);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filters: (SubmissionStatus | "all")[] = ["all", ...SUBMISSION_STATUSES];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={training.theme}
        title="Soumissions de la formation"
        description={training.title}
        actions={backButton}
      />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={status === f ? "accent" : "outline"}
              onClick={() => {
                setStatus(f);
                setPage(1);
              }}
            >
              {f === "all"
                ? `Tous (${studentRows.length})`
                : `${instructorSubmissionStatusLabels[f]} (${countByStatus(f)})`}
            </Button>
          ))}
        </div>

        <div className="max-w-xs">
          <Select
            value={studentFilter}
            onValueChange={(v) => {
              setStudentFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les apprenants</SelectItem>
              {students.map((s) => (
                <SelectItem key={s.studentId} value={s.studentId}>
                  {`${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.email || "Apprenant"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Aucun apprenant inscrit"
          description="Les soumissions apparaîtront dès que des apprenants seront inscrits à cette formation."
        />
      ) : isDetailsLoading ? (
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger toutes les soumissions.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Aucune soumission"
          description="Aucun travail ne correspond à ces filtres."
        />
      ) : (
        <div className="space-y-4">
          {pageRows.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              onGrade={setToGrade}
              onPreview={(url, title) => setPreview({ url, title })}
              renderStudent={(sub) => (
                <Link
                  to="/trainings/$trainingId/students/$studentId"
                  params={{ trainingId, studentId: sub.studentId }}
                  className="font-medium hover:underline"
                >
                  {sub.studentName}
                </Link>
              )}
            />
          ))}
          <PaginationBar page={currentPage} lastPage={lastPage} total={filtered.length} onPageChange={setPage} />
        </div>
      )}

      <SubmissionGradeDialog submission={toGrade} onClose={() => setToGrade(null)} />

      <FilePreviewModal url={preview?.url ?? null} title={preview?.title ?? ""} onClose={() => setPreview(null)} />
    </div>
  );
}