import { useEffect } from "react";
import { AlertTriangle, MessagesSquare, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { PaginationBar } from "@/components/site";
import { Button } from "@/components/ui/button";
import type { APICommunityPostListItem, CommunityPostFilters } from "@/data/community";
import { useCommunityPostsList } from "@/stores/useCommunityStore";
import { cn } from "@/lib/utils";
import { PostCard } from "./Card";

export function PostsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-40 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function PostsListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground">Impossible de charger les publications.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-4" /> Réessayer
      </Button>
    </div>
  );
}

interface PostsListProps {
  params: CommunityPostFilters;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onEdit: (post: APICommunityPostListItem) => void;
  onDelete: (post: APICommunityPostListItem) => void;
}

export function PostsListItem({ params, hasActiveFilters, onPageChange, onEdit, onDelete }: PostsListProps) {
  const { items, meta, isLoading, isFetching, isError, refetch } = useCommunityPostsList(params);

  // Si la page courante n'existe plus (liste réduite après une suppression), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && (params.page ?? 1) > meta.lastPage) onPageChange(meta.lastPage);
  }, [meta, params.page, onPageChange]);

  if (isLoading) return <PostsListSkeleton />;
  if (isError) return <PostsListError onRetry={() => refetch()} />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<MessagesSquare className="size-6" />}
        title="Aucune publication"
        description={
          hasActiveFilters
            ? "Aucune publication ne correspond à ces filtres."
            : "Lancez la première discussion avec le bouton « Nouvelle publication »."
        }
      />
    );
  }

  return (
    <div className={cn("space-y-4 transition-opacity", isFetching && "opacity-60")}>
      {items.map((post) => (
        <PostCard key={post.id} post={post} onEdit={() => onEdit(post)} onDelete={() => onDelete(post)} />
      ))}
      {meta ? (
        <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}