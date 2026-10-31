import { CheckCircle2, Lock, Pin } from "lucide-react";
import type { APICommunityPostListItem } from "@/data/community";

export function PostFlags({ post }: { post: APICommunityPostListItem }) {
  const hasBestAnswer = post.type === "question" && !!post.bestAnswerId;

  if (!post.isPinned && !post.isLocked && !hasBestAnswer) return null;

  return (
    <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
      {post.isPinned ? <Pin className="size-4 text-primary" aria-label="Épinglée" /> : null}
      {post.isLocked ? <Lock className="size-4" aria-label="Verrouillée" /> : null}
      {hasBestAnswer ? <CheckCircle2 className="size-4 text-success" aria-label="Meilleure réponse choisie" /> : null}
    </div>
  );
}