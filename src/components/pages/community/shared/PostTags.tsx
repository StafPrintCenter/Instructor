import { Badge } from "@/components/ui/badge";

export function PostTags({ tags }: { tags: string[] | null }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}