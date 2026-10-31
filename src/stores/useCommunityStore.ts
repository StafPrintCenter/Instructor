import { useMemo } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { InstructorPaginationMeta } from "@/data/pagination";
import type {
  APICommunityCategory,
  APICommunityPostDetail,
  APICommunityPostListItem,
  CommunityPostCreatePayload,
  CommunityPostFilters,
  CommunityPostUpdatePayload,
} from "@/data/community";

const resourceKey = "community";
const CATEGORIES_KEY = [resourceKey, "categories"];
const POSTS_KEY = [resourceKey, "posts"];
const POST_KEY = [resourceKey, "post"];

/** Endpoints communs aux trois rôles : /api/community/... (et non /api/instructor/...) */
const base = "/api/community";

/* ------------------------------- Catégories ------------------------------- */

async function fetchCategories(): Promise<APICommunityCategory[]> {
  const response = await instructorFetch(`${base}/categories/list`);
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des catégories");
  const json: { data: APICommunityCategory[] } = await response.json();
  return json.data;
}

/** Catégories actives, triées par ordre d'affichage */
export function useCommunityCategories() {
  const query = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

  const categories = useMemo(
    () => (query.data ?? []).filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [query.data]
  );

  return { categories, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

/* ------------------------------ Liste des posts ------------------------------ */

interface PostsListResponse {
  data: APICommunityPostListItem[];
  meta: InstructorPaginationMeta;
}

function toQueryString(filters: CommunityPostFilters): string {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "" || value === false) continue;
    qp.append(key, value === true ? "1" : String(value));
  }
  return qp.toString();
}

async function fetchPosts(filters: CommunityPostFilters): Promise<PostsListResponse> {
  const response = await instructorFetch(`${base}/posts/list?${toQueryString(filters)}`);
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des publications");
  return response.json();
}

export function useCommunityPostsList(filters: CommunityPostFilters = {}) {
  const query = useQuery({
    queryKey: [...POSTS_KEY, filters],
    queryFn: () => fetchPosts(filters),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData, // pas de clignotement lors d'un changement de filtre ou de page
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

/* --------------------------------- Détail --------------------------------- */

async function fetchPostDetail(id: string): Promise<APICommunityPostDetail | null> {
  const response = await instructorFetch(`${base}/posts/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération de la publication");
  const json: { data: APICommunityPostDetail } = await response.json();
  return json.data;
}

export function useCommunityPostDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: [...POST_KEY, id ?? ""],
    queryFn: () => fetchPostDetail(id as string),
    enabled: !!id,
  });

  return { post: query.data ?? null, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

/* ----------------------------- Création / édition ----------------------------- */

/** Les tags partent en une chaîne séparée par des virgules ; les pièces jointes en attachments[] */
function buildPostFormData(payload: Partial<CommunityPostCreatePayload>): FormData {
  const fd = new FormData();
  if (payload.title !== undefined) fd.append("title", payload.title);
  if (payload.body !== undefined) fd.append("body", payload.body);
  if (payload.categoryId !== undefined) fd.append("categoryId", payload.categoryId);
  if (payload.trainingId !== undefined) fd.append("trainingId", payload.trainingId);
  if (payload.type !== undefined) fd.append("type", payload.type);
  if (payload.tags && payload.tags.length > 0) fd.append("tags", payload.tags.join(","));
  for (const file of payload.attachments ?? []) fd.append("attachments[]", file);
  return fd;
}

async function createPost(payload: CommunityPostCreatePayload): Promise<APICommunityPostDetail> {
  const response = await instructorFetch(`${base}/posts/create`, { method: "POST", body: buildPostFormData(payload) });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la création de la publication");
  const json: { data: APICommunityPostDetail } = await response.json();
  return json.data;
}

async function updatePost(id: string, payload: CommunityPostUpdatePayload): Promise<APICommunityPostDetail> {
  const response = await instructorFetch(`${base}/posts/${id}`, { method: "PUT", body: buildPostFormData(payload) });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la modification de la publication");
  const json: { data: APICommunityPostDetail } = await response.json();
  return json.data;
}

/** `reason` : motif facultatif, transmis en paramètre de requête */
async function deletePost(id: string, reason?: string): Promise<void> {
  const qp = new URLSearchParams();
  if (reason) qp.append("reason", reason);
  const suffix = qp.toString() ? `?${qp.toString()}` : "";

  const response = await instructorFetch(`${base}/posts/${id}${suffix}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw await parseApiError(response, "Erreur lors de la suppression de la publication");
  }
}

function useInvalidatePosts() {
  const qc = useQueryClient();
  return () =>
    Promise.all([qc.invalidateQueries({ queryKey: POSTS_KEY }), qc.invalidateQueries({ queryKey: POST_KEY })]);
}

export function useCreateCommunityPost() {
  const invalidate = useInvalidatePosts();
  return useMutation({ mutationFn: (payload: CommunityPostCreatePayload) => createPost(payload), onSuccess: invalidate });
}

export function useUpdateCommunityPost() {
  const invalidate = useInvalidatePosts();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CommunityPostUpdatePayload }) => updatePost(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCommunityPost() {
  const invalidate = useInvalidatePosts();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => deletePost(id, reason),
    onSuccess: invalidate,
  });
}