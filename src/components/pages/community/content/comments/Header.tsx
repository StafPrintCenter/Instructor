import { CheckCircle2 } from "lucide-react";
import { InstructorAvatar } from "@/components/pages/trainings/shared";
import { Badge } from "@/components/ui/badge";
import { communityAuthorRoleLabels, getCommunityAuthorRoleBadgeClass } from "@/data/community";
import type { APICommunityComment } from "@/data/community-comments";
import { relativeTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";

export function CommentHeader({ comment }: { comment: APICommunityComment }) {
  const { author } = comment;

  return (
    <div className="flex items-start gap-3">
      <InstructorAvatar name={author.name} photo={author.photo} size="md" />
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium">{author.name}</span>
          <Badge variant="outline" className={cn("border text-[10px] font-medium", getCommunityAuthorRoleBadgeClass(author.role))}>
            {communityAuthorRoleLabels[author.role]}
          </Badge>
          {comment.isMine ? <Badge variant="outline" className="text-[10px]">Vous</Badge> : null}
          {comment.isPostAuthor ? <Badge variant="secondary" className="text-[10px]">Auteur</Badge> : null}
          {comment.isBestAnswer ? (
            <Badge variant="outline" className="gap-1 border-success/30 bg-success/15 text-[10px] text-success">
              <CheckCircle2 className="size-3" /> Meilleure réponse
            </Badge>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {relativeTime(comment.createdAt)}
          {comment.editedAt ? " · modifié" : ""}
        </p>
      </div>
    </div>
  );
}