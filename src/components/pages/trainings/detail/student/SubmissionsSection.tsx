import { useState } from "react";
import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { FilePreviewModal } from "@/components/site";
import { SubmissionCard, SubmissionGradeDialog } from "@/components/pages/submissions";
import type { APIInstructorSubmission } from "@/data/submissions";
import {
  toInstructorSubmission,
  type APIInstructorStudentSubmission,
  type APIInstructorTrainingStudentDetail,
} from "@/data/training-students";

interface StudentSubmissionsSectionProps {
  student: APIInstructorTrainingStudentDetail;
  submissions: APIInstructorStudentSubmission[];
}

export function StudentSubmissionsSection({ student, submissions }: StudentSubmissionsSectionProps) {
  const [toGrade, setToGrade] = useState<APIInstructorSubmission | null>(null);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const toValidate = submissions.filter((s) => s.status === "submitted").length;

  return (
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

      <SubmissionGradeDialog submission={toGrade} onClose={() => setToGrade(null)} />
      <FilePreviewModal url={preview?.url ?? null} title={preview?.title ?? ""} onClose={() => setPreview(null)} />
    </section>
  );
}