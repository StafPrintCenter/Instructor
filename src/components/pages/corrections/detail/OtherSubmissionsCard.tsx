import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { InstructorSubmissionBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLatestFeedback, type APIInstructorOtherSubmission } from "@/data/submissions";
import { formatDateTime } from "@/lib/date-time";

export function OtherSubmissionsCard({ others }: { others: APIInstructorOtherSubmission[] }) {
  if (others.length === 0) return null;

  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Autres soumissions de cet apprenant ({others.length})
        </p>
        <ul className="space-y-2">
          {others.map((o) => {
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
  );
}