import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api/resolve-url";
import { parseApiError } from "@/lib/api/error";
import type { InstructorPaginationMeta } from "@/data/pagination";
import type {
  APIInstructorSession,
  APIInstructorSessionDetail,
  APIInstructorSessionPendingReview,
  InstructorSessionFilters,
  InstructorSessionPayload,
  InstructorSessionUpdatePayload,
} from "@/data/sessions";
import { createResourceStore } from "./createResourceStore";

const resourceKey = "sessions";
const basePath = "trainings/sessions";

// Liste + création (réponse de création au format liste)
const listStore = createResourceStore<APIInstructorSession, InstructorSessionPayload>({ resourceKey, basePath });
// Détail + modification + suppression (réponse de PUT au format détail)
const detailStore = createResourceStore<APIInstructorSessionDetail, InstructorSessionUpdatePayload>({
  resourceKey,
  basePath,
});

export const fetchInstructorSessions = listStore.fetchList;
export const fetchInstructorSessionById = detailStore.fetchById;
export const createInstructorSession = listStore.createItem;
export const updateInstructorSession = detailStore.updateItem;
export const deleteInstructorSession = detailStore.removeItem;

export const useInstructorSessionDetail = detailStore.useDetail;
export const useCreateInstructorSession = listStore.useCreate;
export const useUpdateInstructorSession = detailStore.useUpdate;
export const useDeleteInstructorSession = detailStore.useRemove;

/** `upcoming` n'est envoyé que lorsqu'il vaut true (false laisserait croire à un filtre "passées") */
function toQueryParams(filters: InstructorSessionFilters) {
  const { upcoming, ...rest } = filters;
  return { ...rest, upcoming: upcoming ? 1 : undefined };
}

/** Sessions de toutes mes formations — GET /instructor/trainings/sessions/list */
export function useInstructorSessionsList(filters: InstructorSessionFilters = {}) {
  const { items, meta, isLoading, isError, refetch } = listStore.useList(toQueryParams(filters));
  return { items, meta: meta as InstructorPaginationMeta | null, isLoading, isError, refetch };
}

/* ---- Sessions d'une formation : GET /instructor/trainings/{trainingId}/sessions/list ---- */

interface TrainingSessionsResponse {
  data: APIInstructorSession[];
  meta: InstructorPaginationMeta;
}

async function fetchTrainingSessions(
  trainingId: string,
  filters: Omit<InstructorSessionFilters, "trainingId">
): Promise<TrainingSessionsResponse> {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(toQueryParams(filters))) {
    if (value !== undefined && value !== "") qp.append(key, String(value));
  }

  const response = await instructorFetch(`/api/instructor/trainings/${trainingId}/sessions/list?${qp.toString()}`);
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des sessions");
  return response.json();
}

export function useInstructorTrainingSessions(
  trainingId: string | undefined,
  filters: Omit<InstructorSessionFilters, "trainingId"> = {}
) {
  const query = useQuery({
    // préfixe "sessions" : invalidé par création / modification / suppression
    queryKey: [resourceKey, "training", trainingId ?? "", filters],
    queryFn: () => fetchTrainingSessions(trainingId as string, filters),
    enabled: !!trainingId,
    staleTime: 1000 * 30,
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

/* ---- Demande de réexamen : POST /instructor/trainings/sessions/{id}/review-request ---- */

async function requestSessionReview(id: string, message: string): Promise<APIInstructorSessionPendingReview> {
  const fd = new FormData();
  fd.append("message", message);

  const response = await instructorFetch(`/api/instructor/${basePath}/${id}/review-request`, {
    method: "POST",
    body: fd,
  });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la demande de réexamen");
  const json: { data: APIInstructorSessionPendingReview } = await response.json();
  return json.data;
}

export function useRequestInstructorSessionReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => requestSessionReview(id, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resourceKey] }),
  });
}