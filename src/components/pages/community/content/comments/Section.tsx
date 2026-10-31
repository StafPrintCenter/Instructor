import { useMemo, useState } from "react";
import type { APICommunityPostDetail, CommunityAuthorRole } from "@/data/community";
import type { CommunityCommentFilters, CommunityCommentSort } from "@/data/community-comments";
import { CommentsClosedNotice } from "./ClosedNotice";
import { CommentsList } from "./ListItem";
import { CommentsToolbar } from "./Toolbar";
import { NewCommentForm } from "./NewForm";

export function CommentsSection({ post }: { post: APICommunityPostDetail }) {
  const [sort, setSort] = useState<CommunityCommentSort>("oldest");
  const [authorRole, setAuthorRole] = useState<CommunityAuthorRole | "all">("all");
  const [page, setPage] = useState(1);

  const params = useMemo<CommunityCommentFilters>(
    () => ({ sort, authorRole: authorRole === "all" ? undefined : authorRole, page }),
    [sort, authorRole, page]
  );

  const canComment = post.permissions.canComment;

  return (
    <section className="space-y-4">
      {/* commentsCount inclut les réponses ; la liste ci-dessous ne pagine que les commentaires racines */}
      <h2 className="font-display text-xl">Commentaires ({post.commentsCount})</h2>

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
        params={params}
        hasActiveFilters={authorRole !== "all"}
        onPageChange={setPage}
      />
    </section>
  );
}