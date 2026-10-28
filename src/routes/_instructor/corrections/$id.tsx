import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { PageHeader, FilePreviewModal } from "@/components/site";
import { Button } from "@/components/ui/button";
import { CorrectionDeliverableCard, CorrectionDetailError, CorrectionDetailSkeleton, CorrectionHistoryCard, CorrectionStatementCard, CorrectionStatusCard, CorrectionStudentCard, CorrectionTrainingCard, OtherSubmissionsCard, buildGradeTarget } from "@/components/pages/corrections/detail";
import { SubmissionGradeDialog } from "@/components/pages/submissions";
import { isGradedStatus } from "@/data/submissions";
import { useInstructorSubmissionDetail } from "@/stores/useSubmissionsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/corrections/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${SITE.tool} - Correction ${params.id} | ${SITE.name}` },
      { name: "description", content: `Consultez le travail ${params.id}, son livrable, les consignes associées et l'historique des corrections.` },
    ],
  }),
  component: CorrectionDetailPage,
});

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

  if (isLoading) return <CorrectionDetailSkeleton />;

  if (isError || !d) {
    return (
      <div className="space-y-6">
        {backButton}
        {isError ? (
          <CorrectionDetailError onRetry={() => refetch()} />
        ) : (
          <p className="text-muted-foreground">Soumission introuvable.</p>
        )}
      </div>
    );
  }

  const isPending = !isGradedStatus(d.status);

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
        <div className="space-y-6 lg:col-span-2">
          <CorrectionDeliverableCard
            body={d.body}
            fileUrl={d.fileUrl}
            previewTitle={`${d.student.name} — ${d.lesson.title}`}
            onPreview={(url, title) => setPreview({ url, title })}
          />
          <CorrectionStatementCard brief={d.lesson.brief} instructions={d.lesson.instructions} />
          <CorrectionHistoryCard feedbacks={d.feedbacks} />
        </div>

        <div className="space-y-6">
          <CorrectionStatusCard detail={d} />
          <CorrectionStudentCard student={d.student} trainingId={d.training.id} />
          <CorrectionTrainingCard training={d.training} enrollment={d.enrollment} />
          <OtherSubmissionsCard others={d.otherSubmissions} />
        </div>
      </div>

      <SubmissionGradeDialog submission={gradeOpen ? buildGradeTarget(d) : null} onClose={() => setGradeOpen(false)} />

      <FilePreviewModal url={preview?.url ?? null} title={preview?.title ?? ""} onClose={() => setPreview(null)} />
    </div>
  );
}