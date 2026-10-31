import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { PaginationBar } from "@/components/site";
import type { CommunityCommentFilters } from "@/data/community-comments";
import { useCommunityComments } from "@/stores/useCommunityCommentsStore";
import { cn } from "@/lib/utils";
import { CommentThread, CommentsListError, CommentsListSkeleton } from "./";

interface CommentsListProps {
  postId: string;
  canComment: boolean;
  params: CommunityCommentFilters;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
}

export function CommentsList({ postId, canComment, params, hasActiveFilters, onPageChange }: CommentsListProps) {
  const { items, meta, isLoading, isFetching, isError, refetch } = useCommunityComments(postId, params);

  // Si la page courante n'existe plus (commentaires supprimés), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && (params.page ?? 1) > meta.lastPage) onPageChange(meta.lastPage);
  }, [meta, params.page, onPageChange]);

  if (isLoading) return <CommentsListSkeleton />;
  if (isError) return <CommentsListError message="Impossible de charger les commentaires." onRetry={() => refetch()} />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle className="size-6" />}
        title="Aucun commentaire"
        description={
          hasActiveFilters ? "Aucun commentaire ne correspond à ce filtre." : "Soyez le premier à réagir à cette publication."
        }
      />
    );
  }

  return (
    <div className={cn("space-y-4 transition-opacity", isFetching && "opacity-60")}>
      {items.map((comment) => (
        <CommentThread key={comment.id} comment={comment} postId={postId} canComment={canComment} />
      ))}
      {meta ? (
        <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}