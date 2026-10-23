// src/routes/_instructor/trainings/$trainingId/sessions.$sessionId.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Clock, ExternalLink, MapPin, RefreshCw, UserRound, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SessionActions,
  SessionModalityBadge,
  SessionResponseBadge,
  SessionStatusBadge,
} from "@/components/instructor/sessions";
import { getReviewRequestStatusLabel } from "@/data/sessions";
import { useInstructorSessionDetail } from "@/stores/useSessionsStore";
import { useInstructorTrainingOverview } from "@/stores/useTrainingsStore";
import {
  formatSessionDateTime,
  formatSessionShortDateTime,
  formatSessionTimeRange,
  getSessionDayParts,
} from "@/lib/session-time";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/trainings/$trainingId/sessions/$sessionId")({
  head: () => ({
    meta: [
      { title: `Session de formation | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Détail d'une session de la formation : participation et historique." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrainingSessionPage,
});

type TimelineTone = "info" | "success" | "danger" | "muted";

interface TimelineEvent {
  key: string;
  at: string;
  title: string;
  detail?: string | null;
  tone: TimelineTone;
}

const DOT_CLASS: Record<TimelineTone, string> = {
  info: "bg-primary",
  success: "bg-success",
  danger: "bg-destructive",
  muted: "bg-muted-foreground/50",
};

function TrainingSessionPage() {
  const { trainingId, sessionId } = Route.useParams();
  const navigate = useNavigate();
  const { overview } = useInstructorTrainingOverview(trainingId);
  const { item: session, isLoading, isError, refetch } = useInstructorSessionDetail(sessionId);

  const mainColor = overview?.data.coverColor || "var(--primary)";
  const trainingTitle = overview?.data.title ?? session?.trainingTitle ?? "la formation";

  const backLink = (
    <Button asChild variant="outline" size="sm">
      <Link to="/trainings/$trainingId" params={{ trainingId }} hash="sessions">
        <ArrowLeft className="size-4" /> Retour aux sessions de la formation
      </Link>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger cette session.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Le détail renvoyé est le même quel que soit le chemin : on vérifie l'appartenance à la formation de l'URL
  if (!session || session.trainingId !== trainingId) {
    return (
      <div className="space-y-6">
        {backLink}
        <p className="text-muted-foreground">Session introuvable dans cette formation.</p>
      </div>
    );
  }

  const day = getSessionDayParts(session.startsAt);
  const confirmed = session.confirmedCount;
  const declined = session.declinedCount;
  const invited = session.invitedCount ?? confirmed + declined;
  const waiting = Math.max(invited - confirmed - declined, 0);
  const pct = (n: number) => (invited > 0 ? `${(n / invited) * 100}%` : "0%");

  // Chronologie : création, suspension éventuelle, puis chaque demande de réexamen et sa décision
  const events: TimelineEvent[] = [
    { key: "created", at: session.createdAt, title: "Session créée et publiée", tone: "info" },
  ];
  if (session.suspendedAt) {
    events.push({
      key: "suspended",
      at: session.suspendedAt,
      title: "Session suspendue",
      detail: [session.suspensionReason, session.suspendedBy ? `Par ${session.suspendedBy}` : null]
        .filter(Boolean)
        .join(" — "),
      tone: "danger",
    });
  }
  session.reviewRequests.forEach((r) => {
    events.push({
      key: `${r.id}-request`,
      at: r.createdAt,
      title: "Demande de réexamen envoyée",
      detail: r.message,
      tone: "muted",
    });
    if (r.reviewedAt) {
      events.push({
        key: `${r.id}-review`,
        at: r.reviewedAt,
        title: `Réexamen : ${getReviewRequestStatusLabel(r.status).toLowerCase()}`,
        detail: r.rejectionReason,
        tone: r.status === "validated" ? "success" : r.status === "rejected" ? "danger" : "muted",
      });
    }
  });
  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <div className="space-y-8">
      {backLink}

      {/* Héros aux couleurs de la formation */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border/60 p-6 sm:p-8"
        style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${mainColor} 14%, transparent) 0%, transparent 100%)` }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <div
            className="flex size-24 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-md"
            style={{ backgroundColor: mainColor }}
          >
            <span className="text-xs font-semibold uppercase">{day.weekday}</span>
            <span className="font-display text-4xl font-bold leading-none">{day.day}</span>
            <span className="text-xs uppercase">{day.month} {day.year}</span>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <SessionStatusBadge status={session.status} />
              <SessionModalityBadge modality={session.modality} />
              {!session.isUpcoming ? (
                <span className="text-xs text-muted-foreground">Session passée</span>
              ) : null}
            </div>
            <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{session.title}</h1>
            <p className="text-sm text-muted-foreground">
              {trainingTitle} · {formatSessionDateTime(session.startsAt)}
            </p>
            {session.description ? (
              <p className="max-w-3xl whitespace-pre-wrap text-sm leading-relaxed">{session.description}</p>
            ) : null}
          </div>
        </div>

        <div className="relative mt-6">
          <SessionActions
            session={session}
            onDeleted={() => navigate({ to: "/trainings/$trainingId", params: { trainingId }, hash: "sessions" })}
          />
        </div>
      </div>

      {/* Bandeau d'informations pratiques */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
          <Clock className="size-5 shrink-0" style={{ color: mainColor }} />
          <div>
            <p className="text-xs text-muted-foreground">Horaire</p>
            <p className="text-sm font-medium">
              {formatSessionTimeRange(session.startsAt, session.endsAt)} · {Number(session.durationMinutes)} min
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
          {session.modality === "online" ? (
            <Video className="size-5 shrink-0" style={{ color: mainColor }} />
          ) : (
            <MapPin className="size-5 shrink-0" style={{ color: mainColor }} />
          )}
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{session.modality === "online" ? "Réunion en ligne" : "Lieu"}</p>
            {session.modality === "online" && session.meetingUrl ? (
              <a
                href={session.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Rejoindre <ExternalLink className="size-3.5" />
              </a>
            ) : (
              <p className="truncate text-sm font-medium">{session.location ?? "À définir"}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
          <UserRound className="size-5 shrink-0" style={{ color: mainColor }} />
          <div>
            <p className="text-xs text-muted-foreground">Animateur</p>
            <p className="text-sm font-medium">{session.instructorName}</p>
          </div>
        </div>
      </div>

      {/* Participation */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="font-display text-xl">Participation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {invited === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun apprenant n'a été invité à cette session.</p>
          ) : (
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
          )}

          {session.responses.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {session.responses.map((r) => {
                const initials = r.studentName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div key={r.studentId} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                    <Avatar className="size-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials || "AP"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/trainings/$trainingId/students/$studentId"
                        params={{ trainingId, studentId: r.studentId }}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {r.studentName}
                      </Link>
                      {r.respondedAt ? (
                        <p className="text-[11px] text-muted-foreground">{formatSessionShortDateTime(r.respondedAt)}</p>
                      ) : null}
                    </div>
                    <SessionResponseBadge response={r.response} />
                  </div>
                );
              })}
            </div>
          ) : invited > 0 ? (
            <p className="text-sm text-muted-foreground">Aucune réponse reçue pour le moment.</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Historique */}
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="font-display text-xl">Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-6 border-l border-border/70 pl-6">
            {events.map((e) => (
              <li key={e.key} className="relative">
                <span
                  className={cn("absolute -left-[1.9rem] top-1 size-3 rounded-full ring-4 ring-card", DOT_CLASS[e.tone])}
                />
                <p className="text-sm font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">{formatSessionShortDateTime(e.at)}</p>
                {e.detail ? <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{e.detail}</p> : null}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}