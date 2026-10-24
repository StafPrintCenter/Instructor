import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionResponseBadge } from "@/components/instructor/sessions";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionShortDateTime } from "@/lib/session-time";

function ParticipationBar({ confirmed, declined, waiting }: { confirmed: number; declined: number; waiting: number }) {
  const invited = confirmed + declined + waiting;
  const pct = (n: number) => `${(n / invited) * 100}%`;

  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="bg-success" style={{ width: pct(confirmed) }} />
        <div className="bg-destructive" style={{ width: pct(declined) }} />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success" /> {confirmed} confirmé{confirmed > 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-destructive" /> {declined} absent{declined > 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted-foreground/30" /> {waiting} sans réponse
        </span>
        <span className="ml-auto font-medium text-foreground">{invited} invité{invited > 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}

function ResponseChip({
  trainingId,
  response,
}: {
  trainingId: string;
  response: APIInstructorSessionDetail["responses"][number];
}) {
  const initials = response.studentName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
      <Avatar className="size-9 border border-border">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials || "AP"}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <Link
          to="/trainings/$trainingId/students/$studentId"
          params={{ trainingId, studentId: response.studentId }}
          className="block truncate text-sm font-medium hover:underline"
        >
          {response.studentName}
        </Link>
        {response.respondedAt ? (
          <p className="text-[11px] text-muted-foreground">{formatSessionShortDateTime(response.respondedAt)}</p>
        ) : null}
      </div>
      <SessionResponseBadge response={response.response} />
    </div>
  );
}

export function TrainingSessionParticipation({
  session,
  trainingId,
}: {
  session: APIInstructorSessionDetail;
  trainingId: string;
}) {
  const confirmed = session.confirmedCount;
  const declined = session.declinedCount;
  const invited = session.invitedCount ?? confirmed + declined;
  const waiting = Math.max(invited - confirmed - declined, 0);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle className="font-display text-xl">Participation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {invited === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun apprenant n'a été invité à cette session.</p>
        ) : (
          <ParticipationBar confirmed={confirmed} declined={declined} waiting={waiting} />
        )}

        {session.responses.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {session.responses.map((r) => (
              <ResponseChip key={r.studentId} trainingId={trainingId} response={r} />
            ))}
          </div>
        ) : invited > 0 ? (
          <p className="text-sm text-muted-foreground">Aucune réponse reçue pour le moment.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}