import { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PaginationBar } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CommunityAuthorRole } from "@/data/community";
import type { CommunityReactionType, ReactionTarget } from "@/data/community-reactions";
import { useCommunityReactionsList } from "@/stores/useCommunityReactionsStore";
import { FilterSelect, authorRoleOptions } from "../filters";
import { ReactionTypeFilter, ReactorItem } from "./";

interface ReactorsDialogProps {
  target: ReactionTarget;
  /** Compteurs connus avant le chargement (affichage immédiat des filtres) */
  summary: Record<string, number>;
  total: number;
  onClose: () => void;
}

/** « Qui a réagi » : filtre par type et par rôle, paginé */
export function ReactorsDialog({ target, summary, total, onClose }: ReactorsDialogProps) {
  const [type, setType] = useState<CommunityReactionType | "all">("all");
  const [role, setRole] = useState<CommunityAuthorRole | "all">("all");
  const [page, setPage] = useState(1);

  const list = useCommunityReactionsList(target, {
    type: type === "all" ? undefined : type,
    role: role === "all" ? undefined : role,
    page,
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Réactions</DialogTitle>
          <DialogDescription>Qui a réagi {target.kind === "post" ? "à cette publication" : "à ce commentaire"}.</DialogDescription>
        </DialogHeader>

        <ReactionTypeFilter
          value={type}
          summary={list.summary ?? summary}
          total={list.summary ? list.total : total}
          onChange={(next) => {
            setType(next);
            setPage(1);
          }}
        />

        <FilterSelect
          label="Rôle"
          value={role}
          options={authorRoleOptions}
          onChange={(next) => {
            setRole(next);
            setPage(1);
          }}
        />

        {list.isLoading ? (
          <div className="space-y-2">
            <div className="h-14 animate-pulse rounded-lg bg-muted" />
            <div className="h-14 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : list.isError ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center">
            <AlertTriangle className="size-5 text-destructive" />
            <p className="text-sm text-muted-foreground">Impossible de charger les réactions.</p>
            <Button variant="outline" size="sm" onClick={() => list.refetch()}>
              <RefreshCw className="size-4" /> Réessayer
            </Button>
          </div>
        ) : list.items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Aucune réaction pour ce filtre.</p>
        ) : (
          <div className="space-y-3">
            <ul className="space-y-2">
              {list.items.map((entry) => (
                <ReactorItem key={entry.id} entry={entry} />
              ))}
            </ul>
            {list.meta && list.meta.lastPage > 1 ? (
              <PaginationBar
                page={list.meta.currentPage}
                lastPage={list.meta.lastPage}
                total={list.meta.total}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}