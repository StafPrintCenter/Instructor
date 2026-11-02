import { toast } from "sonner";
import type { APICommunityComment } from "@/data/community-comments";
import { useUpdateCommunityComment } from "@/stores/useCommunityCommentsStore";
import { CommentEditor } from "./Editor";

interface EditCommentFormProps {
  comment: APICommunityComment;
  onDone: () => void;
}

export function EditCommentForm({ comment, onDone }: EditCommentFormProps) {
  const updateComment = useUpdateCommunityComment();

  return (
    <CommentEditor
      autoFocus
      initialBody={comment.body}
      submitLabel="Enregistrer"
      isPending={updateComment.isPending}
      onCancel={onDone}
      onSubmit={(body) => {
        if (body === comment.body.trim()) {
          onDone(); // rien n'a changé
          return;
        }
        updateComment.mutate(
          { id: comment.id, body },
          {
            onSuccess: () => {
              toast.success("Commentaire modifié.");
              onDone();
            },
            onError: (e) => toast.error(e.message),
          }
        );
      }}
    />
  );
}