import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APICommunityComment } from "@/data/community-comments";
import { CommentItem, RepliesList, CommentFocus } from "./";

interface CommentThreadProps {
  comment: APICommunityComment;
  postId: string;
  canComment: boolean;
  focus: CommentFocus | null;
}

/** Un commentaire racine et son fil de réponses (2 niveaux) */
export function CommentThread({ comment, postId, canComment, focus }: CommentThreadProps) {
  const count = comment.repliesCount;

  // Le lien vise une réponse de ce fil : on ouvre les réponses
  const targetsReplyInThread = !!focus && focus.rootId === comment.id && !focus.isRoot;
  const [showReplies, setShowReplies] = useState(targetsReplyInThread);

  useEffect(() => {
    if (targetsReplyInThread) setShowReplies(true);
  }, [targetsReplyInThread, focus?.commentId]);

  return (
    <div className="space-y-2">
      <CommentItem
        comment={comment}
        postId={postId}
        canComment={canComment}
        variant="root"
        highlighted={!!focus && focus.isRoot && focus.commentId === comment.id}
        onReplied={() => setShowReplies(true)}
      />

      {count > 0 ? (
        <div className="ml-6 space-y-2 border-l-2 border-border/50 pl-4 sm:ml-10">
          <Button variant="ghost" size="sm" onClick={() => setShowReplies((v) => !v)}>
            {showReplies ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            {showReplies ? "Masquer les réponses" : `Afficher ${count} réponse${count > 1 ? "s" : ""}`}
          </Button>
          {showReplies ? (
            <RepliesList
              commentId={comment.id}
              postId={postId}
              canComment={canComment}
              initialPage={targetsReplyInThread ? (focus?.replyPage ?? undefined) : undefined}
              highlightId={targetsReplyInThread ? focus?.commentId : null}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}