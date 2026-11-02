import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { APICommunityComment } from "@/data/community-comments";
import { communityCommentModerationMessages, type CommunityCommentModerationAction } from "@/data/community-moderation";
import { useModerateCommunityComment } from "@/stores/useCommunityModerationStore";
import { ModerationReasonDialog } from "./ModerationReasonDialog";

/** Masquer / rétablir un commentaire (à afficher seulement si permissions.canHide) */
export function CommentModerationButton({ comment }: { comment: APICommunityComment }) {
  const moderate = useModerateCommunityComment();
  const [hideOpen, setHideOpen] = useState(false);
  const isHidden = comment.status === "hidden";

  const run = (action: CommunityCommentModerationAction, reason?: string, onDone?: () => void) =>
    moderate.mutate(
      { id: comment.id, action, reason },
      {
        onSuccess: () => {
          toast.success(communityCommentModerationMessages[action]);
          onDone?.();
        },
        onError: (e) => toast.error(e.message),
      }
    );

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2"
        disabled={moderate.isPending}
        onClick={() => (isHidden ? run("unhide") : setHideOpen(true))}
      >
        {isHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        {isHidden ? "Rétablir" : "Masquer"}
      </Button>

      {hideOpen ? (
        <ModerationReasonDialog
          title="Masquer ce commentaire"
          description="L'auteur est notifié avec ce motif, et les signalements en attente sur ce commentaire sont clôturés."
          confirmLabel="Masquer"
          isPending={moderate.isPending}
          onClose={() => setHideOpen(false)}
          onConfirm={(reason) => run("hide", reason, () => setHideOpen(false))}
        />
      ) : null}
    </>
  );
}