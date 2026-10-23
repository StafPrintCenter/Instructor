// src/components/instructor/sessions/SessionCard.tsx
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Clock, Hourglass, MapPin, Users, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SessionStatusBadge } from "@/components/instructor/sessions/SessionBadges";
import type { APIInstructorSession } from "@/data/sessions";
import { formatSessionTimeRange, getSessionDayParts } from "@/lib/session-time";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: APIInstructorSession;
  /** "global" : liste /sessions (affiche la formation) — "training" : liste dans le détail d'une formation */
  variant?: "global" | "training";
}

export function SessionCard({ session: s, variant = "global" }: SessionCardProps) {
  const day = getSessionDayParts(s.startsAt);
  const isSuspended = s.status === "suspended";

  return (
    <Card className={cn("overflow-hidden border-border/70 transition-shadow hover:shadow-md", isSuspended && "border-destructive/30")}>
      <CardContent className="flex gap-4 p-4 sm:p-5">
        <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="text-[10px] font-semibold uppercase">{day.weekday}</span>
          <span className="font-display text-2xl font-bold leading-none">{day.day}</span>
          <span className="text-[10px] uppercase">{day.month}</span>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg leading-snug">
                {variant === "training" ? (
                  <Link
                    to="/trainings/$trainingId/sessions/$sessionId"
                    params={{ trainingId: s.trainingId, sessionId: s.id }}
                    className="hover:underline"
                  >
                    {s.title}
                  </Link>
                ) : (
                  <Link to="/sessions/$id" params={{ id: s.id }} className="hover:underline">
                    {s.title}
                  </Link>
                )}
              </h3>
              {variant === "global" ? <p className="text-xs text-muted-foreground">{s.trainingTitle}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {!s.isUpcoming ? (
                <Badge variant="secondary" className="text-[10px]">Passée</Badge>
              ) : null}
              <SessionStatusBadge status={s.status} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> {formatSessionTimeRange(s.startsAt, s.endsAt)} · {Number(s.durationMinutes)} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              {s.modality === "online" ? (
                <>
                  <Video className="size-3.5" /> En ligne
                </>
              ) : (
                <>
                  <MapPin className="size-3.5" /> {s.location ?? "Lieu à définir"}
                </>
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" /> {s.confirmedCount} confirmé{s.confirmedCount > 1 ? "s" : ""} · {s.declinedCount} absent{s.declinedCount > 1 ? "s" : ""}
            </span>
          </div>

          {isSuspended && s.suspensionReason ? (
            <p className="flex items-start gap-1.5 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" /> Suspendue : {s.suspensionReason}
            </p>
          ) : null}
          {s.pendingReviewRequest ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hourglass className="size-3.5 shrink-0" /> Réexamen demandé, en attente de décision
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}