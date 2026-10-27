import { useEffect } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { PaginationBar } from "@/components/site";
import { Button } from "@/components/ui/button";
import type { APIInstructorCorrectionListItem, GradedFilter } from "@/data/submissions";
import type { InstructorPaginationMeta } from "@/data/pagination";
import { cn } from "@/lib/utils";
import { CorrectionListItem } from "./ListItem";

interface CorrectionsListProps {
  items: APIInstructorCorrectionListItem[];
  meta: InstructorPaginationMeta | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  page: number;
  onPageChange: (page: number) => void;
  graded: GradedFilter;
  hasActiveFilters: boolean;
}

export function CorrectionsList({
  items,
  meta,
  isLoading,
  isFetching,
  isError,
  onRetry,
  page,
  onPageChange,
  graded,
  hasActiveFilters,
}: CorrectionsListProps) {
  // Si la page courante n'existe plus (liste réduite après une correction), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) onPageChange(meta.lastPage);
  }, [meta, page, onPageChange]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="size-6 text-destructive" />
        <p className="text-sm text-muted-foreground">Impossible de charger les corrections.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" /> Réessayer
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="size-6" />}
        title="Aucun travail"
        description={
          hasActiveFilters
            ? "Aucun travail ne correspond à ces filtres."
            : graded === "pending"
              ? "Aucun travail en attente de correction."
              : "Aucun travail n'a encore été déposé dans vos formations."
        }
      />
    );
  }

  return (
    <div className={cn("space-y-4 transition-opacity", isFetching && "opacity-60")}>
      {items.map((s) => (
        <CorrectionListItem key={s.submissionId} item={s} />
      ))}
      {meta ? (
        <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}