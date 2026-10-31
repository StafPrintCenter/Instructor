import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { APICommunityComment } from "@/data/community-comments";
import { CommentItem } from "./Item";
import { RepliesList } from "./RepliesList";

interface CommentThreadProps {
  comment: APICommunityComment;
  postId: string;
  canComment: boolean;
}

/** Un commentaire racine et son fil de réponses (2 niveaux) */
export function CommentThread({ comment, postId, canComment }: CommentThreadProps) {
  const [showReplies, setShowReplies] = useState(false);
  const count = comment.repliesCount;

  return (
    <div className="space-y-2">
      <CommentItem
        comment={comment}
        postId={postId}
        canComment={canComment}
        variant="root"
        onReplied={() => setShowReplies(true)}
      />

      {count > 0 ? (
        <div className="ml-6 space-y-2 border-l-2 border-border/50 pl-4 sm:ml-10">
          <Button variant="ghost" size="sm" onClick={() => setShowReplies((v) => !v)}>
            {showReplies ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            {showReplies ? "Masquer les réponses" : `Afficher ${count} réponse${count > 1 ? "s" : ""}`}
          </Button>
          {showReplies ? <RepliesList commentId={comment.id} postId={postId} canComment={canComment} /> : null}
        </div>
      ) : null}
    </div>
  );
}