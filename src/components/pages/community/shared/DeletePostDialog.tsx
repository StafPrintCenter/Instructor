import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { APICommunityPostListItem } from "@/data/community";
import { useDeleteCommunityPost } from "@/stores/useCommunityStore";

interface DeletePostDialogProps {
  /** null = dialog fermé */
  post: APICommunityPostListItem | null;
  onClose: () => void;
  /** Appelé après une suppression réussie (ex. retour à la liste depuis la page de détail) */
  onDeleted?: () => void;
}

export function DeletePostDialog({ post, onClose, onDeleted }: DeletePostDialogProps) {
  const deletePost = useDeleteCommunityPost();
  const [reason, setReason] = useState("");

  // Supprimer la publication d'un autre membre : un motif (facultatif) peut être transmis
  const asModerator = !!post && !post.isMine;

  useEffect(() => {
    if (post) setReason("");
  }, [post?.id]);

  const confirm = async () => {
    if (!post) return;
    try {
      await deletePost.mutateAsync({ id: post.id, reason: asModerator ? reason.trim() || undefined : undefined });
      toast.success("Publication supprimée.");
      onClose();
      onDeleted?.();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Supprimer cette publication ?</DialogTitle>
          <DialogDescription>
            « {post?.title} » sera définitivement supprimée, avec ses commentaires.
          </DialogDescription>
        </DialogHeader>

        {asModerator ? (
          <div className="space-y-2">
            <Label htmlFor="delete-reason">Motif (optionnel)</Label>
            <Textarea id="delete-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="destructive" disabled={deletePost.isPending} onClick={confirm}>
            {deletePost.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}