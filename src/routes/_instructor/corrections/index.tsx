// src/routes/_instructor/corrections/index.tsx
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ClipboardCheck, FileText, Inbox, Paperclip, RefreshCw, Search, X } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/instructor/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstructorSubmissionBadge } from "@/components/instructor/status-badges";
import { PaginationBar } from "@/components/site";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { lessonKindLabels } from "@/data/content";
import {
  SUBMISSION_KINDS,
  SUBMISSION_STATUSES,
  gradedFilterLabels,
  instructorSubmissionStatusLabels,
  type GradedFilter,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/data/submissions";
import { useInstructorCorrectionsList } from "@/stores/useSubmissionsStore";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import { formatDateTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/_instructor/corrections/")({
  head: () => ({
    meta: [
      { title: `Corrections | Espace Formateur ${SITE.name}` },
      { name: "description", content: "Tous les travaux déposés dans vos formations : filtrez, corrigez et suivez vos corrections." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CorrectionsPage,
});

interface Filters {
  graded: GradedFilter;
  status: SubmissionStatus | "all";
  trainingId: string; // "all" ou id
  kind: SubmissionKind | "all";
  query: string;
  from: string;
  to: string;
}

const DEFAULT_FILTERS: Filters = {
  graded: "all",
  status: "all",
  trainingId: "all",
  kind: "all",
  query: "",
  from: "",
  to: "",
};

const GRADED_TABS: GradedFilter[] = ["pending", "graded", "all"];

function CorrectionsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebouncedValue(filters.query.trim());
  const isRangeInvalid = !!filters.from && !!filters.to && filters.to < filters.from;

  // L'API refuse un `to` antérieur à `from` (422) : on n'envoie pas `to` dans ce cas
  const params = useMemo(
    () => ({
      graded: filters.graded,
      status: filters.status === "all" ? undefined : filters.status,
      trainingId: filters.trainingId === "all" ? undefined : filters.trainingId,
      kind: filters.kind === "all" ? undefined : filters.kind,
      query: debouncedQuery || undefined,
      from: filters.from || undefined,
      to: isRangeInvalid ? undefined : filters.to || undefined,
      page,
    }),
    [filters.graded, filters.status, filters.trainingId, filters.kind, debouncedQuery, filters.from, filters.to, isRangeInvalid, page]
  );

  const { stats, items, meta, isLoading, isFetching, isError, refetch } = useInstructorCorrectionsList(params);
  const { items: trainings } = useInstructorTrainingsList();

  // Si la page courante n'existe plus (liste réduite après une correction), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) setPage(meta.lastPage);
  }, [meta, page]);

  const patch = (next: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.trainingId !== "all" ||
    filters.kind !== "all" ||
    filters.query !== "" ||
    filters.from !== "" ||
    filters.to !== "";

  const tabCount = (g: GradedFilter) => (stats ? (g === "all" ? stats.total : g === "pending" ? stats.pending : stats.graded) : null);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suivi"
        title="Corrections"
        description="Tous les travaux déposés dans vos formations : filtrez, ouvrez et corrigez."
      />

      {/* Indicateurs-onglets */}
      <div className="grid gap-3 sm:grid-cols-3">
        {GRADED_TABS.map((g) => {
          const active = filters.graded === g;
          const count = tabCount(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => patch({ graded: g, status: "all" })}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card hover:bg-muted/40"
              )}
              aria-pressed={active}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{gradedFilterLabels[g]}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{count ?? "-"}</p>
            </button>
          );
        })}
      </div>

      {/* Filtres */}
      <Card className="border-border/70">
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cq">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="cq"
                  className="pl-9"
                  placeholder="Nom, e-mail de l'apprenant ou titre de leçon"
                  value={filters.query}
                  onChange={(e) => patch({ query: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={filters.status} onValueChange={(v) => patch({ status: v as SubmissionStatus | "all" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {SUBMISSION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {instructorSubmissionStatusLabels[s]}
                      {stats ? ` (${stats.byStatus[s]})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Type de travail</Label>
              <Select value={filters.kind} onValueChange={(v) => patch({ kind: v as SubmissionKind | "all" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {SUBMISSION_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>{lessonKindLabels[k]}</SelectItem>
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
              <Label htmlFor="cf">Déposé à partir du</Label>
              <Input id="cf" type="date" value={filters.from} onChange={(e) => patch({ from: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ct">Déposé jusqu'au</Label>
              <Input id="ct" type="date" value={filters.to} onChange={(e) => patch({ to: e.target.value })} />
            </div>
          </div>

          {isRangeInvalid ? (
            <p className="text-xs text-destructive">
              La date de fin doit être postérieure ou égale à la date de début : elle est ignorée tant qu'elle est incorrecte.
            </p>
          ) : null}

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={() => patch({ ...DEFAULT_FILTERS, graded: filters.graded })}>
              <X className="size-4" /> Réinitialiser les filtres
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {filters.graded === "pending" ? (
        <p className="-mt-4 text-xs text-muted-foreground">Les plus anciens dépôts sont affichés en premier.</p>
      ) : null}

      {/* Liste */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg bg-muted" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">Impossible de charger les corrections.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" /> Réessayer
          </Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Aucun travail"
          description={
            hasActiveFilters
              ? "Aucun travail ne correspond à ces filtres."
              : filters.graded === "pending"
                ? "Aucun travail en attente de correction."
                : "Aucun travail n'a encore été déposé dans vos formations."
          }
        />
      ) : (
        <div className={cn("space-y-4 transition-opacity", isFetching && "opacity-60")}>
          {items.map((s) => (
            <Card key={s.submissionId} className="border-border/70">
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg leading-snug">
                        <Link to="/corrections/$id" params={{ id: s.submissionId }} className="hover:underline">
                          {s.lessonTitle}
                        </Link>
                      </h2>
                      <Badge variant="secondary" className="text-[10px]">
                        {lessonKindLabels[s.lessonKind] ?? s.lessonKind}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.trainingTitle}</p>
                  </div>
                  <InstructorSubmissionBadge status={s.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">{s.studentName}</span> · {s.studentEmail}
                  </span>
                  <span>Déposé le {formatDateTime(s.submittedAt)}</span>
                  <span className="inline-flex items-center gap-2">
                    {s.hasText ? (
                      <span className="inline-flex items-center gap-1"><FileText className="size-3.5" /> Texte</span>
                    ) : null}
                    {s.hasFile ? (
                      <span className="inline-flex items-center gap-1"><Paperclip className="size-3.5" /> Fichier</span>
                    ) : null}
                    {!s.hasText && !s.hasFile ? <span className="italic">Dépôt vide</span> : null}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {s.feedback ? (
                      <>
                        {s.feedback.note !== null ? (
                          <span className="font-medium text-foreground">Note : {s.feedback.note}/100 · </span>
                        ) : null}
                        Dernier retour le {formatDateTime(s.feedback.gradedAt)}
                      </>
                    ) : (
                      <span className="italic">
                        Pas encore corrigé
                      </span>
                    )}
                  </p>
                  <Button asChild size="sm" variant={s.isGraded ? "soft" : "accent"}>
                    <Link to="/corrections/$id" params={{ id: s.submissionId }}>
                      <ClipboardCheck className="size-4" /> {s.isGraded ? "Voir" : "Corriger"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {meta ? (
            <PaginationBar
              page={meta.currentPage}
              lastPage={meta.lastPage}
              total={meta.total}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}