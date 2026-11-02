import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type {
  APICommunityReportDetail,
  APICommunityReportsListResponse,
  CommunityReportEscalatePayload,
  CommunityReportResolvePayload,
  CommunityReportsFilters,
} from "@/data/community-reports";
import { COMMENTS_KEY, POSTS_KEY, POST_KEY, REPLIES_KEY } from "./communityKeys";

const resourceKey = "community-reports";
const LIST_KEY = [resourceKey, "list"];
const DETAIL_KEY = [resourceKey, "detail"];

const base = "/api/instructor/community/reports";

/* ----------------------------------- Liste ----------------------------------- */

function toQueryString(filters: Record<string, string | number | undefined>): string {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") qp.append(key, String(value));
  }
  return qp.toString();
}

async function fetchReports(filters: CommunityReportsFilters): Promise<APICommunityReportsListResponse> {
  const response = await instructorFetch(`${base}/list?${toQueryString(filters)}`);
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des signalements");
  return response.json();
}

export function useCommunityReportsList(filters: CommunityReportsFilters = {}) {
  const query = useQuery({
    queryKey: [...LIST_KEY, filters],
    queryFn: () => fetchReports(filters),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData, // pas de clignotement lors d'un changement de filtre ou de page
  });

  return {
    stats: query.data?.stats ?? null,
    items: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/* ---------------------------------- Détail ---------------------------------- */

async function fetchReportDetail(id: string): Promise<APICommunityReportDetail | null> {
  const response = await instructorFetch(`${base}/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération du signalement");
  return response.json();
}

export function useCommunityReportDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: [...DETAIL_KEY, id ?? ""],
    queryFn: () => fetchReportDetail(id as string),
    enabled: !!id,
  });

  return { report: query.data ?? null, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

/* --------------------------------- Traitement --------------------------------- */

async function postReportAction(id: string, path: "resolve" | "escalate", fields: Record<string, string | undefined>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) fd.append(key, value);
  }

  const response = await instructorFetch(`${base}/${id}/${path}`, { method: "POST", body: fd });
  // 409 : déjà traité, 422 : action impossible ou note invalide
  if (!response.ok) throw await parseApiError(response, "Erreur lors du traitement du signalement");
  return (await response.json()) as APICommunityReportDetail;
}

/** Rejeter (dismiss) ou masquer le contenu (hide) */
export function useResolveCommunityReport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, note }: { id: string } & CommunityReportResolvePayload) =>
      postReportAction(id, "resolve", { action, note }),
    onSuccess: async (report, { id, action }) => {
      // Le détail est remplacé par la réponse ; la liste et ses compteurs se rechargent
      qc.setQueryData([...DETAIL_KEY, id], report);
      const keys = [LIST_KEY];
      // Masquer le contenu change aussi son état dans le fil de la communauté
      if (action === "hide") keys.push(POSTS_KEY, POST_KEY, COMMENTS_KEY, REPLIES_KEY);
      await Promise.all(keys.map((queryKey) => qc.invalidateQueries({ queryKey })));
    },
  });
}

/** Transmettre aux administrateurs : le signalement passe au niveau admin et quitte la liste du formateur */
export function useEscalateCommunityReport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string } & CommunityReportEscalatePayload) =>
      postReportAction(id, "escalate", { note }),
    onSuccess: async (report, { id }) => {
      qc.setQueryData([...DETAIL_KEY, id], report);
      await qc.invalidateQueries({ queryKey: LIST_KEY });
    },
  });
}