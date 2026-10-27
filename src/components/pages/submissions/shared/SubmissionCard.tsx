import type { ReactNode } from "react";
import { ClipboardCheck, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstructorSubmissionBadge } from "@/components/shared";
import { resolveStorageUrl } from "@/lib/file-url";
import { formatDateTime } from "@/lib/date-time";
import type { APIInstructorSubmission } from "@/data/submissions";

interface SubmissionCardProps {
  submission: APIInstructorSubmission;
  onGrade: (submission: APIInstructorSubmission) => void;
  onPreview: (url: string, title: string) => void;
  hideStudent?: boolean;
  renderStudent?: (submission: APIInstructorSubmission) => ReactNode;
}

export function SubmissionCard({ submission: s, onGrade, onPreview, hideStudent, renderStudent }: SubmissionCardProps) {
  const fileUrl = resolveStorageUrl(s.fileUrl);
  const hasFeedback = !!s.feedback && (s.feedback.note !== null || !!s.feedback.comment);

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg leading-snug">{s.lessonTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {hideStudent ? null : (
                <>
                  {renderStudent ? renderStudent(s) : s.studentName} ·{" "}
                </>
              )}
              {formatDateTime(s.submittedAt)}
            </p>
          </div>
          <InstructorSubmissionBadge status={s.status} />
        </div>

        {s.body ? (
          <p className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-3 text-sm">{s.body}</p>
        ) : (
          <p className="text-xs italic text-muted-foreground">Aucun texte joint.</p>
        )}

        {hasFeedback ? (
          <div className="space-y-1 rounded-lg border border-border/60 bg-card p-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Retour du formateur</p>
            {s.feedback?.note !== null && s.feedback?.note !== undefined ? (
              <p className="font-medium">Note : {s.feedback.note}/100</p>
            ) : null}
            {s.feedback?.comment ? (
              <p className="whitespace-pre-wrap text-muted-foreground">{s.feedback.comment}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {fileUrl ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(fileUrl, `${s.studentName} - ${s.lessonTitle}`)}
            >
              <Paperclip className="size-4" /> Voir le fichier
            </Button>
          ) : null}
          <Button variant={s.status === "submitted" ? "accent" : "soft"} size="sm" onClick={() => onGrade(s)}>
            <ClipboardCheck className="size-4" />
            {s.status === "submitted" ? "Noter" : "Modifier la décision"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}