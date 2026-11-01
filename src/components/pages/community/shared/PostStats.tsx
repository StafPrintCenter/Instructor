import { Eye, SmilePlus, MessageCircle, Paperclip } from "lucide-react";
import type { APICommunityPostListItem } from "@/data/community";

interface PostStatsProps {
  post: APICommunityPostListItem;
  /** Masque le compteur de réactions (la page de détail les affiche avec le sélecteur de réaction) */
  hideReactions?: boolean;
}

export function PostStats({ post, hideReactions }: PostStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5" title="Commentaires">
        <MessageCircle className="size-3.5" /> {post.commentsCount}
      </span>
      {!hideReactions ? (
        <span className="inline-flex items-center gap-1.5" title="Réactions">
          <SmilePlus className="size-3.5" /> {post.reactionsTotal}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5" title="Vues">
        <Eye className="size-3.5" /> {post.viewsCount}
      </span>
      {post.attachmentsCount > 0 ? (
        <span className="inline-flex items-center gap-1.5" title="Pièces jointes">
          <Paperclip className="size-3.5" /> {post.attachmentsCount}
        </span>
      ) : null}
    </div>
  );
}