import { Card, CardContent } from "@/components/ui/card";
import { ReviewRequestStatusBadge } from "@/components/instructor/sessions";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionShortDateTime } from "@/lib/session-time";

export function SessionReviewRequestsCard({ session }: { session: APIInstructorSessionDetail }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Demandes de réexamen ({session.reviewRequests.length})
        </p>
        {session.reviewRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande.</p>
        ) : (
          <ul className="space-y-2">
            {session.reviewRequests.map((r) => (
              <li key={r.id} className="space-y-1.5 rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <ReviewRequestStatusBadge status={r.status} />
                  <span className="text-[11px] text-muted-foreground">{formatSessionShortDateTime(r.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
                {r.reviewedAt ? (
                  <p className="text-xs text-muted-foreground">
                    Traitée le {formatSessionShortDateTime(r.reviewedAt)}
                    {r.rejectionReason ? ` — ${r.rejectionReason}` : ""}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}