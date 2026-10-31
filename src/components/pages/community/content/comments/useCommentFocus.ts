import { useEffect, useMemo, useRef } from "react";
import { useLocateCommunityComment } from "@/stores/useCommunityCommentsStore";

/** Commentaire ciblé par le lien (?comment=) et position de son fil */
export interface CommentFocus {
  commentId: string;
  /** Commentaire racine du fil qui contient la cible */
  rootId: string;
  /** Page des réponses où se trouve la cible ; null si la cible est un commentaire racine */
  replyPage: number | null;
  isRoot: boolean;
}

/**
 * Retrouve le commentaire visé par le lien et, une fois localisé, amène la liste sur la bonne page
 * (`onLocated` reçoit la page des commentaires racines).
 */
export function useCommentFocus(postId: string, commentId: string | undefined, onLocated: (rootPage: number) => void) {
  const { location, isSearching, isError, notFound, refetch } = useLocateCommunityComment(postId, commentId);

  // Callback gardé en référence : l'effet ne doit se déclencher qu'à l'arrivée du résultat
  const onLocatedRef = useRef(onLocated);
  onLocatedRef.current = onLocated;

  useEffect(() => {
    if (location) onLocatedRef.current(location.rootPage);
  }, [location]);

  const focus = useMemo<CommentFocus | null>(
    () =>
      commentId && location
        ? { commentId, rootId: location.rootId, replyPage: location.replyPage, isRoot: location.isRoot }
        : null,
    [commentId, location]
  );

  return { focus, isSearching, isError, notFound, retry: refetch };
}