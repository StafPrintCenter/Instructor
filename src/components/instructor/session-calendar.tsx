import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SessionRow } from "@/lib/api";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function SessionCalendar({
  sessions,
  renderSession,
}: {
  sessions: SessionRow[];
  renderSession: (s: SessionRow) => ReactNode;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<string>(dayKey(today));

  const byDay = useMemo(() => {
    const map = new Map<string, SessionRow[]>();
    for (const s of sessions) {
      const k = dayKey(new Date(s.starts_at));
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    for (const list of map.values()) list.sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
    return map;
  }, [sessions]);

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // lundi = 0
    const start = new Date(first);
    start.setDate(first.getDate() - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const selectedSessions = byDay.get(selected) ?? [];

  return (
    <div className="space-y-5">
      <Card className="border-border/70">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl capitalize">{monthLabel}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                aria-label="Mois précédent"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="soft" size="sm" onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(dayKey(today)); }}>
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                aria-label="Mois suivant"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d) => {
              const k = dayKey(d);
              const list = byDay.get(k) ?? [];
              const isCurrentMonth = d.getMonth() === cursor.getMonth();
              const isToday = k === dayKey(today);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelected(k)}
                  className={cn(
                    "min-h-20 rounded-lg border border-border/60 p-1.5 text-left transition-colors hover:bg-secondary",
                    !isCurrentMonth && "opacity-40",
                    selected === k && "border-accent bg-accent/15",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-md text-xs tabular-nums",
                      isToday && "bg-primary text-primary-foreground",
                    )}
                  >
                    {d.getDate()}
                  </span>
                  <span className="mt-1 flex flex-col gap-0.5">
                    {list.slice(0, 2).map((s) => (
                      <span
                        key={s.id}
                        className={cn(
                          "truncate rounded px-1 py-0.5 text-[10px]",
                          s.mode === "live" ? "bg-chart-2/20 text-foreground" : "bg-accent/30 text-accent-foreground",
                        )}
                      >
                        {new Date(s.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} {s.title}
                      </span>
                    ))}
                    {list.length > 2 ? (
                      <span className="text-[10px] text-muted-foreground">+{list.length - 2} autre(s)</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-display text-lg">
          Sessions du{" "}
          {new Date(
            Number(selected.split("-")[0]),
            Number(selected.split("-")[1]),
            Number(selected.split("-")[2]),
          ).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </h4>
        {selectedSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune session ce jour-là.</p>
        ) : (
          selectedSessions.map(renderSession)
        )}
      </div>
    </div>
  );
}
