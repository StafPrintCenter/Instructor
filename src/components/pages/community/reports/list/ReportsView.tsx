import { useCommunityReportsList } from "@/stores/useCommunityReportsStore";
import { ReportFilters } from "./ReportFilters";
import { ReportStatsTabs } from "./ReportStatsTabs";
import { ReportsList } from "./ReportsList";
import { useReportFilters } from "./useReportFilters";

/** Onglets de statut + filtres + liste des signalements */
export function ReportsView() {
  const f = useReportFilters();
  const { stats, items, meta, isLoading, isFetching, isError, refetch } = useCommunityReportsList(f.params);

  return (
    <div className="space-y-6">
      <ReportStatsTabs value={f.filters.status} stats={stats} onChange={(status) => f.patch({ status })} />

      <ReportFilters
        filters={f.filters}
        hasActiveFilters={f.hasActiveFilters}
        onChange={f.patch}
        onReset={f.reset}
      />

      <ReportsList
        items={items}
        meta={meta}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => refetch()}
        page={f.page}
        onPageChange={f.setPage}
        status={f.filters.status}
        hasActiveFilters={f.hasActiveFilters}
      />
    </div>
  );
}