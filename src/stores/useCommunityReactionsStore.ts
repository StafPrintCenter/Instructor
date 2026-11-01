import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type {
  APICommunityReactionSummary,
  APICommunityReactionsListResponse,
  CommunityReactionType,
  CommunityReactionsFilters,
  ReactionTarget,
} from "@/data/community-reactions";
import { COMMENTS_KEY, COMMUNITY_KEY, POSTS_KEY, POST_KEY, REACTIONS_KEY, REPLIES_KEY } from "./communityKeys";

const base = "/api/community";

const segment = (target: ReactionTarget) => (target.kind === "post" ? "posts" : "comments");

/* ----------------------------- Mise à jour du cache ----------------------------- */

/** Remplace les compteurs d'un élément dans les listes en cache (clé { data: [...] }) */
function patchLists(qc: QueryClient, queryKey: string[], id: string, summary: APICommunityReactionSummary) {
  qc.setQueriesData<{ data: { id: string }[] }>({ queryKey }, (old) =>
    old && Array.isArray(old.data)
      ? { ...old, data: old.data.map((item) => (item.id === id ? { ...item, ...summary } : item)) }
      : old
  );
}

/** Idem pour un détail en cache (publication) */
function patchDetails(qc: QueryClient, queryKey: string[], id: string, summary: APICommunityReactionSummary) {
  qc.setQueriesData<{ id: string } | null>({ queryKey }, (old) => (old && old.id === id ? { ...old, ...summary } : old));
}

function applySummary(qc: QueryClient, target: ReactionTarget, summary: APICommunityReactionSummary) {
  if (target.kind === "post") {
    patchLists(qc, POSTS_KEY, target.id, summary);
    patchDetails(qc, POST_KEY, target.id, summary);
  } else {
    patchLists(qc, COMMENTS_KEY, target.id, summary);
    patchLists(qc, REPLIES_KEY, target.id, summary);
  }
}

/** Repli si l'API ne renvoie pas les compteurs : on recharge les listes concernées */
function invalidateTarget(qc: QueryClient, target: ReactionTarget) {
  const keys = target.kind === "post" ? [POSTS_KEY, POST_KEY] : [COMMENTS_KEY, REPLIES_KEY];
  return Promise.all(keys.map((queryKey) => qc.invalidateQueries({ queryKey })));
}

/* ---------------------------------- Mutations ---------------------------------- */

async function parseSummary(response: Response): Promise<APICommunityReactionSummary | null> {
  const json = await response.json().catch(() => null);
  const summary = json && typeof json === "object" && "data" in json ? json.data : json;

  if (summary && typeof summary.reactionsTotal === "number" && summary.reactions) {
    return {
      myReaction: summary.myReaction ?? null,
      reactions: summary.reactions,
      reactionsTotal: summary.reactionsTotal,
    };
  }
  return null;
}

async function putReaction(target: ReactionTarget, type: CommunityReactionType) {
  const fd = new FormData();
  fd.append("type", type);

  const response = await instructorFetch(`${base}/${segment(target)}/${target.id}/reaction`, { method: "PUT", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de l'enregistrement de la réaction");
  return parseSummary(response);
}

async function deleteReaction(target: ReactionTarget) {
  const response = await instructorFetch(`${base}/${segment(target)}/${target.id}/reaction`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) throw await parseApiError(response, "Erreur lors du retrait de la réaction");
  return parseSummary(response);
}

function useOnReactionChanged() {
  const qc = useQueryClient();

  return async (summary: APICommunityReactionSummary | null, target: ReactionTarget) => {
    if (summary) applySummary(qc, target, summary);
    else await invalidateTarget(qc, target);
    // Le dialogue « Qui a réagi » doit refléter le changement
    await qc.invalidateQueries({ queryKey: REACTIONS_KEY });
  };
}

/** Réagir, ou changer sa réaction (PUT) */
export function useSetCommunityReaction() {
  const onChanged = useOnReactionChanged();
  return useMutation({
    mutationFn: ({ target, type }: { target: ReactionTarget; type: CommunityReactionType }) => putReaction(target, type),
    onSuccess: (summary, { target }) => onChanged(summary, target),
  });
}

/** Retirer sa réaction (DELETE) */
export function useRemoveCommunityReaction() {
  const onChanged = useOnReactionChanged();
  return useMutation({
    mutationFn: ({ target }: { target: ReactionTarget }) => deleteReaction(target),
    onSuccess: (summary, { target }) => onChanged(summary, target),
  });
}

/* ------------------------------- Qui a réagi ------------------------------- */

function toQueryString(filters: Record<string, string | number | undefined>): string {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") qp.append(key, String(value));
  }
  return qp.toString();
}

async function fetchReactions(
  target: ReactionTarget,
  filters: CommunityReactionsFilters
): Promise<APICommunityReactionsListResponse> {
  const response = await instructorFetch(
    `${base}/${segment(target)}/${target.id}/reactions/list?${toQueryString(filters)}`
  );
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des réactions");
  return response.json();
}

/** Passer `null` désactive la requête (dialogue fermé) */
export function useCommunityReactionsList(target: ReactionTarget | null, filters: CommunityReactionsFilters = {}) {
  const query = useQuery({
    queryKey: [COMMUNITY_KEY, "reactions", target?.kind ?? "", target?.id ?? "", filters],
    queryFn: () => fetchReactions(target as ReactionTarget, filters),
    enabled: !!target,
    staleTime: 1000 * 15,
    placeholderData: keepPreviousData,
  });

  return {
    summary: query.data?.summary ?? null,
    total: query.data?.total ?? 0,
    items: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}