import { useMemo, useState } from "react";
import type { APICommunityPostDetail, CommunityAuthorRole } from "@/data/community";
import type { CommunityCommentFilters, CommunityCommentSort } from "@/data/community-comments";
import { CommentsClosedNotice, CommentsList, CommentsToolbar, NewCommentForm, CommentFocusNotice, useCommentFocus } from "./";

interface CommentsSectionProps {
  post: APICommunityPostDetail;
  /** Commentaire visé par le lien (?comment=) */
  focusCommentId?: string;
  /** Retire ?comment= de l'adresse */
  onClearFocus: () => void;
}

export function CommentsSection({ post, focusCommentId, onClearFocus }: CommentsSectionProps) {
  const [sort, setSort] = useState<CommunityCommentSort>("recent");
  const [authorRole, setAuthorRole] = useState<CommunityAuthorRole | "all">("all");
  const [page, setPage] = useState(1);

  // Une fois le commentaire localisé, la liste passe sur la page qui le contient
  const { focus, isSearching, isError, notFound, retry } = useCommentFocus(post.id, focusCommentId, setPage);

  const params = useMemo<CommunityCommentFilters>(
    () => ({ sort, authorRole: authorRole === "all" ? undefined : authorRole, page }),
    [sort, authorRole, page]
  );

  const canComment = post.permissions.canComment;

  // Meilleure réponse : questions publiées, par l'auteur de la publication ou un modérateur (l'API tranche)
  const canMarkBest =
    post.type === "question" && post.status === "published" && (post.isMine || post.permissions.canModerate);

  return (
    <section className="space-y-4">
      {/* commentsCount inclut les réponses ; la liste ci-dessous ne pagine que les commentaires racines */}
      <h2 className="font-display text-xl">Commentaires ({post.commentsCount})</h2>

      {focusCommentId ? (
        <CommentFocusNotice
          isSearching={isSearching}
          isError={isError}
          notFound={notFound}
          onRetry={() => retry()}
          onClear={onClearFocus}
        />
      ) : null}

      {canComment ? <NewCommentForm postId={post.id} /> : <CommentsClosedNotice post={post} />}

      <CommentsToolbar
        sort={sort}
        authorRole={authorRole}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        onAuthorRoleChange={(next) => {
          setAuthorRole(next);
          setPage(1);
        }}
      />

      <CommentsList
        postId={post.id}
        canComment={canComment}
        canMarkBest={canMarkBest}
        params={params}
        hasActiveFilters={authorRole !== "all"}
        focus={focus}
        onPageChange={setPage}
      />
    </section>
  );
}