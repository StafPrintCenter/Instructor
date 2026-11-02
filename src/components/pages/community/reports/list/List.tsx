import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { PaginationBar } from "@/components/site";
import type { InstructorPaginationMeta } from "@/data/pagination";
import type { CommunityReportStatus } from "@/data/community-moderation";
import type { APICommunityReport } from "@/data/community-reports";
import { cn } from "@/lib/utils";
import { ReportCard } from "./Card";
import { ReportsListError, ReportsListSkeleton } from "./ListStates";

interface ReportsListProps {
  items: APICommunityReport[];
  meta: InstructorPaginationMeta | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  page: number;
  onPageChange: (page: number) => void;
  status: CommunityReportStatus | "all";
  hasActiveFilters: boolean;
}

export function ReportsList({
  items,
  meta,
  isLoading,
  isFetching,
  isError,
  onRetry,
  page,
  onPageChange,
  status,
  hasActiveFilters,
}: ReportsListProps) {
  // Si la page courante n'existe plus (liste réduite après un traitement), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) onPageChange(meta.lastPage);
  }, [meta, page, onPageChange]);

  if (isLoading) return <ReportsListSkeleton />;
  if (isError) return <ReportsListError onRetry={onRetry} />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShieldCheck className="size-6" />}
        title="Aucun signalement"
        description={
          hasActiveFilters
            ? "Aucun signalement ne correspond à ces filtres."
            : status === "pending"
              ? "Rien à traiter pour le moment : la communauté est calme."
              : "Aucun signalement dans cette catégorie."
        }
      />
    );
  }

  return (
    <div className={cn("space-y-4 transition-opacity", isFetching && "opacity-60")}>
      {items.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
      {meta ? (
        <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}