import { EyeOff, Globe, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { communityPostTypeLabels, getCommunityPostTypeBadgeClass, type APICommunityPostListItem } from "@/data/community";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

export function PostBadges({ post }: { post: APICommunityPostListItem }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant="outline" className={cn("border text-[10px] font-medium", getCommunityPostTypeBadgeClass(post.type))}>
        {communityPostTypeLabels[post.type]}
      </Badge>
      <CategoryBadge category={post.category} />
      <Badge variant="secondary" className="gap-1 text-[10px]">
        {post.training ? (
          <>
            <GraduationCap className="size-3" /> {post.training.title}
          </>
        ) : (
          <>
            <Globe className="size-3" /> Communauté générale
          </>
        )}
      </Badge>
      {post.status === "hidden" ? (
        <Badge variant="outline" className="gap-1 border-destructive/30 bg-destructive/10 text-[10px] text-destructive">
          <EyeOff className="size-3" /> Masquée
        </Badge>
      ) : null}
    </div>
  );
}