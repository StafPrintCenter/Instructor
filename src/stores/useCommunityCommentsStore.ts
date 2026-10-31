import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { InstructorPaginationMeta } from "@/data/pagination";
import type {
  APICommunityComment,
  CommunityCommentCreatePayload,
  CommunityCommentFilters,
  CommunityRepliesFilters,
} from "@/data/community-comments";

const resourceKey = "community";
const COMMENTS_KEY = [resourceKey, "comments"];
const REPLIES_KEY = [resourceKey, "replies"];
const POSTS_KEY = [resourceKey, "posts"];
const POST_KEY = [resourceKey, "post"];

const base = "/api/community";

interface CommentsResponse {
  data: APICommunityComment[];
  meta: InstructorPaginationMeta;
}

function toQueryString(filters: Record<string, string | number | undefined>): string {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") qp.append(key, String(value));
  }
  return qp.toString();
}

async function fetchCommentsPage(url: string, errorMessage: string): Promise<CommentsResponse> {
  const response = await instructorFetch(url);
  if (!response.ok) throw await parseApiError(response, errorMessage);
  return response.json();
}

/* ------------------------- Commentaires d'une publication ------------------------- */

/** Commentaires de premier niveau, avec `repliesCount` ; la meilleure réponse est toujours en tête */
export function useCommunityComments(postId: string | undefined, filters: CommunityCommentFilters = {}) {
  const query = useQuery({
    queryKey: [...COMMENTS_KEY, postId ?? "", filters],
    queryFn: () =>
      fetchCommentsPage(
        `${base}/posts/${postId}/comments/list?${toQueryString(filters)}`,
        "Erreur lors de la récupération des commentaires"
      ),
    enabled: !!postId,
    staleTime: 1000 * 15,
    placeholderData: keepPreviousData,
  });

  return {
    items: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/* ------------------------- Réponses d'un commentaire ------------------------- */

export function useCommunityReplies(commentId: string | undefined, filters: CommunityRepliesFilters = {}) {
  const query = useQuery({
    queryKey: [...REPLIES_KEY, commentId ?? "", filters],
    queryFn: () =>
      fetchCommentsPage(
        `${base}/comments/${commentId}/replies?${toQueryString(filters)}`,
        "Erreur lors de la récupération des réponses"
      ),
    enabled: !!commentId,
    staleTime: 1000 * 15,
    placeholderData: keepPreviousData,
  });

  return {
    items: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/* ---------------------------- Création / édition / suppression ---------------------------- */

async function createComment(postId: string, payload: CommunityCommentCreatePayload): Promise<APICommunityComment> {
  const fd = new FormData();
  fd.append("body", payload.body);
  if (payload.parentId) fd.append("parentId", payload.parentId);

  const response = await instructorFetch(`${base}/posts/${postId}/comments/create`, { method: "POST", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de l'envoi du commentaire");
  const json: { data: APICommunityComment } = await response.json();
  return json.data;
}

async function updateComment(id: string, body: string): Promise<APICommunityComment> {
  const fd = new FormData();
  fd.append("body", body);

  const response = await instructorFetch(`${base}/comments/${id}`, { method: "PUT", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la modification du commentaire");
  const json: { data: APICommunityComment } = await response.json();
  return json.data;
}

/** `reason` : motif facultatif (utile à un admin qui supprime le commentaire d'un autre) */
async function deleteComment(id: string, reason?: string): Promise<void> {
  const suffix = reason ? `?${new URLSearchParams({ reason }).toString()}` : "";

  const response = await instructorFetch(`${base}/comments/${id}${suffix}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw await parseApiError(response, "Erreur lors de la suppression du commentaire");
  }
}

function useInvalidateThread() {
  const qc = useQueryClient();
  return () =>
    Promise.all(
      [COMMENTS_KEY, REPLIES_KEY, POSTS_KEY, POST_KEY].map((queryKey) => qc.invalidateQueries({ queryKey }))
    );
}

/** Commente la publication, ou répond à un commentaire quand `parentId` est fourni */
export function useCreateCommunityComment(postId: string) {
  const invalidate = useInvalidateThread();
  return useMutation({
    mutationFn: (payload: CommunityCommentCreatePayload) => createComment(postId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateCommunityComment() {
  const invalidate = useInvalidateThread();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => updateComment(id, body),
    onSuccess: invalidate,
  });
}

export function useDeleteCommunityComment() {
  const invalidate = useInvalidateThread();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => deleteComment(id, reason),
    onSuccess: invalidate,
  });
}