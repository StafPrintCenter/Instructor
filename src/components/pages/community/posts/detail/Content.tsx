import { useState } from "react";
import { toast } from "sonner";
import type { APICommunityPostDetail } from "@/data/community";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [selectedOption, setSelectedOption] = useState("");
  const voteMutation = useVoteCommunityPost();
  const poll = post.type === "poll" ? post.poll : null;

  const vote = () => {
    if (!selectedOption) return;
    voteMutation.mutate(
      { id: post.id, optionId: selectedOption },
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

          {poll.myVote ? (
            <div className="space-y-3">
              {(poll.options ?? []).map((option) => {
                const percentage = poll.totalVotes > 0 ? Math.round((option.votesCount / poll.totalVotes) * 100) : 0;
                return (
                  <div key={option.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className={option.id === poll.myVote ? "font-medium" : ""}>
                        {option.label}{option.id === poll.myVote ? " · Votre vote" : ""}
                      </span>
                      <span className="text-xs text-muted-foreground">{percentage}% ({option.votesCount})</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {(poll.options ?? []).map((option) => (
                  <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm">
                    <RadioGroupItem value={option.id} id={`poll-option-${option.id}`} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
              <Button
                variant="accent"
                size="sm"
                disabled={!selectedOption || voteMutation.isPending || post.status !== "published"}
                onClick={vote}
              >
                {voteMutation.isPending ? "Vote..." : "Voter"}
              </Button>
            </>
          )}
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