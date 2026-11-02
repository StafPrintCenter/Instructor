import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { APICommunityPostListItem } from "@/data/community";
import { relativeTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";
import { PostActionButtons, PostAuthor, PostBadges, PostFlags, PostStats, PostTags } from "../../shared";

interface PostCardProps {
  post: APICommunityPostListItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  return (
    <Card className={cn("border-border/70 transition-shadow hover:shadow-md", post.isPinned && "border-primary/30")}>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <PostAuthor author={post.author} isMine={post.isMine}>
            {relativeTime(post.createdAt)}
            {post.editedAt ? " · modifiée" : ""}
          </PostAuthor>
          <PostFlags post={post} />
        </div>

        <PostBadges post={post} />

        <div className="space-y-1.5">
          <h2 className="font-display text-lg leading-snug">
            <Link to="/community/posts/$id" params={{ id: post.id }} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{post.excerpt}</p>
        </div>

        <PostTags tags={post.tags} />

        {post.status === "hidden" && post.hiddenReason ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-muted-foreground">
            Masquée par la modération : {post.hiddenReason}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
          <PostStats post={post} />
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="soft">
              <Link to="/community/posts/$id" params={{ id: post.id }}>Ouvrir</Link>
            </Button>
            <PostActionButtons post={post} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}