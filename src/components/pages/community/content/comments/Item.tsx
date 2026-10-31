import { useState } from "react";
import type { APICommunityComment } from "@/data/community-comments";
import { cn } from "@/lib/utils";
import { CommentActions, CommentHeader, CommentReplyTo, DeleteCommentConfirm, EditCommentForm, ReplyComposer } from "./";

interface CommentItemProps {
  comment: APICommunityComment;
  postId: string;
  /** Faux si la publication est verrouillée ou masquée : plus de réponse possible */
  canComment: boolean;
  variant?: "root" | "reply";
  /** Appelé après l'envoi d'une réponse (le fil s'ouvre pour la montrer) */
  onReplied?: () => void;
}

type Mode = "view" | "edit" | "reply";

export function CommentItem({ comment, postId, canComment, variant = "root", onReplied }: CommentItemProps) {
  const [mode, setMode] = useState<Mode>("view");
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border p-4",
        variant === "reply" ? "border-border/50 bg-muted/20" : "border-border/70 bg-card",
        comment.isBestAnswer && "border-success/40 bg-success/5"
      )}
    >
      <CommentHeader comment={comment} />
      <CommentReplyTo comment={comment} />

      {comment.status === "hidden" ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-muted-foreground">
          Masqué par la modération{comment.hiddenReason ? ` : ${comment.hiddenReason}` : "."}
        </p>
      ) : null}

      {mode === "edit" ? (
        <EditCommentForm comment={comment} onDone={() => setMode("view")} />
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment.body}</p>
      )}

      {mode !== "edit" ? (
        <CommentActions
          comment={comment}
          canReply={canComment}
          onReply={() => setMode("reply")}
          onEdit={() => setMode("edit")}
          onDelete={() => setConfirmDelete(true)}
        />
      ) : null}

      {mode === "reply" ? (
        <ReplyComposer
          postId={postId}
          target={comment}
          onDone={(replied) => {
            setMode("view");
            if (replied) onReplied?.();
          }}
        />
      ) : null}

      <DeleteCommentConfirm comment={confirmDelete ? comment : null} onClose={() => setConfirmDelete(false)} />
    </div>
  );
}