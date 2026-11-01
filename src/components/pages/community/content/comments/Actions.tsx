import { Pencil, Reply, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APICommunityComment } from "@/data/community-comments";
import { CommentModerationButton, ReportButton } from "../moderation";
import { ReactionBar } from "../reactions";
import { MarkBestAnswerButton } from "./MarkBestAnswerButton";

interface CommentActionsProps {
  comment: APICommunityComment;
  /** Faux si la publication est verrouillée ou masquée */
  canReply: boolean;
  /** Vrai si l'on peut désigner ce commentaire comme meilleure réponse */
  canMarkBest: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CommentActions({ comment, canReply, canMarkBest, onReply, onEdit, onDelete }: CommentActionsProps) {
  const { permissions } = comment;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <ReactionBar
        target={{ kind: "comment", id: comment.id }}
        myReaction={comment.myReaction}
        reactions={comment.reactions}
        total={comment.reactionsTotal}
        canReact={permissions.canReact}
      />

      <div className="flex flex-wrap items-center gap-1">
        {canMarkBest ? <MarkBestAnswerButton comment={comment} /> : null}
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
        {permissions.canHide ? <CommentModerationButton comment={comment} /> : null}
        {permissions.canReport ? (
          <ReportButton target={{ kind: "comment", id: comment.id }} subject="ce commentaire" variant="comment" />
        ) : null}
      </div>
    </div>
  );
}