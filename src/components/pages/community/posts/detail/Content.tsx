import { toast } from "sonner";
import type { APICommunityPostDetail } from "@/data/community";
import { Progress } from "@/components/ui/progress";
import { useVoteCommunityPost } from "@/stores/useCommunityStore";
import { formatDateTime } from "@/lib/date-time";
import { PostModerationBar, ReportButton } from "../content/moderation";
import { ReactionBar } from "../content/reactions";
import { PostActionButtons, PostAuthor, PostBadges, PostFlags, PostStats, PostTags } from "../../shared";
import { PostAttachments } from "./Attachments";

interface PostDetailContentProps {
  post: APICommunityPostDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostDetailContent({ post, onEdit, onDelete }: PostDetailContentProps) {
  const voteMutation = useVoteCommunityPost();
  const poll = post.type === "poll" ? post.poll : null;

  const vote = (optionId: string) => {
    voteMutation.mutate(
      { id: post.id, optionId },
      {
        onSuccess: () => toast.success("Votre vote a été enregistré."),
        onError: (error) => toast.error(error.message),
      }
    );
  };

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

      {poll ? (
        <div className="space-y-3 rounded-lg border border-border/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">Sondage</p>
            <p className="text-xs text-muted-foreground">
              {poll.totalVotes} vote{poll.totalVotes > 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-3">
            {(poll.options ?? []).map((option) => {
              const percentage = poll.totalVotes > 0 ? Math.round((option.votesCount / poll.totalVotes) * 100) : 0;
              const isMyVote = option.id === poll.myVote;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!!poll.myVote || voteMutation.isPending || post.status !== "published"}
                  onClick={() => vote(option.id)}
                  className="relative w-full overflow-hidden rounded-lg border border-border/60 px-3 py-2.5 text-left transition-colors hover:border-primary/40 disabled:cursor-default disabled:opacity-100 cursor-pointer"
                >
                  <div className="relative z-10 flex items-center gap-3 text-sm">
                    <span className="min-w-7 text-center font-semibold text-primary">{option.votesCount}</span>
                    <span className={isMyVote ? "font-medium" : ""}>
                      {option.label}{isMyVote ? " · Votre vote" : ""}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="mt-2 h-1.5" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

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