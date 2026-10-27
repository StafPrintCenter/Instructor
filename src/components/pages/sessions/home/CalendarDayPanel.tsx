import { SessionCard } from "@/components/pages/sessions/shared";
import type { APIInstructorSession } from "@/data/sessions";
import { formatDayKey } from "@/lib/session-calendar";

interface CalendarDayPanelProps {
  dayKey: string | null;
  sessions: APIInstructorSession[];
}

export function CalendarDayPanel({ dayKey, sessions }: CalendarDayPanelProps) {
  if (!dayKey) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Sélectionnez un jour pour afficher ses sessions.
      </p>
    );
  }

  return (
    <section className="space-y-3">
      <h3 className="font-display text-lg capitalize">{formatDayKey(dayKey)}</h3>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune session ce jour-là.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} variant="global" />
          ))}
        </div>
      )}
    </section>
  );
}