import { toast } from "sonner";
import type { APICommunityComment } from "@/data/community-comments";
import { useCreateCommunityComment } from "@/stores/useCommunityCommentsStore";
import { CommentEditor } from "./Editor";

interface ReplyComposerProps {
  postId: string;
  /** Commentaire auquel on répond (l'API rattache la réponse au fil racine et mémorise la personne visée) */
  target: APICommunityComment;
  /** `replied` vaut true quand la réponse a bien été envoyée */
  onDone: (replied: boolean) => void;
}

export function ReplyComposer({ postId, target, onDone }: ReplyComposerProps) {
  const createComment = useCreateCommunityComment(postId);

  return (
    <div className="space-y-1.5 rounded-lg border border-border/60 bg-background p-3">
      <p className="text-xs text-muted-foreground">
        Réponse à <span className="font-medium text-foreground">{target.author.name}</span>
      </p>
      <CommentEditor
        autoFocus
        rows={2}
        placeholder="Écrire une réponse…"
        submitLabel="Répondre"
        isPending={createComment.isPending}
        onCancel={() => onDone(false)}
        onSubmit={(body) =>
          createComment.mutate(
            { body, parentId: target.id },
            {
              onSuccess: () => {
                toast.success("Réponse publiée.");
                onDone(true);
              },
              onError: (e) => toast.error(e.message),
            }
          )
        }
      />
    </div>
  );
}