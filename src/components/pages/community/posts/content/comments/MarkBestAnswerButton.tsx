import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { APICommunityComment } from "@/data/community-comments";
import { useMarkCommunityBestAnswer } from "@/stores/useCommunityBestAnswerStore";

export function MarkBestAnswerButton({ comment }: { comment: APICommunityComment }) {
  const markBestAnswer = useMarkCommunityBestAnswer(comment.postId);

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 px-2"
      disabled={markBestAnswer.isPending}
      onClick={() =>
        markBestAnswer.mutate(comment.id, {
          onSuccess: () => toast.success("Meilleure réponse définie."),
          onError: (e) => toast.error(e.message),
        })
      }
    >
      {markBestAnswer.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
      Meilleure réponse
    </Button>
  );
}