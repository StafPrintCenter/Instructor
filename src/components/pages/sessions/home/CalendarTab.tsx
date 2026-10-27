import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstructorSessionsList } from "@/stores/useSessionsStore";
import { buildMonthGrid, formatMonthLabel, groupSessionsByDay, shiftDateKey, shiftMonth, todayKey } from "@/lib/session-calendar";
import { cn } from "@/lib/utils";
import { CalendarDayPanel, CalendarMonthGrid, CalendarToolbar, SharedSessionParams } from "./";

function cursorFromKey(key: string) {
  const [year, month] = key.split("-").map(Number);
  return { year, month: month - 1 };
}

export function SessionCalendarTab({ sharedParams }: { sharedParams: SharedSessionParams }) {
  const [cursor, setCursor] = useState(() => cursorFromKey(todayKey()));
  const [selectedKey, setSelectedKey] = useState<string | null>(() => todayKey());

  const cells = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor.year, cursor.month]);

  const { items, meta, isLoading, isError, refetch } = useInstructorSessionsList({
    ...sharedParams,
    from: shiftDateKey(cells[0].key, -1),
    to: shiftDateKey(cells[cells.length - 1].key, 1),
    perPage: 100,
  });

  const sessionsByDay = useMemo(() => groupSessionsByDay(items), [items]);
  const isTruncated = !!meta && meta.total > items.length;

  const move = (delta: number) => {
    setCursor((c) => shiftMonth(c.year, c.month, delta));
    setSelectedKey(null);
  };

  const goToday = () => {
    setCursor(cursorFromKey(todayKey()));
    setSelectedKey(todayKey());
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="size-6 text-destructive" />
        <p className="text-sm text-muted-foreground">Impossible de charger le calendrier.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="size-4" /> Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CalendarToolbar
        label={formatMonthLabel(cursor.year, cursor.month)}
        isLoading={isLoading}
        onPrev={() => move(-1)}
        onNext={() => move(1)}
        onToday={goToday}
      />

      {isTruncated ? (
        <p className="text-xs text-destructive">
          Seules les {items.length} premières sessions de la période sont affichées ({meta?.total} au total) : affinez les filtres.
        </p>
      ) : null}

      <div className={cn("transition-opacity", isLoading && "opacity-60")}>
        <CalendarMonthGrid
          cells={cells}
          sessionsByDay={sessionsByDay}
          selectedKey={selectedKey}
          onSelect={setSelectedKey}
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-primary/30" /> À venir</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-muted-foreground/30" /> Passée</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded bg-destructive/30" /> Suspendue</span>
      </div>

      <CalendarDayPanel dayKey={selectedKey} sessions={selectedKey ? (sessionsByDay[selectedKey] ?? []) : []} />
    </div>
  );
}