import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionResponseBadge } from "@/components/instructor/sessions";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionShortDateTime } from "@/lib/session-time";

function CountTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export function SessionResponsesCard({ session }: { session: APIInstructorSessionDetail }) {
  const invited = session.invitedCount;
  const waiting = invited !== null ? Math.max(invited - session.confirmedCount - session.declinedCount, 0) : null;

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-lg">Réponses des apprenants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CountTile label="Invités" value={invited ?? "—"} />
          <CountTile label="Confirmés" value={session.confirmedCount} />
          <CountTile label="Absents" value={session.declinedCount} />
          <CountTile label="Sans réponse" value={waiting ?? "—"} />
        </div>

        {session.responses.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun apprenant n'a encore répondu à l'invitation.</p>
        ) : (
          <ul className="space-y-2">
            {session.responses.map((r) => (
              <li
                key={r.studentId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
              >
                <Link
                  to="/students/$studentId"
                  params={{ studentId: r.studentId }}
                  className="text-sm font-medium hover:underline"
                >
                  {r.studentName}
                </Link>
                <div className="flex items-center gap-3">
                  {r.respondedAt ? (
                    <span className="text-xs text-muted-foreground">{formatSessionShortDateTime(r.respondedAt)}</span>
                  ) : null}
                  <SessionResponseBadge response={r.response} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}