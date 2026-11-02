// src/components/pages/community/reports/list/useReportFilters.ts
import { useMemo, useState } from "react";
import type { CommunityReportReason, CommunityReportStatus } from "@/data/community-moderation";
import type { CommunityReportTargetType, CommunityReportsFilters } from "@/data/community-reports";

export interface ReportFiltersState {
  status: CommunityReportStatus | "all";
  reason: CommunityReportReason | "all";
  targetType: CommunityReportTargetType | "all";
  /** "all" ou id */
  trainingId: string;
}

export const DEFAULT_REPORT_FILTERS: ReportFiltersState = {
  status: "pending",
  reason: "all",
  targetType: "all",
  trainingId: "all",
};

export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFiltersState>(DEFAULT_REPORT_FILTERS);
  const [page, setPage] = useState(1);

  const params = useMemo<CommunityReportsFilters>(
    () => ({
      status: filters.status === "all" ? undefined : filters.status,
      reason: filters.reason === "all" ? undefined : filters.reason,
      targetType: filters.targetType === "all" ? undefined : filters.targetType,
      trainingId: filters.trainingId === "all" ? undefined : filters.trainingId,
      page,
    }),
    [filters, page]
  );

  const patch = (next: Partial<ReportFiltersState>) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
  };

  /** Réinitialise les filtres en gardant l'onglet de statut */
  const reset = () => patch({ ...DEFAULT_REPORT_FILTERS, status: filters.status });

  const hasActiveFilters = filters.reason !== "all" || filters.targetType !== "all" || filters.trainingId !== "all";

  return { filters, params, page, setPage, patch, reset, hasActiveFilters };
}