import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationBarProps {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ page, lastPage, total, onPageChange }: PaginationBarProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-xs text-muted-foreground">
        Page {page} sur {lastPage} · {total} résultat{total > 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" /> Précédent
        </Button>
        <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          Suivant <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}