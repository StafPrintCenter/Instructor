import { InstructorAvatar } from "@/components/pages/trainings/shared";
import { Badge } from "@/components/ui/badge";
import { communityAuthorRoleLabels, getCommunityAuthorRoleBadgeClass } from "@/data/community";
import { getReactionEmoji, getReactionLabel, type APICommunityReactionEntry } from "@/data/community-reactions";
import { relativeTime } from "@/lib/date-time";
import { cn } from "@/lib/utils";

export function ReactorItem({ entry }: { entry: APICommunityReactionEntry }) {
  const { user } = entry;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2">
      <InstructorAvatar name={user.name} photo={user.photo} size="md" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium">{user.name}</span>
          <Badge variant="outline" className={cn("border text-[10px] font-medium", getCommunityAuthorRoleBadgeClass(user.role))}>
            {communityAuthorRoleLabels[user.role]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{relativeTime(entry.reactedAt)}</p>
      </div>
      <span className="text-xl" title={getReactionLabel(entry.type)} aria-label={getReactionLabel(entry.type)}>
        {getReactionEmoji(entry.type)}
      </span>
    </li>
  );
}