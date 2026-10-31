import { Heart, Pencil, Reply, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APICommunityComment } from "@/data/community-comments";

interface CommentActionsProps {
  comment: APICommunityComment;
  /** Faux si la publication est verrouillée ou masquée */
  canReply: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CommentActions({ comment, canReply, onReply, onEdit, onDelete }: CommentActionsProps) {
  const { permissions } = comment;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {comment.reactionsTotal > 0 ? (
        <span className="mr-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground" title="Réactions">
          <Heart className="size-3.5" /> {comment.reactionsTotal}
        </span>
      ) : null}
      {canReply && permissions.canReply ? (
        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={onReply}>
          <Reply className="size-3.5" /> Répondre
        </Button>
      ) : null}
      {permissions.canEdit ? (
        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={onEdit}>
          <Pencil className="size-3.5" /> Modifier
        </Button>
      ) : null}
      {permissions.canDelete ? (
        <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="size-3.5" /> Supprimer
        </Button>
      ) : null}
    </div>
  );
}