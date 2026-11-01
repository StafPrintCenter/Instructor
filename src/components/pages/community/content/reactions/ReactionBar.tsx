import { useState } from "react";
import { Loader2, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReactionEmoji, getReactionLabel, type ReactionTarget } from "@/data/community-reactions";
import { ReactionSummary } from "./ReactionSummary";
import { ReactionTray } from "./ReactionTray";
import { ReactorsDialog } from "./ReactorsDialog";
import { useReactionToggle } from "./useReactionToggle";

interface ReactionBarProps {
  target: ReactionTarget;
  myReaction: string | null;
  reactions: Record<string, number>;
  total: number;
  /** permissions.canReact : sinon seul le résumé est affiché */
  canReact: boolean;
}

/** Bouton « Réagir », rangée de réactions et résumé cliquable (qui a réagi) */
export function ReactionBar({ target, myReaction, reactions, total, canReact }: ReactionBarProps) {
  const [trayOpen, setTrayOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const { toggle, isPending } = useReactionToggle(target, myReaction);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canReact ? (
        <Button
          type="button"
          size="sm"
          variant={myReaction ? "soft" : "outline"}
          className="h-8"
          aria-expanded={trayOpen}
          onClick={() => setTrayOpen((open) => !open)}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : myReaction ? (
            <span>{getReactionEmoji(myReaction)}</span>
          ) : (
            <SmilePlus className="size-4" />
          )}
          {myReaction ? getReactionLabel(myReaction) : "Réagir"}
        </Button>
      ) : null}

      {canReact && trayOpen ? (
        <ReactionTray myReaction={myReaction} disabled={isPending} onSelect={(type) => toggle(type, () => setTrayOpen(false))} />
      ) : null}

      <ReactionSummary reactions={reactions} total={total} onClick={() => setListOpen(true)} />

      {listOpen ? (
        <ReactorsDialog target={target} summary={reactions} total={total} onClose={() => setListOpen(false)} />
      ) : null}
    </div>
  );
}