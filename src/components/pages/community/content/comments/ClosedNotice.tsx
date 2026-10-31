import { Lock } from "lucide-react";
import type { APICommunityPostDetail } from "@/data/community";

export function CommentsClosedNotice({ post }: { post: APICommunityPostDetail }) {
  const message =
    post.status === "hidden"
      ? "Cette publication est masquée : les commentaires sont fermés."
      : post.isLocked
        ? "Les commentaires sont fermés sur cette publication."
        : "Vous ne pouvez pas commenter cette publication.";

  return (
    <p className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
      <Lock className="size-4 shrink-0" /> {message}
    </p>
  );
}