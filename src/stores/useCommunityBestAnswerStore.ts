import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import { COMMENTS_KEY, POSTS_KEY, POST_KEY, REPLIES_KEY } from "./communityKeys";

/** POST /community/posts/{postId}/best-answer (champ commentId) */
async function markBestAnswer(postId: string, commentId: string): Promise<void> {
  const fd = new FormData();
  fd.append("commentId", commentId);

  const response = await instructorFetch(`/api/community/posts/${postId}/best-answer`, { method: "POST", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors du choix de la meilleure réponse");
}

export function useMarkCommunityBestAnswer(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => markBestAnswer(postId, commentId),
    // bestAnswerId du détail, ordre des commentaires (la meilleure réponse passe en tête) et badges des listes
    onSuccess: () =>
      Promise.all([POSTS_KEY, POST_KEY, COMMENTS_KEY, REPLIES_KEY].map((queryKey) => qc.invalidateQueries({ queryKey }))),
  });
}