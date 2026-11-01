import type { APICommunityPostDetail } from "@/data/community";
import { formatDateTime } from "@/lib/date-time";
import { PostModerationBar, ReportButton } from "../content/moderation";
import { ReactionBar } from "../content/reactions";
import { PostActionButtons, PostAuthor, PostBadges, PostFlags, PostStats, PostTags } from "../shared";
import { PostAttachments } from "./Attachments";

interface PostDetailContentProps {
  post: APICommunityPostDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostDetailContent({ post, onEdit, onDelete }: PostDetailContentProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PostAuthor author={post.author} isMine={post.isMine}>
          {formatDateTime(post.createdAt)}
          {post.editedAt ? ` · modifiée le ${formatDateTime(post.editedAt)}` : ""}
        </PostAuthor>
        <PostFlags post={post} />
      </div>

      <PostBadges post={post} />

      {post.status === "hidden" ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-muted-foreground">
          Cette publication est masquée par la modération{post.hiddenReason ? ` : ${post.hiddenReason}` : "."}
        </p>
      ) : null}

      <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>

      <PostTags tags={post.tags} />
      <PostAttachments attachments={post.attachments} />

      <ReactionBar
        target={{ kind: "post", id: post.id }}
        myReaction={post.myReaction}
        reactions={post.reactions}
        total={post.reactionsTotal}
        canReact={post.permissions.canReact}
      />

      <PostModerationBar post={post} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        <PostStats post={post} hideReactions />
        <div className="flex flex-wrap gap-2">
          <PostActionButtons post={post} onEdit={onEdit} onDelete={onDelete} />
          {post.permissions.canReport ? (
            <ReportButton target={{ kind: "post", id: post.id }} subject="cette publication" />
          ) : null}
        </div>
      </div>
    </div>
  );
}