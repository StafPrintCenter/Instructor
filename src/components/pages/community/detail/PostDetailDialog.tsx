import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { APICommunityPostDetail } from "@/data/community";
import { useCommunityPostDetail } from "@/stores/useCommunityStore";
import { PostDetailContent } from "./PostDetailContent";

interface PostDetailDialogProps {
  /** null = dialog fermé */
  postId: string | null;
  onClose: () => void;
  onEdit: (post: APICommunityPostDetail) => void;
  onDelete: (post: APICommunityPostDetail) => void;
}

export function PostDetailDialog({ postId, onClose, onEdit, onDelete }: PostDetailDialogProps) {
  const { post, isLoading, isError, refetch } = useCommunityPostDetail(postId ?? undefined);

  return (
    <Dialog open={!!postId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl leading-snug">{post?.title ?? "Publication"}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-40 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
            <AlertTriangle className="size-6 text-destructive" />
            <p className="text-sm text-muted-foreground">Impossible de charger cette publication.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="size-4" /> Réessayer
            </Button>
          </div>
        ) : !post ? (
          <p className="text-sm text-muted-foreground">Publication introuvable.</p>
        ) : (
          <PostDetailContent post={post} onEdit={() => onEdit(post)} onDelete={() => onDelete(post)} />
        )}
      </DialogContent>
    </Dialog>
  );
}