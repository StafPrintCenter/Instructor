import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lessonKindLabels } from "@/data/content";
import {
  SUBMISSION_KINDS,
  getStatusesForGradedFilter,
  instructorSubmissionStatusLabels,
  type APIInstructorCorrectionStats,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/data/submissions";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import type { CorrectionFiltersState } from "./home/useCorrectionFilters";

interface CorrectionFiltersProps {
  filters: CorrectionFiltersState;
  stats: APIInstructorCorrectionStats | null;
  isRangeInvalid: boolean;
  hasActiveFilters: boolean;
  onChange: (next: Partial<CorrectionFiltersState>) => void;
  onReset: () => void;
}

export function CorrectionFilters({
  filters,
  stats,
  isRangeInvalid,
  hasActiveFilters,
  onChange,
  onReset,
}: CorrectionFiltersProps) {
  const { items: trainings } = useInstructorTrainingsList();
  // Seuls les statuts cohérents avec l'onglet actif sont proposés
  const statuses = getStatusesForGradedFilter(filters.graded);

  return (
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
                onChange={(e) => onChange({ query: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Statut</Label>
            <Select value={filters.status} onValueChange={(v) => onChange({ status: v as SubmissionStatus | "all" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statuses.map((s) => (
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
            <Select value={filters.kind} onValueChange={(v) => onChange({ kind: v as SubmissionKind | "all" })}>
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
            <Select value={filters.trainingId} onValueChange={(v) => onChange({ trainingId: v })}>
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
            <Input id="cf" type="date" value={filters.from} onChange={(e) => onChange({ from: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ct">Déposé jusqu'au</Label>
            <Input id="ct" type="date" value={filters.to} onChange={(e) => onChange({ to: e.target.value })} />
          </div>
        </div>

        {isRangeInvalid ? (
          <p className="text-xs text-destructive">
            La date de fin doit être postérieure ou égale à la date de début : elle est ignorée tant qu'elle est incorrecte.
          </p>
        ) : null}

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="size-4" /> Réinitialiser les filtres
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}