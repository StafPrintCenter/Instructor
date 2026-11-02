import { CornerDownRight } from "lucide-react";
import type { APICommunityComment } from "@/data/community-comments";

/** « En réponse à … » : uniquement quand la réponse vise une autre réponse (sinon c'est le commentaire racine juste au-dessus) */
export function CommentReplyTo({ comment }: { comment: APICommunityComment }) {
  const target = comment.replyTo;
  if (!target || target.commentId === comment.parentId) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <CornerDownRight className="size-3.5" /> En réponse à{" "}
      <span className="font-medium text-foreground">{target.authorName}</span>
    </p>
  );
}