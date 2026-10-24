import { Link } from "@tanstack/react-router";
import type { APIInstructorSession } from "@/data/sessions";
import { WEEKDAY_LABELS, type CalendarCell } from "@/lib/session-calendar";
import { formatSessionTime } from "@/lib/session-time";
import { cn } from "@/lib/utils";

const MAX_CHIPS = 3;

function chipTone(s: APIInstructorSession) {
  if (s.status === "suspended") return "bg-destructive/10 text-destructive";
  if (!s.isUpcoming) return "bg-muted text-muted-foreground";
  return "bg-primary/10 text-primary";
}

interface CalendarMonthGridProps {
  cells: CalendarCell[];
  sessionsByDay: Record<string, APIInstructorSession[]>;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export function CalendarMonthGrid({ cells, sessionsByDay, selectedKey, onSelect }: CalendarMonthGridProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
      <div className="min-w-170">
        <div className="grid grid-cols-7 border-b border-border/70 bg-muted/30">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((cell) => {
            const sessions = sessionsByDay[cell.key] ?? [];
            const visible = sessions.slice(0, MAX_CHIPS);
            const extra = sessions.length - visible.length;
            const isSelected = cell.key === selectedKey;

            return (
              <div
                key={cell.key}
                className={cn(
                  "min-h-28 space-y-1 border-b border-r border-border/50 p-1.5",
                  !cell.inMonth && "bg-muted/30",
                  isSelected && "bg-primary/5"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(cell.key)}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    cell.inMonth ? "text-foreground" : "text-muted-foreground",
                    cell.isToday && "bg-primary text-primary-foreground",
                    isSelected && !cell.isToday && "ring-2 ring-primary"
                  )}
                  aria-label={`Voir les sessions du ${cell.key}`}
                >
                  {cell.day}
                </button>

                <div className="space-y-1">
                  {visible.map((s) => (
                    <Link
                      key={s.id}
                      to="/sessions/$id"
                      params={{ id: s.id }}
                      title={`${formatSessionTime(s.startsAt)} — ${s.title}`}
                      className={cn("block truncate rounded px-1.5 py-0.5 text-[11px] font-medium hover:opacity-80", chipTone(s))}
                    >
                      {formatSessionTime(s.startsAt)} {s.title}
                    </Link>
                  ))}
                  {extra > 0 ? (
                    <button
                      type="button"
                      onClick={() => onSelect(cell.key)}
                      className="px-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                    >
                      +{extra} autre{extra > 1 ? "s" : ""}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}