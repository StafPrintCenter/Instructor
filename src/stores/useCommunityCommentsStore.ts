import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
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

/* ------------------------------ Options de requête ------------------------------ */

/** Partagées par les hooks d'affichage et par le localisateur : mêmes clés, donc même cache */
function commentsQueryOptions(postId: string, filters: CommunityCommentFilters) {
  return queryOptions({
    queryKey: [...COMMENTS_KEY, postId, filters],
    queryFn: () =>
      fetchCommentsPage(
        `${base}/posts/${postId}/comments/list?${toQueryString(filters)}`,
        "Erreur lors de la récupération des commentaires"
      ),
    staleTime: 1000 * 15,
  });
}

function repliesQueryOptions(commentId: string, filters: CommunityRepliesFilters) {
  return queryOptions({
    queryKey: [...REPLIES_KEY, commentId, filters],
    queryFn: () =>
      fetchCommentsPage(
        `${base}/comments/${commentId}/replies?${toQueryString(filters)}`,
        "Erreur lors de la récupération des réponses"
      ),
    staleTime: 1000 * 15,
  });
}

/* ------------------------- Commentaires d'une publication ------------------------- */

/** Commentaires de premier niveau, avec `repliesCount` ; la meilleure réponse est toujours en tête */
export function useCommunityComments(postId: string | undefined, filters: CommunityCommentFilters = {}) {
  const query = useQuery({
    ...commentsQueryOptions(postId ?? "", filters),
    enabled: !!postId,
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
    ...repliesQueryOptions(commentId ?? "", filters),
    enabled: !!commentId,
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

/* --------------------- Lien direct vers un commentaire (?comment=) --------------------- */

/** Où se trouve un commentaire, dans l'affichage par défaut (tri « plus anciens », sans filtre) */
export interface CommentLocation {
  /** Commentaire racine du fil qui contient la cible */
  rootId: string;
  /** Page des commentaires racines où se trouve ce fil */
  rootPage: number;
  /** Page des réponses où se trouve la cible ; null si la cible est elle-même un commentaire racine */
  replyPage: number | null;
  isRoot: boolean;
}

/** Garde-fous : un lien vers un commentaire ne doit jamais déclencher une avalanche de requêtes */
const MAX_ROOT_PAGES = 25;
const MAX_REPLY_LOOKUPS = 60;

async function findReplyPage(
  qc: QueryClient,
  rootId: string,
  commentId: string,
  budget: { left: number }
): Promise<number | null> {
  for (let page = 1; budget.left > 0; page++) {
    budget.left -= 1;
    const replies = await qc.fetchQuery(repliesQueryOptions(rootId, { page }));
    if (replies.data.some((r) => r.id === commentId)) return page;
    if (page >= replies.meta.lastPage) return null;
  }
  return null;
}

/**
 * Aucun endpoint ne renvoie un commentaire seul : on parcourt les pages de commentaires racines
 * (et, pour chaque racine qui en a, ses réponses) jusqu'à trouver la cible.
 */
async function locateComment(qc: QueryClient, postId: string, commentId: string): Promise<CommentLocation | null> {
  const budget = { left: MAX_REPLY_LOOKUPS };

  for (let page = 1; page <= MAX_ROOT_PAGES; page++) {
    const roots = await qc.fetchQuery(commentsQueryOptions(postId, { sort: "recent", page }));

    if (roots.data.some((c) => c.id === commentId)) {
      return { rootId: commentId, rootPage: page, replyPage: null, isRoot: true };
    }

    for (const root of roots.data) {
      if (root.repliesCount === 0) continue;
      const replyPage = await findReplyPage(qc, root.id, commentId, budget);
      if (replyPage !== null) return { rootId: root.id, rootPage: page, replyPage, isRoot: false };
      if (budget.left <= 0) return null;
    }

    if (page >= roots.meta.lastPage) break;
  }

  return null;
}

export function useLocateCommunityComment(postId: string | undefined, commentId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    // Hors des clés invalidées par les mutations : la localisation n'est pas recalculée à chaque commentaire envoyé
    queryKey: [resourceKey, "locate", postId ?? "", commentId ?? ""],
    queryFn: () => locateComment(qc, postId as string, commentId as string),
    enabled: !!postId && !!commentId,
    staleTime: Infinity,
    retry: false,
  });

  return {
    location: query.data ?? null,
    isSearching: query.isLoading,
    isError: query.isError,
    /** La recherche est terminée sans trouver le commentaire (supprimé, masqué ou hors garde-fous) */
    notFound: query.isSuccess && query.data === null,
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