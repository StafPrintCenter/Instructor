import { toast } from "sonner";
import type { CommunityReactionType, ReactionTarget } from "@/data/community-reactions";
import { useRemoveCommunityReaction, useSetCommunityReaction } from "@/stores/useCommunityReactionsStore";

/** Cliquer sur sa réaction actuelle la retire ; sur une autre, elle remplace l'ancienne */
export function useReactionToggle(target: ReactionTarget, myReaction: string | null) {
  const setReaction = useSetCommunityReaction();
  const removeReaction = useRemoveCommunityReaction();

  const toggle = (type: CommunityReactionType, onDone?: () => void) => {
    const callbacks = {
      onSuccess: () => onDone?.(),
      onError: (e: Error) => toast.error(e.message),
    };

    if (type === myReaction) removeReaction.mutate({ target }, callbacks);
    else setReaction.mutate({ target, type }, callbacks);
  };

  return { toggle, isPending: setReaction.isPending || removeReaction.isPending };
}