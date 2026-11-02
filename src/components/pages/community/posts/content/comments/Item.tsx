import { useEffect, useRef, useState } from "react";
import { CornerDownRight } from "lucide-react";
import type { APICommunityComment } from "@/data/community-comments";
import { cn } from "@/lib/utils";
import { CommentActions } from "./Actions";
import { DeleteCommentConfirm } from "./DeleteConfirm";
import { EditCommentForm } from "./EditForm";
import { CommentHeader } from "./Header";
import { ReplyComposer } from "./ReplyComposer";

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

interface CommentItemProps {
  comment: APICommunityComment;
  postId: string;
  /** Faux si la publication est verrouillée ou masquée : plus de réponse possible */
  canComment: boolean;
  /** Vrai si l'on peut désigner un commentaire racine comme meilleure réponse de la publication */
  canMarkBest?: boolean;
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
  canMarkBest = false,
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

  // Seuls les commentaires racines publiés peuvent devenir la meilleure réponse
  const markableAsBest = canMarkBest && variant === "root" && !comment.isBestAnswer && comment.status === "published";

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
          canMarkBest={markableAsBest}
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