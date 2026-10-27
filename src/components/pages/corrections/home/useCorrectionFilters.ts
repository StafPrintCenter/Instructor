import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GradedFilter, InstructorCorrectionsFilters, SubmissionKind, SubmissionStatus } from "@/data/submissions";

export interface CorrectionFiltersState {
  graded: GradedFilter;
  status: SubmissionStatus | "all";
  trainingId: string;
  kind: SubmissionKind | "all";
  query: string;
  from: string;
  to: string;
}

export const DEFAULT_CORRECTION_FILTERS: CorrectionFiltersState = {
  graded: "pending",
  status: "all",
  trainingId: "all",
  kind: "all",
  query: "",
  from: "",
  to: "",
};

export function useCorrectionFilters() {
  const [filters, setFilters] = useState<CorrectionFiltersState>(DEFAULT_CORRECTION_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebouncedValue(filters.query.trim());
  const isRangeInvalid = !!filters.from && !!filters.to && filters.to < filters.from;

  const params = useMemo<InstructorCorrectionsFilters>(
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

  const patch = (next: Partial<CorrectionFiltersState>) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  /** Changer d'onglet remet le statut à « Tous » pour éviter les combinaisons vides */
  const changeGraded = (graded: GradedFilter) => patch({ graded, status: "all" });

  const reset = () => patch({ ...DEFAULT_CORRECTION_FILTERS, graded: filters.graded });

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.trainingId !== "all" ||
    filters.kind !== "all" ||
    filters.query !== "" ||
    filters.from !== "" ||
    filters.to !== "";

  return { filters, params, page, setPage, patch, changeGraded, reset, isRangeInvalid, hasActiveFilters };
}