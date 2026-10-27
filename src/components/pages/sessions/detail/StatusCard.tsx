import { Card, CardContent } from "@/components/ui/card";
import { SessionStatusBadge } from "@/components/shared";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionShortDateTime } from "@/lib/session-time";

export function SessionStatusCard({ session }: { session: APIInstructorSessionDetail }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Statut</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <SessionStatusBadge status={session.status} />
          {!session.isUpcoming ? <span className="text-xs text-muted-foreground">Session passée</span> : null}
        </div>

        {session.status === "suspended" ? (
          <div className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <p className="font-medium text-destructive">Session suspendue</p>
            {session.suspensionReason ? <p className="text-muted-foreground">{session.suspensionReason}</p> : null}
            {session.suspendedAt ? (
              <p className="text-xs text-muted-foreground">
                Le {formatSessionShortDateTime(session.suspendedAt)}
                {session.suspendedBy ? ` par ${session.suspendedBy}` : ""}
              </p>
            ) : null}
          </div>
        ) : null}

        {session.pendingReviewRequest ? (
          <p className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
            Une demande de réexamen est en attente de décision.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}