import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CalendarDays, Plus, RefreshCw, Search, X } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaginationBar } from "@/components/site/PaginationBar";
import { SessionCard, SessionFormDialog } from "@/components/instructor/sessions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  SESSION_MODALITIES,
  SESSION_STATUSES,
  getSessionStatusLabel,
  sessionModalityLabels,
  type SessionModality,
  type SessionStatus,
} from "@/data/sessions";
import { useInstructorSessionsList } from "@/stores/useSessionsStore";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/sessions/")({
  head: () => ({
    meta: [
      { title: `Sessions | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Planifiez et suivez les sessions de vos formations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SessionsPage,
});

interface Filters {
  status: SessionStatus | "all";
  modality: SessionModality | "all";
  trainingId: string; // "all" ou id
  upcoming: boolean;
  query: string;
  from: string;
  to: string;
}

const DEFAULT_FILTERS: Filters = {
  status: "all",
  modality: "all",
  trainingId: "all",
  upcoming: true,
  query: "",
  from: "",
  to: "",
};

function SessionsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const debouncedQuery = useDebouncedValue(filters.query.trim());
  const isRangeInvalid = !!filters.from && !!filters.to && filters.to < filters.from;

  const params = useMemo(
    () => ({
      status: filters.status === "all" ? undefined : filters.status,
      modality: filters.modality === "all" ? undefined : filters.modality,
      trainingId: filters.trainingId === "all" ? undefined : filters.trainingId,
      upcoming: filters.upcoming,
      query: debouncedQuery || undefined,
      from: filters.from || undefined,
      to: isRangeInvalid ? undefined : filters.to || undefined,
      page,
    }),
    [filters.status, filters.modality, filters.trainingId, filters.upcoming, debouncedQuery, filters.from, filters.to, isRangeInvalid, page]
  );

  const { items, meta, isLoading, isError, refetch } = useInstructorSessionsList(params);
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });

  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) setPage(meta.lastPage);
  }, [meta, page]);

  const patch = (next: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.modality !== "all" ||
    filters.trainingId !== "all" ||
    filters.query !== "" ||
    filters.from !== "" ||
    filters.to !== "";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pédagogie"
        title="Sessions"
        description="Planifiez des sessions en présentiel ou en ligne pour vos formations et suivez les réponses des apprenants."
        actions={
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Nouvelle session
          </Button>
        }
      />

      <Card className="border-border/70">
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sq">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="sq"
                  className="pl-9"
                  placeholder="Titre de la session ou de la formation"
                  value={filters.query}
                  onChange={(e) => patch({ query: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={filters.status} onValueChange={(v) => patch({ status: v as SessionStatus | "all" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {SESSION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{getSessionStatusLabel(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Modalité</Label>
              <Select value={filters.modality} onValueChange={(v) => patch({ modality: v as SessionModality | "all" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les modalités</SelectItem>
                  {SESSION_MODALITIES.map((m) => (
                    <SelectItem key={m} value={m}>{sessionModalityLabels[m]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Formation</Label>
              <Select value={filters.trainingId} onValueChange={(v) => patch({ trainingId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les formations</SelectItem>
                  {trainings.map((t) => (
                    <SelectItem key={t.trainingId} value={t.trainingId}>{t.trainingTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sfrom">À partir du</Label>
              <Input id="sfrom" type="date" value={filters.from} onChange={(e) => patch({ from: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sto">Jusqu'au</Label>
              <Input id="sto" type="date" value={filters.to} onChange={(e) => patch({ to: e.target.value })} />
            </div>
          </div>

          {isRangeInvalid ? (
            <p className="text-xs text-destructive">
              La date de fin doit être postérieure ou égale à la date de début : elle est ignorée tant qu'elle est incorrecte.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Switch id="s-upcoming" checked={filters.upcoming} onCheckedChange={(v) => patch({ upcoming: v })} />
              <Label htmlFor="s-upcoming" className="cursor-pointer text-sm font-normal">À venir uniquement</Label>
            </div>
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={() => patch({ ...DEFAULT_FILTERS, upcoming: filters.upcoming })}>
                <X className="size-4" /> Réinitialiser les filtres
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger les sessions.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-6" />}
          title="Aucune session"
          description={
            hasActiveFilters
              ? "Aucune session ne correspond à ces filtres."
              : filters.upcoming
                ? "Aucune session à venir. Désactivez « À venir uniquement » pour voir les sessions passées."
                : "Vous n'avez pas encore planifié de session."
          }
        />
      ) : (
        <div className="space-y-4">
          {items.map((s) => (
            <SessionCard key={s.id} session={s} variant="global" />
          ))}
          {meta ? (
            <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={setPage} />
          ) : null}
        </div>
      )}

      <SessionFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}