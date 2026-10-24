import { SessionActions, SessionModalityBadge, SessionStatusBadge } from "@/components/pages/sessions";
import type { APIInstructorSessionDetail } from "@/data/sessions";
import { formatSessionDateTime, getSessionDayParts } from "@/lib/session-time";

interface TrainingSessionHeroProps {
  session: APIInstructorSessionDetail;
  trainingTitle: string;
  mainColor: string;
  onDeleted: () => void;
}

export function TrainingSessionHero({ session, trainingTitle, mainColor, onDeleted }: TrainingSessionHeroProps) {
  const day = getSessionDayParts(session.startsAt);

  return (
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
            {!session.isUpcoming ? <span className="text-xs text-muted-foreground">Session passée</span> : null}
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
        <SessionActions session={session} onDeleted={onDeleted} />
      </div>
    </div>
  );
}