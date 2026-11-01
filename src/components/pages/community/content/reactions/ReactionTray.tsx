import {
  COMMUNITY_REACTION_TYPES,
  communityReactionEmojis,
  communityReactionLabels,
  type CommunityReactionType,
} from "@/data/community-reactions";
import { cn } from "@/lib/utils";

interface ReactionTrayProps {
  myReaction: string | null;
  disabled: boolean;
  onSelect: (type: CommunityReactionType) => void;
}

/** Rangée des 6 réactions ; la réaction actuelle est mise en évidence */
export function ReactionTray({ myReaction, disabled, onSelect }: ReactionTrayProps) {
  return (
    <div role="group" aria-label="Choisir une réaction" className="flex items-center gap-0.5 rounded-full border border-border/70 bg-card p-1 shadow-sm">
      {COMMUNITY_REACTION_TYPES.map((type) => {
        const active = type === myReaction;
        return (
          <button
            key={type}
            type="button"
            disabled={disabled}
            title={communityReactionLabels[type]}
            aria-label={communityReactionLabels[type]}
            aria-pressed={active}
            onClick={() => onSelect(type)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-lg transition-transform hover:scale-125 disabled:opacity-50",
              active && "bg-primary/10 ring-1 ring-primary/40"
            )}
          >
            {communityReactionEmojis[type]}
          </button>
        );
      })}
    </div>
  );
}