import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  SESSION_MODALITIES,
  SESSION_STATUSES,
  getSessionStatusLabel,
  sessionModalityLabels,
  type SessionModality,
  type SessionStatus,
} from "@/data/sessions";
import { useInstructorTrainingsList } from "@/stores/useTrainingsStore";
import type { SessionListFilters } from "./useSessionFilters";
import type { SessionView } from "./SessionViewTabs";

interface SessionFiltersProps {
  filters: SessionListFilters;
  onChange: (next: Partial<SessionListFilters>) => void;
  view: SessionView;
  isRangeInvalid: boolean;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function SessionFilters({ filters, onChange, view, isRangeInvalid, hasActiveFilters, onReset }: SessionFiltersProps) {
  const { items: trainings } = useInstructorTrainingsList({ perPage: 100 });
  const isList = view === "list";

  return (
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
                onChange={(e) => onChange({ query: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Statut</Label>
            <Select value={filters.status} onValueChange={(v) => onChange({ status: v as SessionStatus | "all" })}>
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
            <Select value={filters.modality} onValueChange={(v) => onChange({ modality: v as SessionModality | "all" })}>
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

          {isList ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="sfrom">À partir du</Label>
                <Input id="sfrom" type="date" value={filters.from} onChange={(e) => onChange({ from: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sto">Jusqu'au</Label>
                <Input id="sto" type="date" value={filters.to} onChange={(e) => onChange({ to: e.target.value })} />
              </div>
            </>
          ) : null}
        </div>

        {isList && isRangeInvalid ? (
          <p className="text-xs text-destructive">
            La date de fin doit être postérieure ou égale à la date de début : elle est ignorée tant qu'elle est incorrecte.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {isList ? (
            <div className="flex items-center gap-2">
              <Switch id="s-upcoming" checked={filters.upcoming} onCheckedChange={(v) => onChange({ upcoming: v })} />
              <Label htmlFor="s-upcoming" className="cursor-pointer text-sm font-normal">À venir uniquement</Label>
            </div>
          ) : (
            <span />
          )}
          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="size-4" /> Réinitialiser les filtres
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}