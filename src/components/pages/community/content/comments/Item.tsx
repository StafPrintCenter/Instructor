import { useEffect, useRef, useState } from "react";
import type { APICommunityComment } from "@/data/community-comments";
import { cn } from "@/lib/utils";
import { CommentActions, CommentHeader, CommentReplyTo, DeleteCommentConfirm, EditCommentForm, ReplyComposer } from "./";

interface CommentItemProps {
  comment: APICommunityComment;
  postId: string;
  /** Faux si la publication est verrouillée ou masquée : plus de réponse possible */
  canComment: boolean;
  variant?: "root" | "reply";
  /** Commentaire visé par un lien (?comment=) : on défile jusqu'à lui et on le met en évidence */
  highlighted?: boolean;
  /** Appelé après l'envoi d'une réponse (le fil s'ouvre pour la montrer) */
  onReplied?: () => void;
}

type Mode = "view" | "edit" | "reply";

/** Durée de la mise en évidence d'un commentaire ciblé */
const FLASH_DURATION_MS = 4000;

export function CommentItem({
  comment,
  postId,
  canComment,
  variant = "root",
  highlighted = false,
  onReplied,
}: CommentItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!highlighted) return;

    setFlash(true);
    const frame = requestAnimationFrame(() =>
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    );
    const timer = setTimeout(() => setFlash(false), FLASH_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [highlighted]);

  return (
    <div
      ref={ref}
      id={`comment-${comment.id}`}
      className={cn(
        "scroll-mt-24 space-y-3 rounded-xl border p-4 transition-shadow duration-500",
        variant === "reply" ? "border-border/50 bg-muted/20" : "border-border/70 bg-card",
        comment.isBestAnswer && "border-success/40 bg-success/5",
        flash && "ring-2 ring-primary/60"
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