import { useEffect, useState } from "react";
import { PaginationBar } from "@/components/site";
import { useCommunityReplies } from "@/stores/useCommunityCommentsStore";
import { CommentItem, CommentsListError, CommentsListSkeleton } from "./";

interface RepliesListProps {
  commentId: string;
  postId: string;
  canComment: boolean;
  /** Page à afficher à l'ouverture (lien direct vers une réponse) */
  initialPage?: number;
  /** Réponse à mettre en évidence (lien direct) */
  highlightId?: string | null;
}

export function RepliesList({ commentId, postId, canComment, initialPage, highlightId }: RepliesListProps) {
  const [page, setPage] = useState(initialPage ?? 1);
  const { items, meta, isLoading, isError, refetch } = useCommunityReplies(commentId, { page });

  // Si la page courante n'existe plus (réponses supprimées), on recule à la dernière page
  useEffect(() => {
    if (meta && meta.lastPage >= 1 && page > meta.lastPage) setPage(meta.lastPage);
  }, [meta, page]);

  if (isLoading) return <CommentsListSkeleton rows={2} />;
  if (isError) return <CommentsListError message="Impossible de charger les réponses." onRetry={() => refetch()} />;

  return (
    <div className="space-y-2">
      {items.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          canComment={canComment}
          variant="reply"
          highlighted={reply.id === highlightId}
        />
      ))}
      {meta && meta.lastPage > 1 ? (
        <PaginationBar page={meta.currentPage} lastPage={meta.lastPage} total={meta.total} onPageChange={setPage} />
      ) : null}
    </div>
  );
}