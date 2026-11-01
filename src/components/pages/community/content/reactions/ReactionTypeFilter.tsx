import { Button } from "@/components/ui/button";
import {
  COMMUNITY_REACTION_TYPES,
  communityReactionEmojis,
  type CommunityReactionType,
} from "@/data/community-reactions";

interface ReactionTypeFilterProps {
  value: CommunityReactionType | "all";
  summary: Record<string, number>;
  total: number;
  onChange: (value: CommunityReactionType | "all") => void;
}

/** Filtre par type de réaction, avec le nombre de chacune */
export function ReactionTypeFilter({ value, summary, total, onChange }: ReactionTypeFilterProps) {
  const available = COMMUNITY_REACTION_TYPES.filter((type) => (summary[type] ?? 0) > 0);

  return (
    <div className="flex flex-wrap gap-1.5">
      <Button size="sm" variant={value === "all" ? "accent" : "outline"} onClick={() => onChange("all")}>
        Toutes ({total})
      </Button>
      {available.map((type) => (
        <Button key={type} size="sm" variant={value === type ? "accent" : "outline"} onClick={() => onChange(type)}>
          {communityReactionEmojis[type]} {summary[type]}
        </Button>
      ))}
    </div>
  );
}