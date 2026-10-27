import { useState } from "react";
import { AlertTriangle, CalendarDays, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PaginationBar } from "@/components/site";
import { SessionCard, SessionFormDialog } from "@/components/pages/sessions";
import { useInstructorTrainingSessions } from "@/stores/useSessionsStore";

interface TrainingSessionsSectionProps {
  trainingId: string;
  mainColor: string;
}

export function TrainingSessionsSection({ trainingId, mainColor }: TrainingSessionsSectionProps) {
  const [page, setPage] = useState(1);
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { items, meta, isLoading, isError, refetch } = useInstructorTrainingSessions(trainingId, {
    page,
    upcoming: upcomingOnly,
  });

  return (
    <section id="sessions" className="scroll-mt-24">
      <Card className="border-border/70">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <CalendarDays
              className="size-5"
              style={{ color: mainColor }}
            />
            Sessions
            ({meta?.total ?? items.length})
          </CardTitle>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="sessions-upcoming"
                checked={upcomingOnly}
                onCheckedChange={(v) => {
                  setUpcomingOnly(v);
                  setPage(1);
                }}
              />
              <Label
                htmlFor="sessions-upcoming"
                className="cursor-pointer text-xs font-normal"
              >
                À venir uniquement
              </Label>
            </div>
            <Button size="sm" variant="accent" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Nouvelle session
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-lg bg-muted" />
              <div className="h-24 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center">
              <AlertTriangle className="size-6 text-destructive" />
              <p className="text-sm text-muted-foreground">Impossible de charger les sessions.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="size-4" /> Réessayer
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarDays className="size-12 text-muted-foreground/40" />

              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {
                  upcomingOnly
                    ? "Aucune session à venir pour cette formation."
                    : "Aucune session planifiée pour cette formation."
                }
              </p>
            </div>
          ) : (
            <>
              {items.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  variant="training"
                />
              ))}

              {meta ? (
                <PaginationBar
                  page={meta.currentPage}
                  lastPage={meta.lastPage}
                  total={meta.total}
                  onPageChange={setPage}
                />
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <SessionFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        trainingId={trainingId}
      />
    </section>
  );
}