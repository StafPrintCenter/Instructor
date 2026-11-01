import { useState } from "react";
import { Eye, EyeOff, Lock, LockOpen, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { APICommunityPostDetail } from "@/data/community";
import { communityPostModerationMessages, type CommunityPostModerationAction } from "@/data/community-moderation";
import { useModerateCommunityPost } from "@/stores/useCommunityModerationStore";
import { ModerationReasonDialog } from "./ModerationReasonDialog";

/** Épingler, fermer les commentaires, masquer : chaque bouton suit la permission correspondante de l'API */
export function PostModerationBar({ post }: { post: APICommunityPostDetail }) {
  const moderate = useModerateCommunityPost();
  const [hideOpen, setHideOpen] = useState(false);

  const { canModerate, canLock, canHide } = post.permissions;
  if (!canModerate && !canLock && !canHide) return null;

  const run = (action: CommunityPostModerationAction, reason?: string, onDone?: () => void) =>
    moderate.mutate(
      { id: post.id, action, reason },
      {
        onSuccess: () => {
          toast.success(communityPostModerationMessages[action]);
          onDone?.();
        },
        onError: (e) => toast.error(e.message),
      }
    );

  const isHidden = post.status === "hidden";

  return (
    <div className="space-y-2 rounded-lg border border-dashed p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Modération</p>

      <div className="flex flex-wrap gap-2">
        {canModerate ? (
          <Button size="sm" variant="outline" disabled={moderate.isPending} onClick={() => run(post.isPinned ? "unpin" : "pin")}>
            {post.isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
            {post.isPinned ? "Retirer l'épingle" : "Épingler"}
          </Button>
        ) : null}

        {canLock ? (
          <Button size="sm" variant="outline" disabled={moderate.isPending} onClick={() => run(post.isLocked ? "unlock" : "lock")}>
            {post.isLocked ? <LockOpen className="size-4" /> : <Lock className="size-4" />}
            {post.isLocked ? "Rouvrir les commentaires" : "Fermer les commentaires"}
          </Button>
        ) : null}

        {canHide ? (
          isHidden ? (
            <Button size="sm" variant="outline" disabled={moderate.isPending} onClick={() => run("unhide")}>
              <Eye className="size-4" /> Rétablir
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled={moderate.isPending} onClick={() => setHideOpen(true)}>
              <EyeOff className="size-4" /> Masquer
            </Button>
          )
        ) : null}
      </div>

      {hideOpen ? (
        <ModerationReasonDialog
          title="Masquer cette publication"
          description="L'auteur est notifié avec ce motif, et les signalements en attente sur cette publication sont clôturés."
          confirmLabel="Masquer"
          isPending={moderate.isPending}
          onClose={() => setHideOpen(false)}
          onConfirm={(reason) => run("hide", reason, () => setHideOpen(false))}
        />
      ) : null}
    </div>
  );
}