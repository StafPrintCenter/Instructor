import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { APICommunityPostDetail } from "@/data/community";
import type {
  APICommunityReportReceipt,
  CommunityCommentModerationAction,
  CommunityPostModerationAction,
  CommunityReportPayload,
  CommunityTarget,
} from "@/data/community-moderation";
import { COMMENTS_KEY, POSTS_KEY, POST_KEY, REPLIES_KEY } from "./communityKeys";

const base = "/api/community";

const segment = (target: CommunityTarget) => (target.kind === "post" ? "posts" : "comments");

/* -------------------------------- Signalement -------------------------------- */

async function reportContent(target: CommunityTarget, payload: CommunityReportPayload): Promise<APICommunityReportReceipt> {
  const fd = new FormData();
  fd.append("reason", payload.reason);
  if (payload.details) fd.append("details", payload.details);

  const response = await instructorFetch(`${base}/${segment(target)}/${target.id}/report`, { method: "POST", body: fd });
  // 403 : contenu personnel / accès refusé, 409 : déjà signalé, 422 : motif ou précisions invalides
  if (!response.ok) throw await parseApiError(response, "Erreur lors de l'envoi du signalement");
  return response.json();
}

export function useReportCommunityContent() {
  return useMutation({
    mutationFn: ({ target, ...payload }: { target: CommunityTarget } & CommunityReportPayload) =>
      reportContent(target, payload),
  });
}

/* -------------------------- Modération d'une publication -------------------------- */

/** La réponse est la publication complète (détail) mise à jour */
async function moderatePost(
  id: string,
  action: CommunityPostModerationAction,
  reason?: string
): Promise<APICommunityPostDetail | null> {
  const fd = new FormData();
  fd.append("action", action);
  if (reason) fd.append("reason", reason);

  const response = await instructorFetch(`${base}/posts/${id}/moderate`, { method: "POST", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la modération de la publication");

  const json = await response.json().catch(() => null);
  const post = json && typeof json === "object" && "data" in json ? json.data : json;
  return post && typeof post.id === "string" ? (post as APICommunityPostDetail) : null;
}

export function useModerateCommunityPost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: CommunityPostModerationAction; reason?: string }) =>
      moderatePost(id, action, reason),
    onSuccess: async (post, { id }) => {
      // Le détail est remplacé par la réponse ; les listes et la possibilité de commenter se rechargent
      if (post) qc.setQueryData([...POST_KEY, id], post);
      else await qc.invalidateQueries({ queryKey: POST_KEY });
      await Promise.all([POSTS_KEY, COMMENTS_KEY].map((queryKey) => qc.invalidateQueries({ queryKey })));
    },
  });
}

/* -------------------------- Modération d'un commentaire -------------------------- */

async function moderateComment(id: string, action: CommunityCommentModerationAction, reason?: string): Promise<void> {
  const fd = new FormData();
  fd.append("action", action);
  if (reason) fd.append("reason", reason);

  const response = await instructorFetch(`${base}/comments/${id}/moderate`, { method: "POST", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la modération du commentaire");
}

export function useModerateCommunityComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: CommunityCommentModerationAction; reason?: string }) =>
      moderateComment(id, action, reason),
    // Un commentaire masqué n'est plus compté dans commentsCount
    onSuccess: () =>
      Promise.all([COMMENTS_KEY, REPLIES_KEY, POSTS_KEY, POST_KEY].map((queryKey) => qc.invalidateQueries({ queryKey }))),
  });
}