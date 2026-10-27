import { useEffect } from "react";
import { AlertTriangle, CalendarDays, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/site";
import { SessionCard } from "@/components/pages/sessions";
import type { InstructorSessionFilters } from "@/data/sessions";
import { useInstructorSessionsList } from "@/stores/useSessionsStore";

interface SessionListTabProps {
  params: InstructorSessionFilters;
  onPageChange: (page: number) => void;
  hasActiveFilters: boolean;
  upcoming: boolean;
}

export function SessionListTab({ params, onPageChange, hasActiveFilters, upcoming }: SessionListTabProps) {
  const { items, meta, isLoading, isError, refetch } = useInstructorSessionsList(params);

  // Si la page courante n'existe plus (liste réduite), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && (params.page ?? 1) > meta.lastPage) onPageChange(meta.lastPage);
  }, [meta, params.page, onPageChange]);

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
        <p className="text-sm text-muted-foreground">
          Impossible de charger les sessions.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          <RefreshCw className="size-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="size-6" />}
        title="Aucune session"
        description={
          hasActiveFilters
            ? "Aucune session ne correspond à ces filtres."
            : upcoming
              ? "Aucune session à venir. Désactivez « À venir uniquement » pour voir les sessions passées."
              : "Vous n'avez pas encore planifié de session."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((s) => (
        <SessionCard
          key={s.id}
          session={s}
          variant="global"
        />
      ))}

      {meta ? (
        <PaginationBar
          page={meta.currentPage}
          lastPage={meta.lastPage}
          total={meta.total}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}