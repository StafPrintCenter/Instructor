import type { ReactNode } from "react";
import { InstructorAvatar } from "@/components/pages/trainings/shared";
import { Badge } from "@/components/ui/badge";
import {
  communityAuthorRoleLabels,
  getCommunityAuthorRoleBadgeClass,
  type APICommunityAuthor,
} from "@/data/community";
import { cn } from "@/lib/utils";

interface PostAuthorProps {
  author: APICommunityAuthor;
  isMine: boolean;
  /** Ligne secondaire (date, etc.) */
  children?: ReactNode;
}

export function PostAuthor({ author, isMine, children }: PostAuthorProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <InstructorAvatar name={author.name} photo={author.photo} size="md" />
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium">{author.name}</span>
          <Badge variant="outline" className={cn("border text-[10px] font-medium", getCommunityAuthorRoleBadgeClass(author.role))}>
            {communityAuthorRoleLabels[author.role]}
          </Badge>
          {isMine ? <Badge variant="outline" className="text-[10px]">Vous</Badge> : null}
        </div>
        {children ? <p className="text-xs text-muted-foreground">{children}</p> : null}
      </div>
    </div>
  );
}