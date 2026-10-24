// src/components/instructor/sessions/list/useSessionFilters.ts
import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { InstructorSessionFilters, SessionModality, SessionStatus } from "@/data/sessions";

export interface SessionListFilters {
  status: SessionStatus | "all";
  modality: SessionModality | "all";
  trainingId: string; // "all" ou id
  upcoming: boolean;
  query: string;
  from: string;
  to: string;
}

export const DEFAULT_SESSION_FILTERS: SessionListFilters = {
  status: "all",
  modality: "all",
  trainingId: "all",
  upcoming: true,
  query: "",
  from: "",
  to: "",
};

/** Filtres communs à la liste et au calendrier */
export type SharedSessionParams = Pick<InstructorSessionFilters, "status" | "modality" | "trainingId" | "query">;

export function useSessionFilters() {
  const [filters, setFilters] = useState<SessionListFilters>(DEFAULT_SESSION_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebouncedValue(filters.query.trim());
  const isRangeInvalid = !!filters.from && !!filters.to && filters.to < filters.from;

  const sharedParams = useMemo<SharedSessionParams>(
    () => ({
      status: filters.status === "all" ? undefined : filters.status,
      modality: filters.modality === "all" ? undefined : filters.modality,
      trainingId: filters.trainingId === "all" ? undefined : filters.trainingId,
      query: debouncedQuery || undefined,
    }),
    [filters.status, filters.modality, filters.trainingId, debouncedQuery]
  );

  // Liste : `to` est ignoré s'il est antérieur à `from`
  const listParams = useMemo<InstructorSessionFilters>(
    () => ({
      ...sharedParams,
      upcoming: filters.upcoming,
      from: filters.from || undefined,
      to: isRangeInvalid ? undefined : filters.to || undefined,
      page,
    }),
    [sharedParams, filters.upcoming, filters.from, filters.to, isRangeInvalid, page]
  );

  const patch = (next: Partial<SessionListFilters>) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  const reset = () => patch({ ...DEFAULT_SESSION_FILTERS, upcoming: filters.upcoming });

  const hasSharedFilters =
    filters.status !== "all" || filters.modality !== "all" || filters.trainingId !== "all" || filters.query !== "";

  return {
    filters,
    patch,
    reset,
    page,
    setPage,
    isRangeInvalid,
    sharedParams,
    listParams,
    hasSharedFilters,
    hasActiveFilters: hasSharedFilters || filters.from !== "" || filters.to !== "",
  };
}