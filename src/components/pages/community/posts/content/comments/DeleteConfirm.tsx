import { toast } from "sonner";
import { ConfirmDelete } from "@/components/site/InstructorBits";
import type { APICommunityComment } from "@/data/community-comments";
import { useDeleteCommunityComment } from "@/stores/useCommunityCommentsStore";

interface DeleteCommentConfirmProps {
  comment: APICommunityComment | null;
  onClose: () => void;
}

export function DeleteCommentConfirm({ comment, onClose }: DeleteCommentConfirmProps) {
  const deleteComment = useDeleteCommunityComment();
  const hasReplies = (comment?.repliesCount ?? 0) > 0;

  return (
    <ConfirmDelete
      open={!!comment}
      onOpenChange={(open) => !open && onClose()}
      title={hasReplies ? "Supprimer ce commentaire et ses réponses ?" : "Supprimer ce commentaire ?"}
      onConfirm={async () => {
        if (!comment) return;
        onClose();
        // mutateAsync : la ligne disparaît dès que la liste est rechargée, avant la fin des callbacks de mutate()
        try {
          await deleteComment.mutateAsync({ id: comment.id });
          toast.success("Commentaire supprimé.");
        } catch (e) {
          toast.error((e as Error).message);
        }
      }}
    />
  );
}