import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateCommunityComment } from "@/stores/useCommunityCommentsStore";
import { CommentEditor } from "./Editor";

export function NewCommentForm({ postId }: { postId: string }) {
  const createComment = useCreateCommunityComment(postId);
  const [formKey, setFormKey] = useState(0);

  return (
    <Card className="border-border/70">
      <CardContent className="p-4">
        <CommentEditor
          key={formKey}
          placeholder="Écrire un commentaire…"
          submitLabel="Commenter"
          isPending={createComment.isPending}
          onSubmit={(body) =>
            createComment.mutate(
              { body },
              {
                onSuccess: () => {
                  toast.success("Commentaire publié.");
                  setFormKey((k) => k + 1);
                },
                onError: (e) => toast.error(e.message),
              }
            )
          }
        />
      </CardContent>
    </Card>
  );
}